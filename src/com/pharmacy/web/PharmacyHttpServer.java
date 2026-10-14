package com.pharmacy.web;

import com.pharmacy.model.*;
import com.pharmacy.service.*;
import com.pharmacy.storage.DataStore;
import com.pharmacy.storage.SimpleJson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class PharmacyHttpServer {
    private final int port;
    private HttpServer server;
    private final AuthService authService = new AuthService();
    private final InventoryService inventoryService = new InventoryService();
    private final OrderService orderService = new OrderService();
    private final ConsultationService consultationService = new ConsultationService();
    private final ReportService reportService = new ReportService();
    private final DataStore dataStore = DataStore.getInstance();

    public PharmacyHttpServer(int port) {
        this.port = port;
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

        // API Endpoints
        server.createContext("/api/auth/login", this::handleLogin);
        server.createContext("/api/auth/register", this::handleRegister);
        server.createContext("/api/medicines", this::handleMedicines);
        server.createContext("/api/doctors", this::handleDoctors);
        server.createContext("/api/orders", this::handleOrders);
        server.createContext("/api/orders/status", this::handleOrderStatus);
        server.createContext("/api/consultations", this::handleConsultations);
        server.createContext("/api/prescriptions", this::handlePrescriptions);
        server.createContext("/api/bills", this::handleBills);
        server.createContext("/api/reports", this::handleReports);
        server.createContext("/api/reports/summary", this::handleReports);
        server.createContext("/api/users", this::handleUsers);

        // Static Files Handler
        server.createContext("/", this::handleStaticFiles);

        server.start();
        System.out.println("Pharmacy Management System running at: http://localhost:" + port);
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            return;
        }
        String body = readBody(exchange);
        Map<String, String> creds = SimpleJson.parseSimpleJson(body);
        String email = creds.get("email");
        String password = creds.get("password");
        String portalRole = creds.get("portalRole"); // e.g. ADMIN, DOCTOR, PHARMACIST, PATIENT

        User user = authService.login(email, password);
        if (user != null) {
            // Check strict role matching if a specific portal login was requested
            if (portalRole != null && !portalRole.isEmpty() && !portalRole.equalsIgnoreCase("ALL")) {
                if (!user.getRole().equalsIgnoreCase(portalRole)) {
                    sendResponse(exchange, 403, "{\"error\":\"Access Denied: This account is registered as a " +
                            user.getRole() + ", not an authorized " + portalRole + ". Please sign in through the " +
                            user.getRole() + " Portal.\"}", "application/json");
                    return;
                }
            }
            String json = SimpleJson.userToJson(user);
            sendResponse(exchange, 200, json, "application/json");
        } else {
            sendResponse(exchange, 401, "{\"error\":\"Invalid email address or password\"}", "application/json");
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            return;
        }
        String body = readBody(exchange);
        Map<String, String> map = SimpleJson.parseSimpleJson(body);
        User user = authService.registerPatient(
                map.get("name"), map.get("email"), map.get("password"),
                map.get("phone"), map.get("address"), map.get("bloodGroup"), map.get("dateOfBirth")
        );
        if (user != null) {
            sendResponse(exchange, 201, SimpleJson.userToJson(user), "application/json");
        } else {
            sendResponse(exchange, 400, "{\"error\":\"This email address is already registered\"}", "application/json");
        }
    }

    private void handleMedicines(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String q = params.get("q");
            String cat = params.get("category");
            String filter = params.get("filter");

            List<Medicine> list;
            if ("low".equalsIgnoreCase(filter)) {
                list = inventoryService.getLowStockMedicines(15);
            } else if ("expiry".equalsIgnoreCase(filter)) {
                list = inventoryService.getNearExpiryMedicines(60);
            } else {
                list = inventoryService.search(q, cat);
            }

            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(SimpleJson.medicineToJson(list.get(i)));
            }
            sb.append("]");
            sendResponse(exchange, 200, sb.toString(), "application/json");
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readBody(exchange);
            Map<String, String> m = SimpleJson.parseSimpleJson(body);

            int id = 0;
            try { id = Integer.parseInt(m.getOrDefault("medicineId", "0")); } catch (Exception ignored) {}
            double price = Double.parseDouble(m.getOrDefault("price", "0"));
            int stock = Integer.parseInt(m.getOrDefault("stockQuantity", "0"));
            boolean rx = Boolean.parseBoolean(m.getOrDefault("requiresPrescription", "false"));

            Medicine med = new Medicine(id, m.get("name"), m.get("category"), m.get("manufacturer"),
                    price, stock, m.get("batchNumber"), m.get("expiryDate"), rx,
                    m.get("dosageForm"), m.get("strength"), m.get("description"));

            med = inventoryService.saveOrUpdate(med);
            sendResponse(exchange, 200, SimpleJson.medicineToJson(med), "application/json");
        } else if ("DELETE".equalsIgnoreCase(method)) {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            int id = Integer.parseInt(params.getOrDefault("id", "0"));
            boolean ok = inventoryService.delete(id);
            sendResponse(exchange, 200, "{\"success\":" + ok + "}", "application/json");
        } else {
            sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
        }
    }

    private void handleDoctors(HttpExchange exchange) throws IOException {
        List<User> doctors = dataStore.getAllUsers().stream()
                .filter(u -> "DOCTOR".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < doctors.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(SimpleJson.userToJson(doctors.get(i)));
        }
        sb.append("]");
        sendResponse(exchange, 200, sb.toString(), "application/json");
    }

    private void handleOrders(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            String pId = params.get("patientId");
            List<Order> list = (pId != null) ?
                    orderService.getOrdersByPatient(Integer.parseInt(pId)) :
                    orderService.getAllOrders();

            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(SimpleJson.orderToJson(list.get(i)));
            }
            sb.append("]");
            sendResponse(exchange, 200, sb.toString(), "application/json");
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readBody(exchange);
            Map<String, String> data = SimpleJson.parseSimpleJson(body);
            int patientId = Integer.parseInt(data.get("patientId"));
            String patientName = data.get("patientName");
            int rxId = Integer.parseInt(data.getOrDefault("prescriptionId", "0"));
            String address = data.get("deliveryAddress");

            String itemsRaw = data.get("itemsSummary");
            List<OrderItem> items = new ArrayList<>();
            if (itemsRaw != null && !itemsRaw.isEmpty()) {
                String[] parts = itemsRaw.split(";");
                for (String part : parts) {
                    String[] tokens = part.split(":");
                    if (tokens.length >= 2) {
                        int medId = Integer.parseInt(tokens[0]);
                        int qty = Integer.parseInt(tokens[1]);
                        Medicine med = dataStore.getMedicineById(medId);
                        if (med != null) {
                            items.add(new OrderItem(medId, med.getName(), med.getPrice(), qty));
                        }
                    }
                }
            }

            Order placed = orderService.placeOrder(patientId, patientName, items, rxId, address);
            if (placed != null) {
                sendResponse(exchange, 201, SimpleJson.orderToJson(placed), "application/json");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Order placement failed. Check inventory stock.\"}", "application/json");
            }
        }
    }

    private void handleOrderStatus(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
            return;
        }
        Map<String, String> data = SimpleJson.parseSimpleJson(readBody(exchange));
        int orderId = Integer.parseInt(data.get("orderId"));
        String status = data.get("status");
        boolean ok = orderService.updateStatus(orderId, status);
        sendResponse(exchange, 200, "{\"success\":" + ok + "}", "application/json");
    }

    private void handleConsultations(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            List<Consultation> list;
            if (params.containsKey("patientId")) {
                list = consultationService.getPatientConsultations(Integer.parseInt(params.get("patientId")));
            } else if (params.containsKey("doctorId")) {
                list = consultationService.getDoctorConsultations(Integer.parseInt(params.get("doctorId")));
            } else {
                list = consultationService.getAllConsultations();
            }

            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(SimpleJson.consultationToJson(list.get(i)));
            }
            sb.append("]");
            sendResponse(exchange, 200, sb.toString(), "application/json");
        } else if ("POST".equalsIgnoreCase(method)) {
            Map<String, String> data = SimpleJson.parseSimpleJson(readBody(exchange));
            int patientId = Integer.parseInt(data.get("patientId"));
            String patientName = data.get("patientName");
            int doctorId = Integer.parseInt(data.get("doctorId"));
            String symptoms = data.get("symptoms");
            String date = data.get("consultationDate");
            String timeSlot = data.get("timeSlot");

            Consultation c = consultationService.bookConsultation(patientId, patientName, doctorId, symptoms, date, timeSlot);
            if (c != null) {
                sendResponse(exchange, 201, SimpleJson.consultationToJson(c), "application/json");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"Failed to book consultation\"}", "application/json");
            }
        }
    }

    private void handlePrescriptions(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            int pId = Integer.parseInt(params.getOrDefault("patientId", "0"));
            List<Prescription> list = (pId > 0) ?
                    consultationService.getPatientPrescriptions(pId) :
                    new ArrayList<>(dataStore.getAllPrescriptions());

            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(SimpleJson.prescriptionToJson(list.get(i)));
            }
            sb.append("]");
            sendResponse(exchange, 200, sb.toString(), "application/json");
        } else if ("POST".equalsIgnoreCase(method)) {
            Map<String, String> data = SimpleJson.parseSimpleJson(readBody(exchange));
            int consultId = Integer.parseInt(data.getOrDefault("consultationId", "0"));
            int patientId = Integer.parseInt(data.get("patientId"));
            String patientName = data.get("patientName");
            int doctorId = Integer.parseInt(data.get("doctorId"));
            String doctorName = data.get("doctorName");
            String date = data.get("issueDate");
            String diagnosis = data.get("diagnosis");
            String advice = data.get("advice");

            List<Prescription.PrescribedMedicine> meds = new ArrayList<>();
            String medsRaw = data.get("medicinesList");
            if (medsRaw != null && !medsRaw.isEmpty()) {
                String[] entries = medsRaw.split(";");
                for (String e : entries) {
                    String[] f = e.split("\\|");
                    if (f.length >= 4) {
                        meds.add(new Prescription.PrescribedMedicine(f[0], f[1], f[2], f[3], f.length > 4 ? f[4] : ""));
                    }
                }
            }

            Prescription rx = consultationService.issuePrescription(consultId, patientId, patientName,
                    doctorId, doctorName, date, diagnosis, advice, meds);
            sendResponse(exchange, 201, SimpleJson.prescriptionToJson(rx), "application/json");
        }
    }

    private void handleBills(HttpExchange exchange) throws IOException {
        Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
        if (params.containsKey("orderId")) {
            Bill b = dataStore.getBillByOrderId(Integer.parseInt(params.get("orderId")));
            sendResponse(exchange, 200, SimpleJson.billToJson(b), "application/json");
        } else {
            Collection<Bill> bills = dataStore.getAllBills();
            StringBuilder sb = new StringBuilder("[");
            int i = 0;
            for (Bill b : bills) {
                if (i++ > 0) sb.append(",");
                sb.append(SimpleJson.billToJson(b));
            }
            sb.append("]");
            sendResponse(exchange, 200, sb.toString(), "application/json");
        }
    }

    private void handleReports(HttpExchange exchange) throws IOException {
        String json = reportService.generateSummaryReportJson();
        sendResponse(exchange, 200, json, "application/json");
    }

    private void handleUsers(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if ("GET".equalsIgnoreCase(method)) {
            Collection<User> users = dataStore.getAllUsers();
            StringBuilder sb = new StringBuilder("[");
            int i = 0;
            for (User u : users) {
                if (i++ > 0) sb.append(",");
                sb.append(SimpleJson.userToJson(u));
            }
            sb.append("]");
            sendResponse(exchange, 200, sb.toString(), "application/json");
        } else if ("POST".equalsIgnoreCase(method)) {
            String body = readBody(exchange);
            Map<String, String> map = SimpleJson.parseSimpleJson(body);
            String role = map.getOrDefault("role", "PHARMACIST").toUpperCase();
            String name = map.get("name");
            String email = map.get("email");
            String password = map.getOrDefault("password", "pass123");
            String phone = map.getOrDefault("phone", "");

            if (name == null || email == null || name.trim().isEmpty() || email.trim().isEmpty()) {
                sendResponse(exchange, 400, "{\"error\":\"Name and Email are required\"}", "application/json");
                return;
            }

            User created = authService.createUser(role, name, email, password, phone, map);
            if (created != null) {
                sendResponse(exchange, 201, SimpleJson.userToJson(created), "application/json");
            } else {
                sendResponse(exchange, 400, "{\"error\":\"A user with this email already exists\"}", "application/json");
            }
        } else if ("DELETE".equalsIgnoreCase(method)) {
            Map<String, String> params = parseQueryParams(exchange.getRequestURI().getQuery());
            int id = Integer.parseInt(params.getOrDefault("id", "0"));
            boolean ok = dataStore.deleteUser(id);
            sendResponse(exchange, 200, "{\"success\":" + ok + "}", "application/json");
        } else {
            sendResponse(exchange, 405, "Method Not Allowed", "text/plain");
        }
    }

    // Static Web File Server
    private void handleStaticFiles(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        if (path == null || path.equals("/") || path.isEmpty()) {
            path = "/index.html";
        }

        Path filePath = Paths.get("web", path.substring(1));
        if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
            filePath = Paths.get("web", "index.html");
        }

        if (Files.exists(filePath)) {
            String mime = getMimeType(filePath.toString());
            byte[] bytes = Files.readAllBytes(filePath);
            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Cache-Control", "no-cache, no-store, must-revalidate");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        } else {
            sendResponse(exchange, 404, "404 Not Found", "text/plain");
        }
    }

    private String getMimeType(String path) {
        if (path.endsWith(".html")) return "text/html; charset=UTF-8";
        if (path.endsWith(".css")) return "text/css; charset=UTF-8";
        if (path.endsWith(".js")) return "application/javascript; charset=UTF-8";
        if (path.endsWith(".json")) return "application/json; charset=UTF-8";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }

    private void sendResponse(HttpExchange exchange, int status, String body, String contentType) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Cache-Control", "no-cache, no-store, must-revalidate");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            return br.lines().collect(Collectors.joining("\n"));
        }
    }

    private Map<String, String> parseQueryParams(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null) return map;
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=");
            if (kv.length >= 2) {
                try {
                    map.put(URLDecoder.decode(kv[0], StandardCharsets.UTF_8),
                            URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
                } catch (Exception ignored) {}
            }
        }
        return map;
    }
}
