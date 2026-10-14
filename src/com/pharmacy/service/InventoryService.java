package com.pharmacy.service;

import com.pharmacy.model.Medicine;
import com.pharmacy.storage.DataStore;
import java.util.*;
import java.util.stream.Collectors;

public class InventoryService {
    private final DataStore dataStore = DataStore.getInstance();

    public Collection<Medicine> getAll() {
        return dataStore.getAllMedicines();
    }

    public List<Medicine> search(String query, String category) {
        String q = (query == null) ? "" : query.toLowerCase().trim();
        String cat = (category == null) ? "" : category.toLowerCase().trim();

        return dataStore.getAllMedicines().stream()
                .filter(m -> {
                    boolean matchesQuery = q.isEmpty() ||
                            m.getName().toLowerCase().contains(q) ||
                            m.getDescription().toLowerCase().contains(q) ||
                            m.getManufacturer().toLowerCase().contains(q);
                    boolean matchesCat = cat.isEmpty() || cat.equals("all") ||
                            m.getCategory().toLowerCase().contains(cat);
                    return matchesQuery && matchesCat;
                })
                .collect(Collectors.toList());
    }

    public List<Medicine> getLowStockMedicines(int threshold) {
        return dataStore.getAllMedicines().stream()
                .filter(m -> m.isLowStock(threshold))
                .collect(Collectors.toList());
    }

    public List<Medicine> getNearExpiryMedicines(int thresholdDays) {
        return dataStore.getAllMedicines().stream()
                .filter(m -> m.isNearExpiry(thresholdDays) || m.isExpired())
                .collect(Collectors.toList());
    }

    public Medicine saveOrUpdate(Medicine medicine) {
        if (medicine.getMedicineId() > 0 && dataStore.getMedicineById(medicine.getMedicineId()) != null) {
            dataStore.updateMedicine(medicine);
            return medicine;
        } else {
            return dataStore.addMedicine(medicine);
        }
    }

    public boolean delete(int id) {
        return dataStore.deleteMedicine(id);
    }
}
