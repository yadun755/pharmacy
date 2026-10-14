package com.pharmacy.model;

public class User {
    protected int userId;
    protected String name;
    protected String email;
    protected String password;
    protected String role; // ADMIN, PHARMACIST, DOCTOR, PATIENT
    protected String phone;

    public User() {}

    public User(int userId, String name, String email, String password, String role, String phone) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phone = phone;
    }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public boolean authenticate(String testPassword) {
        return this.password != null && this.password.equals(testPassword);
    }
}
