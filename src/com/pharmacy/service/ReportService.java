package com.pharmacy.service;

import com.pharmacy.model.*;
import com.pharmacy.storage.DataStore;
import java.util.*;

public class ReportService {
    private final DataStore dataStore = DataStore.getInstance();

    public String generateSummaryReportJson() {
        Collection<Order> orders = dataStore.getAllOrders();
        Collection<Medicine> meds = dataStore.getAllMedicines();
        Collection<Consultation> consults = dataStore.getAllConsultations();
        Collection<User> users = dataStore.getAllUsers();
        Collection<Bill> bills = dataStore.getAllBills();

        double totalRevenue = 0;
        for (Bill b : bills) {
            totalRevenue += b.getTotalAmount();
        }
        totalRevenue = Math.round(totalRevenue * 100.0) / 100.0;

        int totalMeds = meds.size();
        int lowStockCount = 0;
        int expiredCount = 0;
        int nearExpiryCount = 0;
        double inventoryValue = 0;

        for (Medicine m : meds) {
            if (m.isLowStock(15)) lowStockCount++;
            if (m.isExpired()) expiredCount++;
            else if (m.isNearExpiry(60)) nearExpiryCount++;
            inventoryValue += (m.getPrice() * m.getStockQuantity());
        }
        inventoryValue = Math.round(inventoryValue * 100.0) / 100.0;

        long patientCount = users.stream().filter(u -> "PATIENT".equalsIgnoreCase(u.getRole())).count();
        long doctorCount = users.stream().filter(u -> "DOCTOR".equalsIgnoreCase(u.getRole())).count();
        long pharmacistCount = users.stream().filter(u -> "PHARMACIST".equalsIgnoreCase(u.getRole())).count();

        long completedConsults = consults.stream().filter(c -> "COMPLETED".equalsIgnoreCase(c.getStatus())).count();
        long scheduledConsults = consults.stream().filter(c -> "SCHEDULED".equalsIgnoreCase(c.getStatus())).count();

        return "{" +
                "\"totalRevenue\":" + totalRevenue + "," +
                "\"totalOrders\":" + orders.size() + "," +
                "\"totalOrdersPlaced\":" + orders.size() + "," +
                "\"totalMedicines\":" + totalMeds + "," +
                "\"lowStockCount\":" + lowStockCount + "," +
                "\"expiredCount\":" + expiredCount + "," +
                "\"nearExpiryCount\":" + nearExpiryCount + "," +
                "\"inventoryValue\":" + inventoryValue + "," +
                "\"totalInventoryValue\":" + inventoryValue + "," +
                "\"totalUsers\":" + users.size() + "," +
                "\"totalConsultations\":" + consults.size() + "," +
                "\"completedConsultations\":" + completedConsults + "," +
                "\"scheduledConsultations\":" + scheduledConsults + "," +
                "\"patientCount\":" + patientCount + "," +
                "\"doctorCount\":" + doctorCount + "," +
                "\"pharmacistCount\":" + pharmacistCount +
                "}";
    }
}
