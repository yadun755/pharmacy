package com.pharmacy.model;

public class Admin extends User {
    private String department;

    public Admin() {
        super();
        this.role = "ADMIN";
    }

    public Admin(int userId, String name, String email, String password, String phone, String department) {
        super(userId, name, email, password, "ADMIN", phone);
        this.department = department;
    }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
