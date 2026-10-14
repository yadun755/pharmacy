package com.pharmacy.model;

public class OrderItem {
    private int medicineId;
    private String medicineName;
    private double unitPrice;
    private int quantity;

    public OrderItem() {}

    public OrderItem(int medicineId, String medicineName, double unitPrice, int quantity) {
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public int getMedicineId() { return medicineId; }
    public void setMedicineId(int medicineId) { this.medicineId = medicineId; }

    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getSubtotal() {
        return this.unitPrice * this.quantity;
    }
}
