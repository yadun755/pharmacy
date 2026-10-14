package com.pharmacy.storage;

import com.pharmacy.model.*;
import java.util.*;

public class SimpleJson {

    public static String escape(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            switch (ch) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (ch < ' ') {
                        String hex = String.format("%04x", (int) ch);
                        sb.append("\\u").append(hex);
                    } else {
                        sb.append(ch);
                    }
            }
        }
        return sb.toString();
    }

    public static String userToJson(User u) {
        if (u == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("{")
          .append("\"id\":").append(u.getUserId()).append(",")
          .append("\"userId\":").append(u.getUserId()).append(",")
          .append("\"name\":\"").append(escape(u.getName())).append("\",")
          .append("\"email\":\"").append(escape(u.getEmail())).append("\",")
          .append("\"role\":\"").append(escape(u.getRole())).append("\",")
          .append("\"phone\":\"").append(escape(u.getPhone())).append("\"");

        if (u instanceof Patient p) {
            sb.append(",\"address\":\"").append(escape(p.getAddress())).append("\",")
              .append("\"bloodGroup\":\"").append(escape(p.getBloodGroup())).append("\",")
              .append("\"dateOfBirth\":\"").append(escape(p.getDateOfBirth())).append("\"");
        } else if (u instanceof Doctor d) {
            sb.append(",\"specialization\":\"").append(escape(d.getSpecialization())).append("\",")
              .append("\"licenseNumber\":\"").append(escape(d.getLicenseNumber())).append("\",")
              .append("\"consultationFee\":").append(d.getConsultationFee()).append(",")
              .append("\"qualification\":\"").append(escape(d.getQualification())).append("\"");
        } else if (u instanceof Pharmacist ph) {
            sb.append(",\"employeeId\":\"").append(escape(ph.getEmployeeId())).append("\",")
              .append("\"pharmacyLicense\":\"").append(escape(ph.getPharmacyLicense())).append("\"");
        } else if (u instanceof Admin a) {
            sb.append(",\"department\":\"").append(escape(a.getDepartment())).append("\"");
        }
        sb.append("}");
        return sb.toString();
    }

    public static String medicineToJson(Medicine m) {
        if (m == null) return "null";
        return "{" +
                "\"medicineId\":" + m.getMedicineId() + "," +
                "\"name\":\"" + escape(m.getName()) + "\"," +
                "\"category\":\"" + escape(m.getCategory()) + "\"," +
                "\"manufacturer\":\"" + escape(m.getManufacturer()) + "\"," +
                "\"price\":" + m.getPrice() + "," +
                "\"stockQuantity\":" + m.getStockQuantity() + "," +
                "\"batchNumber\":\"" + escape(m.getBatchNumber()) + "\"," +
                "\"expiryDate\":\"" + escape(m.getExpiryDate()) + "\"," +
                "\"requiresPrescription\":" + m.isRequiresPrescription() + "," +
                "\"dosageForm\":\"" + escape(m.getDosageForm()) + "\"," +
                "\"strength\":\"" + escape(m.getStrength()) + "\"," +
                "\"description\":\"" + escape(m.getDescription()) + "\"," +
                "\"isLowStock\":" + m.isLowStock(15) + "," +
                "\"isExpired\":" + m.isExpired() + "," +
                "\"isNearExpiry\":" + m.isNearExpiry(60) + "," +
                "\"daysUntilExpiry\":" + m.getDaysUntilExpiry() +
                "}";
    }

    public static String orderToJson(Order o) {
        if (o == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("{")
          .append("\"orderId\":").append(o.getOrderId()).append(",")
          .append("\"patientId\":").append(o.getPatientId()).append(",")
          .append("\"patientName\":\"").append(escape(o.getPatientName())).append("\",")
          .append("\"totalAmount\":").append(o.getTotalAmount()).append(",")
          .append("\"status\":\"").append(escape(o.getStatus())).append("\",")
          .append("\"orderDate\":\"").append(escape(o.getOrderDate())).append("\",")
          .append("\"prescriptionId\":").append(o.getPrescriptionId()).append(",")
          .append("\"deliveryAddress\":\"").append(escape(o.getDeliveryAddress())).append("\",")
          .append("\"paymentStatus\":\"").append(escape(o.getPaymentStatus())).append("\",")
          .append("\"items\":[");

        List<OrderItem> items = o.getItems();
        for (int i = 0; i < items.size(); i++) {
            OrderItem it = items.get(i);
            if (i > 0) sb.append(",");
            sb.append("{")
              .append("\"medicineId\":").append(it.getMedicineId()).append(",")
              .append("\"medicineName\":\"").append(escape(it.getMedicineName())).append("\",")
              .append("\"unitPrice\":").append(it.getUnitPrice()).append(",")
              .append("\"quantity\":").append(it.getQuantity()).append(",")
              .append("\"subtotal\":").append(it.getSubtotal())
              .append("}");
        }
        sb.append("]}");
        return sb.toString();
    }

    public static String consultationToJson(Consultation c) {
        if (c == null) return "null";
        return "{" +
                "\"consultationId\":" + c.getConsultationId() + "," +
                "\"patientId\":" + c.getPatientId() + "," +
                "\"patientName\":\"" + escape(c.getPatientName()) + "\"," +
                "\"doctorId\":" + c.getDoctorId() + "," +
                "\"doctorName\":\"" + escape(c.getDoctorName()) + "\"," +
                "\"doctorSpecialization\":\"" + escape(c.getDoctorSpecialization()) + "\"," +
                "\"symptoms\":\"" + escape(c.getSymptoms()) + "\"," +
                "\"consultationDate\":\"" + escape(c.getConsultationDate()) + "\"," +
                "\"timeSlot\":\"" + escape(c.getTimeSlot()) + "\"," +
                "\"status\":\"" + escape(c.getStatus()) + "\"," +
                "\"doctorNotes\":\"" + escape(c.getDoctorNotes()) + "\"," +
                "\"prescriptionId\":" + c.getPrescriptionId() +
                "}";
    }

    public static String prescriptionToJson(Prescription rx) {
        if (rx == null) return "null";
        StringBuilder sb = new StringBuilder();
        sb.append("{")
          .append("\"prescriptionId\":").append(rx.getPrescriptionId()).append(",")
          .append("\"consultationId\":").append(rx.getConsultationId()).append(",")
          .append("\"patientId\":").append(rx.getPatientId()).append(",")
          .append("\"patientName\":\"").append(escape(rx.getPatientName())).append("\",")
          .append("\"doctorId\":").append(rx.getDoctorId()).append(",")
          .append("\"doctorName\":\"").append(escape(rx.getDoctorName())).append("\",")
          .append("\"issueDate\":\"").append(escape(rx.getIssueDate())).append("\",")
          .append("\"diagnosis\":\"").append(escape(rx.getDiagnosis())).append("\",")
          .append("\"advice\":\"").append(escape(rx.getAdvice())).append("\",")
          .append("\"medicines\":[");

        List<Prescription.PrescribedMedicine> meds = rx.getMedicines();
        for (int i = 0; i < meds.size(); i++) {
            Prescription.PrescribedMedicine m = meds.get(i);
            if (i > 0) sb.append(",");
            sb.append("{")
              .append("\"medicineName\":\"").append(escape(m.getMedicineName())).append("\",")
              .append("\"dosage\":\"").append(escape(m.getDosage())).append("\",")
              .append("\"frequency\":\"").append(escape(m.getFrequency())).append("\",")
              .append("\"duration\":\"").append(escape(m.getDuration())).append("\",")
              .append("\"instructions\":\"").append(escape(m.getInstructions())).append("\"")
              .append("}");
        }
        sb.append("]}");
        return sb.toString();
    }

    public static String billToJson(Bill b) {
        if (b == null) return "null";
        return "{" +
                "\"billId\":" + b.getBillId() + "," +
                "\"orderId\":" + b.getOrderId() + "," +
                "\"patientId\":" + b.getPatientId() + "," +
                "\"patientName\":\"" + escape(b.getPatientName()) + "\"," +
                "\"subtotal\":" + b.getSubtotal() + "," +
                "\"tax\":" + b.getTax() + "," +
                "\"taxAmount\":" + b.getTax() + "," +
                "\"discount\":" + b.getDiscount() + "," +
                "\"totalAmount\":" + b.getTotalAmount() + "," +
                "\"grandTotal\":" + b.getTotalAmount() + "," +
                "\"paymentDate\":\"" + escape(b.getPaymentDate()) + "\"," +
                "\"paymentMethod\":\"" + escape(b.getPaymentMethod()) + "\"," +
                "\"paymentStatus\":\"" + escape(b.getPaymentStatus()) + "\"" +
                "}";
    }

    public static Map<String, String> parseSimpleJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null) return map;
        String trimmed = json.trim();
        if (trimmed.startsWith("{")) trimmed = trimmed.substring(1);
        if (trimmed.endsWith("}")) trimmed = trimmed.substring(0, trimmed.length() - 1);

        boolean inQuote = false;
        StringBuilder currentKey = new StringBuilder();
        StringBuilder currentValue = new StringBuilder();
        boolean parsingKey = true;

        for (int i = 0; i < trimmed.length(); i++) {
            char c = trimmed.charAt(i);
            if (c == '"' && (i == 0 || trimmed.charAt(i - 1) != '\\')) {
                inQuote = !inQuote;
                continue;
            }

            if (!inQuote) {
                if (c == ':') {
                    parsingKey = false;
                    continue;
                } else if (c == ',') {
                    String k = currentKey.toString().trim();
                    String v = currentValue.toString().trim();
                    if (!k.isEmpty()) {
                        map.put(k, unescape(v));
                    }
                    currentKey.setLength(0);
                    currentValue.setLength(0);
                    parsingKey = true;
                    continue;
                }
            }

            if (parsingKey) {
                currentKey.append(c);
            } else {
                currentValue.append(c);
            }
        }

        String k = currentKey.toString().trim();
        String v = currentValue.toString().trim();
        if (!k.isEmpty()) {
            map.put(k, unescape(v));
        }
        return map;
    }

    private static String unescape(String s) {
        if (s == null) return "";
        if (s.startsWith("\"") && s.endsWith("\"") && s.length() >= 2) {
            s = s.substring(1, s.length() - 1);
        }
        return s.replace("\\\"", "\"").replace("\\\\", "\\").replace("\\n", "\n").replace("\\t", "\t");
    }
}
