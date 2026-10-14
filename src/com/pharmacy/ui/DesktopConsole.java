package com.pharmacy.ui;

import com.pharmacy.storage.DataStore;
import com.pharmacy.model.Medicine;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.net.URI;

public class DesktopConsole extends JFrame {
    private final int port;
    private final JTextArea logArea = new JTextArea();

    public DesktopConsole(int port) {
        this.port = port;
        initUI();
    }

    private void initUI() {
        setTitle("Pharmacy Management System - Desktop Control Center");
        setSize(780, 540);
        setMinimumSize(new Dimension(650, 480));
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel mainPanel = new JPanel(new BorderLayout(12, 12));
        mainPanel.setBorder(new EmptyBorder(16, 16, 16, 16));
        mainPanel.setBackground(new Color(245, 247, 250));

        // Header
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setOpaque(false);

        JLabel titleLabel = new JLabel("Pharmacy Management System");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 20));
        titleLabel.setForeground(new Color(24, 43, 73));

        JLabel subLabel = new JLabel("With Online Medicine Access & Doctor Consultation  |  Port: " + port);
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subLabel.setForeground(new Color(80, 95, 115));

        headerPanel.add(titleLabel, BorderLayout.NORTH);
        headerPanel.add(subLabel, BorderLayout.SOUTH);
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // Center Panel: Stats & Console
        JPanel centerPanel = new JPanel(new BorderLayout(10, 10));
        centerPanel.setOpaque(false);

        JPanel statsPanel = new JPanel(new GridLayout(1, 4, 12, 0));
        statsPanel.setOpaque(false);
        DataStore ds = DataStore.getInstance();

        statsPanel.add(createStatCard("Medicines", String.valueOf(ds.getAllMedicines().size()), new Color(220, 245, 235), new Color(13, 110, 75)));
        statsPanel.add(createStatCard("Doctors", "3 Active", new Color(225, 240, 255), new Color(20, 80, 180)));
        statsPanel.add(createStatCard("Orders", String.valueOf(ds.getAllOrders().size()), new Color(255, 244, 225), new Color(180, 100, 10)));
        statsPanel.add(createStatCard("Status", "ONLINE", new Color(230, 250, 230), new Color(25, 135, 84)));

        centerPanel.add(statsPanel, BorderLayout.NORTH);

        logArea.setEditable(false);
        logArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        logArea.setBackground(new Color(28, 33, 40));
        logArea.setForeground(new Color(210, 220, 230));
        logArea.setMargin(new Insets(8, 8, 8, 8));

        JScrollPane scrollPane = new JScrollPane(logArea);
        scrollPane.setBorder(BorderFactory.createTitledBorder(
                BorderFactory.createLineBorder(new Color(200, 210, 225)),
                "System Activity Log", 0, 0, new Font("Segoe UI", Font.BOLD, 12), new Color(50, 60, 75)
        ));
        centerPanel.add(scrollPane, BorderLayout.CENTER);

        mainPanel.add(centerPanel, BorderLayout.CENTER);

        // Bottom Controls
        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        bottomPanel.setOpaque(false);

        JButton openBrowserBtn = new JButton("Launch Web Portal (Browser)");
        openBrowserBtn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        openBrowserBtn.setBackground(new Color(13, 110, 253));
        openBrowserBtn.setForeground(Color.WHITE);
        openBrowserBtn.setFocusPainted(false);
        openBrowserBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        openBrowserBtn.addActionListener(e -> openUrl("http://localhost:" + port));

        JButton alertsBtn = new JButton("Check Expiry / Stock Alerts");
        alertsBtn.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        alertsBtn.addActionListener(this::showAlertsDialog);

        JButton copyUrlBtn = new JButton("Copy URL");
        copyUrlBtn.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        copyUrlBtn.addActionListener(e -> {
            Toolkit.getDefaultToolkit().getSystemClipboard()
                    .setContents(new java.awt.datatransfer.StringSelection("http://localhost:" + port), null);
            JOptionPane.showMessageDialog(this, "Copied http://localhost:" + port + " to clipboard!", "URL Copied", JOptionPane.INFORMATION_MESSAGE);
        });

        bottomPanel.add(copyUrlBtn);
        bottomPanel.add(alertsBtn);
        bottomPanel.add(openBrowserBtn);

        mainPanel.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(mainPanel);

        log("System initialized successfully.");
        log("Database loaded: " + ds.getAllMedicines().size() + " medicines, " + ds.getAllUsers().size() + " registered accounts.");
        log("HTTP Server active at http://localhost:" + port);
        log("Separate Portals active: Admin, Pharmacist, Doctor, Patient.");
    }

    private JPanel createStatCard(String label, String value, Color bg, Color textCol) {
        JPanel card = new JPanel(new BorderLayout(4, 4));
        card.setBackground(bg);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 225, 230)),
                new EmptyBorder(10, 12, 10, 12)
        ));
        JLabel valLabel = new JLabel(value);
        valLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
        valLabel.setForeground(textCol);

        JLabel lbl = new JLabel(label);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lbl.setForeground(new Color(90, 100, 115));

        card.add(lbl, BorderLayout.NORTH);
        card.add(valLabel, BorderLayout.CENTER);
        return card;
    }

    private void showAlertsDialog(ActionEvent e) {
        DataStore ds = DataStore.getInstance();
        StringBuilder sb = new StringBuilder();
        sb.append("=== LOW STOCK ALERTS (Stock <= 15) ===\n");
        for (Medicine m : ds.getAllMedicines()) {
            if (m.isLowStock(15)) {
                sb.append("• ").append(m.getName()).append(" - Current Stock: ").append(m.getStockQuantity())
                  .append(" (Batch: ").append(m.getBatchNumber()).append(")\n");
            }
        }

        sb.append("\n=== EXPIRY ALERTS (Expiring soon or expired) ===\n");
        for (Medicine m : ds.getAllMedicines()) {
            if (m.isExpired()) {
                sb.append("• [EXPIRED] ").append(m.getName()).append(" - Expired on: ").append(m.getExpiryDate()).append("\n");
            } else if (m.isNearExpiry(60)) {
                sb.append("• [NEAR EXPIRY] ").append(m.getName()).append(" - Expires: ").append(m.getExpiryDate())
                  .append(" (").append(m.getDaysUntilExpiry()).append(" days left)\n");
            }
        }

        JTextArea area = new JTextArea(sb.toString(), 14, 45);
        area.setEditable(false);
        area.setFont(new Font("Consolas", Font.PLAIN, 12));
        JOptionPane.showMessageDialog(this, new JScrollPane(area), "Inventory Alerts (Pharmacy Module)", JOptionPane.WARNING_MESSAGE);
    }

    public void log(String message) {
        SwingUtilities.invokeLater(() -> {
            logArea.append("[" + java.time.LocalTime.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS) + "] " + message + "\n");
            logArea.setCaretPosition(logArea.getDocument().getLength());
        });
    }

    public static void openUrl(String url) {
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
            } else {
                new ProcessBuilder("rundll32", "url.dll,FileProtocolHandler", url).start();
            }
        } catch (Exception ex) {
            System.err.println("Could not open browser: " + ex.getMessage());
        }
    }
}
