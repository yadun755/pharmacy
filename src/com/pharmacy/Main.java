package com.pharmacy;

import com.pharmacy.ui.DesktopConsole;
import com.pharmacy.web.PharmacyHttpServer;

import javax.swing.*;
import java.awt.GraphicsEnvironment;
import java.net.ServerSocket;

public class Main {
    private static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) {
        System.out.println("===============================================================");
        System.out.println("  PHARMACY MANAGEMENT SYSTEM WITH ONLINE ACCESS & CONSULTATION ");
        System.out.println("  Academic Year 2026-27 | St. Thomas College of Engg & Tech    ");
        System.out.println("===============================================================");

        int port = findAvailablePort(DEFAULT_PORT);
        try {
            PharmacyHttpServer server = new PharmacyHttpServer(port);
            server.start();

            String appUrl = "http://localhost:" + port;
            System.out.println("\n[SUCCESS] Application Server successfully launched!");
            System.out.println("[URL] Access Web Application at: " + appUrl);
            System.out.println("[INFO] Dedicated Role Portals & Credentials:");
            System.out.println("   • Patient Portal:    yadhu@gmail.com / pass123  (or patient@pharmacy.com / patient123)");
            System.out.println("   • Doctor Portal:     doctor.mathew@stthomas.ac.in / doc123  (or doctor@pharmacy.com / doctor123)");
            System.out.println("   • Pharmacist Portal: pharm.anjana@stthomas.ac.in / pharm123  (or pharmacist@pharmacy.com / pharm123)");
            System.out.println("   • Admin Portal:      admin@stthomas.ac.in / admin123  (or admin@pharmacy.com / admin123)\n");

            if (!GraphicsEnvironment.isHeadless()) {
                SwingUtilities.invokeLater(() -> {
                    DesktopConsole console = new DesktopConsole(port);
                    console.setVisible(true);
                });
            }

            DesktopConsole.openUrl(appUrl);

        } catch (Exception e) {
            System.err.println("[ERROR] Failed to start Pharmacy Management System: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static int findAvailablePort(int startPort) {
        for (int p = startPort; p < startPort + 50; p++) {
            try (ServerSocket ss = new ServerSocket(p)) {
                return p;
            } catch (Exception ignored) {}
        }
        return startPort;
    }
}
