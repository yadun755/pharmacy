package com.pharmacy.service;

import com.pharmacy.model.*;
import com.pharmacy.storage.DataStore;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class OrderService {
    private final DataStore dataStore = DataStore.getInstance();
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public Order placeOrder(int patientId, String patientName, List<OrderItem> items, int rxId, String address) {
        if (items == null || items.isEmpty()) return null;

        for (OrderItem it : items) {
            Medicine med = dataStore.getMedicineById(it.getMedicineId());
            if (med == null || med.getStockQuantity() < it.getQuantity()) {
                return null;
            }
        }

        for (OrderItem it : items) {
            Medicine med = dataStore.getMedicineById(it.getMedicineId());
            med.reduceStock(it.getQuantity());
        }

        Order order = new Order();
        order.setPatientId(patientId);
        order.setPatientName(patientName);
        order.setItems(items);
        order.calculateTotal();
        order.setStatus("APPROVED");
        order.setOrderDate(LocalDateTime.now().format(FORMATTER));
        order.setPrescriptionId(rxId);
        order.setDeliveryAddress(address);
        order.setPaymentStatus("PAID");

        return dataStore.createOrder(order);
    }

    public List<Order> getOrdersByPatient(int patientId) {
        return dataStore.getAllOrders().stream()
                .filter(o -> o.getPatientId() == patientId)
                .sorted((a, b) -> Integer.compare(b.getOrderId(), a.getOrderId()))
                .collect(Collectors.toList());
    }

    public List<Order> getAllOrders() {
        return dataStore.getAllOrders().stream()
                .sorted((a, b) -> Integer.compare(b.getOrderId(), a.getOrderId()))
                .collect(Collectors.toList());
    }

    public boolean updateStatus(int orderId, String status) {
        return dataStore.updateOrderStatus(orderId, status);
    }
}
