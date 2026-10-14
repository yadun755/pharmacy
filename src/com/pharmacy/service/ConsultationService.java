package com.pharmacy.service;

import com.pharmacy.model.*;
import com.pharmacy.storage.DataStore;
import java.util.*;
import java.util.stream.Collectors;

public class ConsultationService {
    private final DataStore dataStore = DataStore.getInstance();

    public Consultation bookConsultation(int patientId, String patientName, int doctorId,
                                        String symptoms, String date, String timeSlot) {
        Doctor doctor = (Doctor) dataStore.getUserById(doctorId);
        if (doctor == null) return null;

        Consultation c = new Consultation();
        c.setPatientId(patientId);
        c.setPatientName(patientName);
        c.setDoctorId(doctorId);
        c.setDoctorName(doctor.getName());
        c.setDoctorSpecialization(doctor.getSpecialization());
        c.setSymptoms(symptoms);
        c.setConsultationDate(date);
        c.setTimeSlot(timeSlot);
        c.setStatus("SCHEDULED");
        c.setDoctorNotes("");
        c.setPrescriptionId(0);

        return dataStore.createConsultation(c);
    }

    public List<Consultation> getPatientConsultations(int patientId) {
        return dataStore.getAllConsultations().stream()
                .filter(c -> c.getPatientId() == patientId)
                .sorted((a, b) -> Integer.compare(b.getConsultationId(), a.getConsultationId()))
                .collect(Collectors.toList());
    }

    public List<Consultation> getDoctorConsultations(int doctorId) {
        return dataStore.getAllConsultations().stream()
                .filter(c -> c.getDoctorId() == doctorId)
                .sorted((a, b) -> Integer.compare(b.getConsultationId(), a.getConsultationId()))
                .collect(Collectors.toList());
    }

    public List<Consultation> getAllConsultations() {
        return dataStore.getAllConsultations().stream()
                .sorted((a, b) -> Integer.compare(b.getConsultationId(), a.getConsultationId()))
                .collect(Collectors.toList());
    }

    public Prescription issuePrescription(int consultationId, int patientId, String patientName,
                                          int doctorId, String doctorName, String date,
                                          String diagnosis, String advice,
                                          List<Prescription.PrescribedMedicine> meds) {
        Prescription rx = new Prescription();
        rx.setConsultationId(consultationId);
        rx.setPatientId(patientId);
        rx.setPatientName(patientName);
        rx.setDoctorId(doctorId);
        rx.setDoctorName(doctorName);
        rx.setIssueDate(date);
        rx.setDiagnosis(diagnosis);
        rx.setAdvice(advice);
        rx.setMedicines(meds);

        return dataStore.createPrescription(rx);
    }

    public List<Prescription> getPatientPrescriptions(int patientId) {
        return dataStore.getAllPrescriptions().stream()
                .filter(p -> p.getPatientId() == patientId)
                .sorted((a, b) -> Integer.compare(b.getPrescriptionId(), a.getPrescriptionId()))
                .collect(Collectors.toList());
    }
}
