-- MySQL schema for Pharmacy Management System

DROP DATABASE IF EXISTS pharmacy_db;
CREATE DATABASE pharmacy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pharmacy_db;

-- Users table (admin, doctor, pharmacist, patient)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','DOCTOR','PHARMACIST','PATIENT') NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Medicines table
CREATE TABLE medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Orders placed by patients (prescriptions/dispensings)
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    pharmacist_id BIGINT,
    status ENUM('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_patient FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_pharmacist FOREIGN KEY (pharmacist_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Items within an order
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Consultations (doctor-patient visits)
CREATE TABLE consultations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    notes TEXT,
    consultation_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consult_doctor FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_consult_patient FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Prescriptions issued by doctors
CREATE TABLE prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consultation_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_presc_consult FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
    CONSTRAINT fk_presc_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Sample data (optional)
INSERT INTO users (username, password_hash, role, full_name, email) VALUES
('admin', SHA2('admin123', 256), 'ADMIN', 'System Admin', 'admin@example.com'),
('drsmith', SHA2('doc123', 256), 'DOCTOR', 'Dr. John Smith', 'drsmith@example.com'),
('pharma1', SHA2('pharm123', 256), 'PHARMACIST', 'Pharmacist Jane', 'jane@pharmacy.com'),
('patient1', SHA2('patient123', 256), 'PATIENT', 'Alice Patient', 'alice@example.com');

INSERT INTO medicines (name, manufacturer, price, stock) VALUES
('Paracetamol', 'Acme Pharma', 0.10, 500),
('Amoxicillin', 'HealthCorp', 0.25, 300);
