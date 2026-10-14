package com.pharmacy.model;

public class Pharmacist extends User {
    private String employeeId;
    private String pharmacyLicense;

    public Pharmacist() {
        super();
        this.role = "PHARMACIST";
    }

    public Pharmacist(int userId, String name, String email, String password, String phone,
                      String employeeId, String pharmacyLicense) {
        super(userId, name, email, password, "PHARMACIST", phone);
        this.employeeId = employeeId;
        this.pharmacyLicense = pharmacyLicense;
    }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getPharmacyLicense() { return pharmacyLicense; }
    public void setPharmacyLicense(String pharmacyLicense) { this.pharmacyLicense = pharmacyLicense; }
}
