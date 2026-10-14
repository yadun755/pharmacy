package com.pharmacy.storage;

import com.pharmacy.model.*;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class DataStore {
    private static DataStore instance;

    private final Map<Integer, User> users = new ConcurrentHashMap<>();
    private final Map<Integer, Medicine> medicines = new ConcurrentHashMap<>();
    private final Map<Integer, Order> orders = new ConcurrentHashMap<>();
    private final Map<Integer, Consultation> consultations = new ConcurrentHashMap<>();
    private final Map<Integer, Prescription> prescriptions = new ConcurrentHashMap<>();
    private final Map<Integer, Bill> bills = new ConcurrentHashMap<>();

    private final AtomicInteger userIdCounter = new AtomicInteger(100);
    private final AtomicInteger medicineIdCounter = new AtomicInteger(200);
    private final AtomicInteger orderIdCounter = new AtomicInteger(1000);
    private final AtomicInteger consultIdCounter = new AtomicInteger(500);
    private final AtomicInteger prescriptionIdCounter = new AtomicInteger(700);
    private final AtomicInteger billIdCounter = new AtomicInteger(3000);

    private DataStore() {
        seedInitialData();
    }

    public static synchronized DataStore getInstance() {
        if (instance == null) {
            instance = new DataStore();
        }
        return instance;
    }

    private void seedInitialData() {
        // Default System Users (Both St. Thomas College domain & General Pharmacy logins)
        Admin admin1 = new Admin(1, "System Admin (Navya N.C)", "admin@stthomas.ac.in", "admin123", "+91 98765 43210", "System Administration");
        Admin admin2 = new Admin(10, "Central Admin", "admin@pharmacy.com", "admin123", "+91 98765 43210", "System Administration");
        users.put(admin1.getUserId(), admin1);
        users.put(admin2.getUserId(), admin2);

        Doctor d1 = new Doctor(2, "Dr. Mathew George", "doctor.mathew@stthomas.ac.in", "doc123", "+91 94471 22334",
                "General Medicine", "KMC-48291", 300.0, "MBBS, MD (General Medicine)");
        Doctor d2 = new Doctor(3, "Dr. Sarah Thomas", "dr.sarah@stthomas.ac.in", "doc123", "+91 94472 55667",
                "Cardiology", "KMC-51029", 500.0, "MBBS, MD, DNB (Cardiology)");
        Doctor d3 = new Doctor(4, "Dr. Arun Mohan", "doctor@pharmacy.com", "doctor123", "+91 94473 88990",
                "Pediatrics", "KMC-62940", 350.0, "MBBS, DCH, MD (Pediatrics)");
        users.put(d1.getUserId(), d1);
        users.put(d2.getUserId(), d2);
        users.put(d3.getUserId(), d3);

        Pharmacist pharm1 = new Pharmacist(5, "Anjana K", "pharm.anjana@stthomas.ac.in", "pharm123", "+91 98460 11223",
                "EMP-PH-101", "KL-DRUG-LIC-8821");
        Pharmacist pharm2 = new Pharmacist(11, "Suresh Kumar", "pharmacist@pharmacy.com", "pharm123", "+91 98460 99887",
                "EMP-PH-102", "KL-DRUG-LIC-7742");
        users.put(pharm1.getUserId(), pharm1);
        users.put(pharm2.getUserId(), pharm2);

        Patient p1 = new Patient(6, "Yadunandan P", "yadhu@gmail.com", "pass123", "+91 97450 12345",
                "Mattanur, Kannur, Kerala - 670702", "O+", "2003-08-14");
        Patient p2 = new Patient(7, "Ashin Prakashan", "ashin@gmail.com", "pass123", "+91 97450 67890",
                "Vellilode, Sivapuram, Kannur", "B+", "2003-05-19");
        Patient p3 = new Patient(8, "Hriday Satheesh", "patient@pharmacy.com", "patient123", "+91 97450 99881",
                "Thalassery, Kannur, Kerala", "A+", "2003-11-02");
        users.put(p1.getUserId(), p1);
        users.put(p2.getUserId(), p2);
        users.put(p3.getUserId(), p3);

        // Medicines Catalog
        addMed(new Medicine(201, "Paracetamol 650mg (Dolo)", "Analgesics & Antipyretics", "Micro Labs", 32.0, 120, "DOL-9921", "2027-05-15", false, "Tablet", "650mg", "Effective relief for fever and mild to moderate body pain."));
        addMed(new Medicine(202, "Amoxicillin 500mg", "Antibiotics", "Cipla Ltd", 85.5, 40, "AMX-4412", "2026-12-30", true, "Capsule", "500mg", "Broad-spectrum penicillin antibiotic for bacterial infections."));
        addMed(new Medicine(203, "Azithromycin 500mg (Azee)", "Antibiotics", "Sun Pharma", 115.0, 8, "AZI-1029", "2027-01-10", true, "Tablet", "500mg", "Macrolide antibiotic for respiratory and throat infections."));
        addMed(new Medicine(204, "Metformin 500mg (Glycomet)", "Diabetes Care", "USV Pvt Ltd", 42.0, 85, "MET-8830", "2027-08-30", true, "Tablet", "500mg", "First-line oral anti-diabetic medication for Type 2 diabetes."));
        addMed(new Medicine(205, "Telmisartan 40mg (Telma)", "Cardiovascular", "Glenmark", 95.0, 60, "TEL-5501", "2027-04-12", true, "Tablet", "40mg", "Angiotensin receptor blocker for blood pressure control."));
        addMed(new Medicine(206, "Cetirizine 10mg (Cetzine)", "Antiallergic", "Dr. Reddy's", 28.0, 150, "CET-3320", "2027-10-01", false, "Tablet", "10mg", "Antihistamine for allergic rhinitis, sneezing, and skin itching."));
        addMed(new Medicine(207, "Ascoril-D Cough Syrup", "Respiratory", "Glenmark", 120.0, 6, "ASC-2019", "2026-10-28", false, "Syrup", "100ml", "Relief from dry cough, nasal congestion, and throat irritation."));
        addMed(new Medicine(208, "Limcee Vitamin C 500mg", "Vitamins & Supplements", "Abbott", 45.0, 210, "LIM-7721", "2027-12-31", false, "Chewable", "500mg", "Immunity booster and antioxidant chewable tablets."));
        addMed(new Medicine(209, "Omeprazole 20mg (Omez)", "Gastrointestinal", "Dr. Reddy's", 68.0, 95, "OMZ-6612", "2027-06-18", false, "Capsule", "20mg", "Proton pump inhibitor for heartburn, acidity, and acid reflux."));
        addMed(new Medicine(210, "Pantoprazole 40mg (Pan 40)", "Gastrointestinal", "Alkem Labs", 88.0, 110, "PAN-3104", "2027-09-10", true, "Tablet", "40mg", "Fast acting relief from severe gastric reflux and peptic ulcers."));
        addMed(new Medicine(211, "Ibuprofen 400mg (Brufen)", "Pain Relief", "Abbott", 35.0, 14, "BRU-4401", "2026-11-15", false, "Tablet", "400mg", "NSAID for inflammatory pain, joint stiffness, and headaches."));
        addMed(new Medicine(212, "Montelukast & Levocetirizine", "Respiratory", "Sun Pharma", 145.0, 50, "MON-8802", "2027-07-20", true, "Tablet", "10mg/5mg", "Relief for asthma symptoms and persistent allergic rhinitis."));

        // Sample Consultation & Prescription
        Consultation consult1 = new Consultation(501, 6, "Yadunandan P", 2, "Dr. Arun Mohan", "General Medicine",
                "High fever since 2 days, accompanied by severe headache, body chills and mild sore throat.",
                "2026-10-10", "10:30 AM", "COMPLETED", "Patient diagnosed with acute viral pharyngitis. Rest and hydration recommended.", 701);
        consultations.put(consult1.getConsultationId(), consult1);

        List<Prescription.PrescribedMedicine> rxMeds = new ArrayList<>();
        rxMeds.add(new Prescription.PrescribedMedicine("Paracetamol 650mg (Dolo)", "1 Tablet", "Three times daily after meals", "3 days", "Take plenty of water"));
        rxMeds.add(new Prescription.PrescribedMedicine("Cetirizine 10mg (Cetzine)", "1 Tablet", "Once at bedtime", "5 days", "May cause mild drowsiness"));
        Prescription rx1 = new Prescription(701, 501, 6, "Yadunandan P", 2, "Dr. Arun Mohan", "2026-10-10",
                "Viral Pharyngitis with Pyrexia", "Drink warm fluids, salt-water gargle twice daily. Return if fever persists beyond 3 days.", rxMeds);
        prescriptions.put(rx1.getPrescriptionId(), rx1);

        // Sample Order & Bill
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(new OrderItem(201, "Paracetamol 650mg (Dolo)", 32.0, 2));
        orderItems.add(new OrderItem(208, "Limcee Vitamin C 500mg", 45.0, 1));
        double subtotal = 32.0 * 2 + 45.0;
        Order ord1 = new Order(1001, 6, "Yadunandan P", orderItems, subtotal, "DELIVERED", "2026-10-10 11:15", 701,
                "Mattanur, Kannur, Kerala - 670702", "PAID");
        orders.put(ord1.getOrderId(), ord1);

        double tax = subtotal * 0.05;
        Bill b1 = new Bill(3001, 1001, 6, "Yadunandan P", subtotal, tax, 0.0, subtotal + tax, "2026-10-10", "UPI / GPay", "PAID");
        bills.put(b1.getBillId(), b1);
    }

    private void addMed(Medicine m) {
        medicines.put(m.getMedicineId(), m);
    }

    // User Operations
    public Collection<User> getAllUsers() { return users.values(); }
    public User getUserById(int id) { return users.get(id); }
    public User getUserByEmail(String email) {
        if (email == null) return null;
        for (User u : users.values()) {
            if (email.equalsIgnoreCase(u.getEmail())) return u;
        }
        return null;
    }
    public synchronized User registerUser(User user) {
        int id = userIdCounter.incrementAndGet();
        user.setUserId(id);
        users.put(id, user);
        return user;
    }
    public synchronized boolean deleteUser(int id) {
        return users.remove(id) != null;
    }

    // Medicine Operations
    public Collection<Medicine> getAllMedicines() { return medicines.values(); }
    public Medicine getMedicineById(int id) { return medicines.get(id); }
    public synchronized Medicine addMedicine(Medicine med) {
        if (med.getMedicineId() <= 0) {
            med.setMedicineId(medicineIdCounter.incrementAndGet());
        }
        medicines.put(med.getMedicineId(), med);
        return med;
    }
    public synchronized boolean updateMedicine(Medicine med) {
        if (medicines.containsKey(med.getMedicineId())) {
            medicines.put(med.getMedicineId(), med);
            return true;
        }
        return false;
    }
    public synchronized boolean deleteMedicine(int id) {
        return medicines.remove(id) != null;
    }

    // Order Operations
    public Collection<Order> getAllOrders() { return orders.values(); }
    public Order getOrderById(int id) { return orders.get(id); }
    public synchronized Order createOrder(Order order) {
        int id = orderIdCounter.incrementAndGet();
        order.setOrderId(id);
        orders.put(id, order);

        // Auto generate bill
        double subtotal = order.getTotalAmount();
        double tax = Math.round(subtotal * 0.05 * 100.0) / 100.0;
        double total = subtotal + tax;
        int billId = billIdCounter.incrementAndGet();
        Bill bill = new Bill(billId, id, order.getPatientId(), order.getPatientName(),
                subtotal, tax, 0.0, total, LocalDate.now().toString(), "Online / UPI", "PAID");
        bills.put(billId, bill);

        return order;
    }
    public synchronized boolean updateOrderStatus(int orderId, String status) {
        Order o = orders.get(orderId);
        if (o != null) {
            o.setStatus(status);
            return true;
        }
        return false;
    }

    // Consultation Operations
    public Collection<Consultation> getAllConsultations() { return consultations.values(); }
    public Consultation getConsultationById(int id) { return consultations.get(id); }
    public synchronized Consultation createConsultation(Consultation consult) {
        int id = consultIdCounter.incrementAndGet();
        consult.setConsultationId(id);
        consultations.put(id, consult);
        return consult;
    }
    public synchronized boolean updateConsultationStatus(int id, String status, String notes) {
        Consultation c = consultations.get(id);
        if (c != null) {
            c.setStatus(status);
            if (notes != null && !notes.isEmpty()) c.setDoctorNotes(notes);
            return true;
        }
        return false;
    }

    // Prescription Operations
    public Collection<Prescription> getAllPrescriptions() { return prescriptions.values(); }
    public Prescription getPrescriptionById(int id) { return prescriptions.get(id); }
    public synchronized Prescription createPrescription(Prescription rx) {
        int id = prescriptionIdCounter.incrementAndGet();
        rx.setPrescriptionId(id);
        prescriptions.put(id, rx);

        if (rx.getConsultationId() > 0) {
            Consultation c = consultations.get(rx.getConsultationId());
            if (c != null) {
                c.setPrescriptionId(id);
                c.setStatus("COMPLETED");
                if (rx.getAdvice() != null) c.setDoctorNotes(rx.getAdvice());
            }
        }
        return rx;
    }

    // Bill Operations
    public Collection<Bill> getAllBills() { return bills.values(); }
    public Bill getBillById(int id) { return bills.get(id); }
    public Bill getBillByOrderId(int orderId) {
        for (Bill b : bills.values()) {
            if (b.getOrderId() == orderId) return b;
        }
        return null;
    }
}
