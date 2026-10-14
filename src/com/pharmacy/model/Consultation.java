package com.pharmacy.model;

public class Consultation {
    private int consultationId;
    private int patientId;
    private String patientName;
    private int doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String symptoms;
    private String consultationDate;
    private String timeSlot;
    private String status; // REQUESTED, SCHEDULED, COMPLETED, CANCELLED
    private String doctorNotes;
    private int prescriptionId;

    public Consultation() {}

    public Consultation(int consultationId, int patientId, String patientName, int doctorId,
                        String doctorName, String doctorSpecialization, String symptoms,
                        String consultationDate, String timeSlot, String status,
                        String doctorNotes, int prescriptionId) {
        this.consultationId = consultationId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.symptoms = symptoms;
        this.consultationDate = consultationDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.doctorNotes = doctorNotes;
        this.prescriptionId = prescriptionId;
    }

    public int getConsultationId() { return consultationId; }
    public void setConsultationId(int consultationId) { this.consultationId = consultationId; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public int getDoctorId() { return doctorId; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDoctorSpecialization() { return doctorSpecialization; }
    public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getConsultationDate() { return consultationDate; }
    public void setConsultationDate(String consultationDate) { this.consultationDate = consultationDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }

    public int getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(int prescriptionId) { this.prescriptionId = prescriptionId; }
}
