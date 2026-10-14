package com.pharmacy.service;

import com.pharmacy.model.*;
import com.pharmacy.storage.DataStore;
import java.util.Map;

public class AuthService {
    private final DataStore dataStore = DataStore.getInstance();

    public User login(String email, String password) {
        User user = dataStore.getUserByEmail(email);
        if (user != null && user.authenticate(password)) {
            return user;
        }
        return null;
    }

    public User loginWithRole(String email, String password, String expectedRole) {
        User user = login(email, password);
        if (user != null) {
            if (expectedRole != null && !expectedRole.isEmpty() && !expectedRole.equalsIgnoreCase("ALL")) {
                if (!user.getRole().equalsIgnoreCase(expectedRole)) {
                    return null; // Role mismatch
                }
            }
            return user;
        }
        return null;
    }

    public User registerPatient(String name, String email, String password, String phone,
                                String address, String bloodGroup, String dob) {
        if (dataStore.getUserByEmail(email) != null) {
            return null; // email already exists
        }
        Patient patient = new Patient(0, name, email, password, phone, address, bloodGroup, dob);
        return dataStore.registerUser(patient);
    }

    public User createUser(String role, String name, String email, String password, String phone,
                           Map<String, String> extra) {
        if (dataStore.getUserByEmail(email) != null) {
            return null; // email already exists
        }
        User newUser;
        if ("ADMIN".equalsIgnoreCase(role)) {
            String dept = extra != null ? extra.getOrDefault("department", "Central Pharmacy Administration") : "Central Pharmacy Administration";
            newUser = new Admin(0, name, email, password, phone, dept);
        } else if ("PHARMACIST".equalsIgnoreCase(role)) {
            String empId = extra != null ? extra.getOrDefault("employeeId", "EMP-PH-" + (100 + (int)(Math.random() * 900))) : "EMP-PH-101";
            String lic = extra != null ? extra.getOrDefault("pharmacyLicense", "KL-DRUG-LIC-" + (1000 + (int)(Math.random() * 9000))) : "KL-DRUG-LIC-8821";
            newUser = new Pharmacist(0, name, email, password, phone, empId, lic);
        } else if ("DOCTOR".equalsIgnoreCase(role)) {
            String spec = extra != null ? extra.getOrDefault("specialization", "General Medicine") : "General Medicine";
            String lic = extra != null ? extra.getOrDefault("licenseNumber", "KMC-" + (10000 + (int)(Math.random() * 90000))) : "KMC-48291";
            double fee = 300.0;
            try {
                if (extra != null && extra.containsKey("consultationFee")) {
                    fee = Double.parseDouble(extra.get("consultationFee"));
                }
            } catch (Exception ignored) {}
            String qual = extra != null ? extra.getOrDefault("qualification", "MBBS, MD") : "MBBS, MD";
            newUser = new Doctor(0, name, email, password, phone, spec, lic, fee, qual);
        } else {
            String addr = extra != null ? extra.getOrDefault("address", "Kannur, Kerala") : "Kannur, Kerala";
            String bg = extra != null ? extra.getOrDefault("bloodGroup", "O+") : "O+";
            String dob = extra != null ? extra.getOrDefault("dateOfBirth", "2000-01-01") : "2000-01-01";
            newUser = new Patient(0, name, email, password, phone, addr, bg, dob);
        }
        return dataStore.registerUser(newUser);
    }
}
