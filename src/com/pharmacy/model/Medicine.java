package com.pharmacy.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Medicine {
    private int medicineId;
    private String name;
    private String category;
    private String manufacturer;
    private double price;
    private int stockQuantity;
    private String batchNumber;
    private String expiryDate; // Format: YYYY-MM-DD
    private boolean requiresPrescription;
    private String dosageForm; // Tablet, Capsule, Syrup, Ointment
    private String strength;   // e.g. 500mg, 100ml
    private String description;

    public Medicine() {}

    public Medicine(int medicineId, String name, String category, String manufacturer, double price,
                    int stockQuantity, String batchNumber, String expiryDate, boolean requiresPrescription,
                    String dosageForm, String strength, String description) {
        this.medicineId = medicineId;
        this.name = name;
        this.category = category;
        this.manufacturer = manufacturer;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.batchNumber = batchNumber;
        this.expiryDate = expiryDate;
        this.requiresPrescription = requiresPrescription;
        this.dosageForm = dosageForm;
        this.strength = strength;
        this.description = description;
    }

    public int getMedicineId() { return medicineId; }
    public void setMedicineId(int medicineId) { this.medicineId = medicineId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public boolean isRequiresPrescription() { return requiresPrescription; }
    public void setRequiresPrescription(boolean requiresPrescription) { this.requiresPrescription = requiresPrescription; }

    public String getDosageForm() { return dosageForm; }
    public void setDosageForm(String dosageForm) { this.dosageForm = dosageForm; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isLowStock(int threshold) {
        return this.stockQuantity <= threshold;
    }

    public long getDaysUntilExpiry() {
        try {
            LocalDate exp = LocalDate.parse(this.expiryDate);
            return ChronoUnit.DAYS.between(LocalDate.now(), exp);
        } catch (Exception e) {
            return 9999;
        }
    }

    public boolean isExpired() {
        return getDaysUntilExpiry() < 0;
    }

    public boolean isNearExpiry(int thresholdDays) {
        long days = getDaysUntilExpiry();
        return days >= 0 && days <= thresholdDays;
    }

    public synchronized boolean reduceStock(int quantity) {
        if (this.stockQuantity >= quantity) {
            this.stockQuantity -= quantity;
            return true;
        }
        return false;
    }

    public synchronized void addStock(int quantity) {
        this.stockQuantity += quantity;
    }
}
