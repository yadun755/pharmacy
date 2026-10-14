package com.pharmacy.model;

public class Patient extends User {
    private String address;
    private String bloodGroup;
    private String dateOfBirth;

    public Patient() {
        super();
        this.role = "PATIENT";
    }

    public Patient(int userId, String name, String email, String password, String phone,
                   String address, String bloodGroup, String dateOfBirth) {
        super(userId, name, email, password, "PATIENT", phone);
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
}
