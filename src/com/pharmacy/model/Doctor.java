package com.pharmacy.model;

public class Doctor extends User {
    private String specialization;
    private String licenseNumber;
    private double consultationFee;
    private String qualification;

    public Doctor() {
        super();
        this.role = "DOCTOR";
    }

    public Doctor(int userId, String name, String email, String password, String phone,
                  String specialization, String licenseNumber, double consultationFee, String qualification) {
        super(userId, name, email, password, "DOCTOR", phone);
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
        this.consultationFee = consultationFee;
        this.qualification = qualification;
    }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
}
