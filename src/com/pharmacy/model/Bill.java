package com.pharmacy.model;

public class Bill {
    private int billId;
    private int orderId;
    private int patientId;
    private String patientName;
    private double subtotal;
    private double tax;
    private double discount;
    private double totalAmount;
    private String paymentDate;
    private String paymentMethod;
    private String paymentStatus;

    public Bill() {}

    public Bill(int billId, int orderId, int patientId, String patientName, double subtotal,
                double tax, double discount, double totalAmount, String paymentDate,
                String paymentMethod, String paymentStatus) {
        this.billId = billId;
        this.orderId = orderId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.subtotal = subtotal;
        this.tax = tax;
        this.discount = discount;
        this.totalAmount = totalAmount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
    }

    public int getBillId() { return billId; }
    public void setBillId(int billId) { this.billId = billId; }

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getTax() { return tax; }
    public void setTax(double tax) { this.tax = tax; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
