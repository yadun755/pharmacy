package com.pharmacy.model;

import java.util.ArrayList;
import java.util.List;

public class Order {
    private int orderId;
    private int patientId;
    private String patientName;
    private List<OrderItem> items = new ArrayList<>();
    private double totalAmount;
    private String status; // PENDING, APPROVED, DISPATCHED, DELIVERED, CANCELLED
    private String orderDate;
    private int prescriptionId;
    private String deliveryAddress;
    private String paymentStatus;

    public Order() {}

    public Order(int orderId, int patientId, String patientName, List<OrderItem> items,
                 double totalAmount, String status, String orderDate, int prescriptionId,
                 String deliveryAddress, String paymentStatus) {
        this.orderId = orderId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.items = (items != null) ? items : new ArrayList<>();
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.prescriptionId = prescriptionId;
        this.deliveryAddress = deliveryAddress;
        this.paymentStatus = paymentStatus;
    }

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }

    public int getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(int prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public double calculateTotal() {
        double sum = 0;
        for (OrderItem item : items) {
            sum += item.getSubtotal();
        }
        this.totalAmount = sum;
        return sum;
    }
}
