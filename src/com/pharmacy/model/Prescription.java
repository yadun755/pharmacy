package com.pharmacy.model;

import java.util.ArrayList;
import java.util.List;

public class Prescription {
    public static class PrescribedMedicine {
        private String medicineName;
        private String dosage; // e.g. "1 Tablet"
        private String frequency; // e.g. "Twice daily after meals"
        private String duration; // e.g. "5 days"
        private String instructions;

        public PrescribedMedicine() {}

        public PrescribedMedicine(String medicineName, String dosage, String frequency, String duration, String instructions) {
            this.medicineName = medicineName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.duration = duration;
            this.instructions = instructions;
        }

        public String getMedicineName() { return medicineName; }
        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }

        public String getFrequency() { return frequency; }
        public void setFrequency(String frequency) { this.frequency = frequency; }

        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
    }

    private int prescriptionId;
    private int consultationId;
    private int patientId;
    private String patientName;
    private int doctorId;
    private String doctorName;
    private String issueDate;
    private String diagnosis;
    private String advice;
    private List<PrescribedMedicine> medicines = new ArrayList<>();

    public Prescription() {}

    public Prescription(int prescriptionId, int consultationId, int patientId, String patientName,
                        int doctorId, String doctorName, String issueDate, String diagnosis,
                        String advice, List<PrescribedMedicine> medicines) {
        this.prescriptionId = prescriptionId;
        this.consultationId = consultationId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.issueDate = issueDate;
        this.diagnosis = diagnosis;
        this.advice = advice;
        this.medicines = (medicines != null) ? medicines : new ArrayList<>();
    }

    public int getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(int prescriptionId) { this.prescriptionId = prescriptionId; }

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

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getAdvice() { return advice; }
    public void setAdvice(String advice) { this.advice = advice; }

    public List<PrescribedMedicine> getMedicines() { return medicines; }
    public void setMedicines(List<PrescribedMedicine> medicines) { this.medicines = medicines; }
}
