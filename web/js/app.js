/* ==========================================================================
   St. Thomas Pharmacy Management System - Frontend Application Logic
   Academic Year 2026-27 | St. Thomas College of Engineering & Technology
   Features:
   - Separate Dedicated Portals for Admin, Patient, Doctor, Pharmacist
   - Strict Role Isolation: Zero Cross-Role Access
   - No Switch Role Option in Workspace
   - Admin Staff Management: Add Pharmacist, Add Doctor, Add Admin
   - Complete Pharmacy Workflows: Inventory, Prescriptions, Orders, Billing
   ========================================================================== */

let currentUser = null;
let selectedPortalRole = 'PATIENT';
let cart = [];
let cachedMedicines = [];

// ==========================================================================
// 1. INITIALIZATION & ROUTING
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if session exists in sessionStorage
    const saved = sessionStorage.getItem('pms_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            launchWorkspace();
            return;
        } catch (e) {
            sessionStorage.removeItem('pms_user');
        }
    }
    // Default to portal directory
    showPortalDirectory();
});

function showPortalDirectory() {
    const dirScreen = document.getElementById('portalDirectoryScreen');
    const loginScreen = document.getElementById('dedicatedLoginScreen');
    const appWorkspace = document.getElementById('appWorkspace');

    if (dirScreen) dirScreen.style.display = 'flex';
    if (loginScreen) loginScreen.style.display = 'none';
    if (appWorkspace) appWorkspace.style.display = 'none';

    hideLoginAlert();
}

function openDedicatedLogin(role) {
    selectedPortalRole = role.toUpperCase();
    const dirScreen = document.getElementById('portalDirectoryScreen');
    const loginScreen = document.getElementById('dedicatedLoginScreen');
    const appWorkspace = document.getElementById('appWorkspace');

    if (dirScreen) dirScreen.style.display = 'none';
    if (appWorkspace) appWorkspace.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';

    hideLoginAlert();

    const badge = document.getElementById('dedicatedPortalBadge');
    const title = document.getElementById('dedicatedPortalTitle');
    const desc = document.getElementById('dedicatedPortalDesc');
    const patientTabs = document.getElementById('patientOnlyTabs');
    const credHelper = document.getElementById('roleCredentialHelper');

    // Reset forms
    document.getElementById('signInForm').reset();
    document.getElementById('registerForm').reset();
    switchLoginTab('signin');

    // Configure role specifics
    badge.className = 'role-badge-pill';
    if (selectedPortalRole === 'PATIENT') {
        badge.classList.add('role-badge-patient');
        badge.textContent = 'PATIENT PORTAL';
        title.textContent = 'Patient Login Gateway';
        desc.textContent = 'Search available medicines, order online with bills, and consult doctors.';
        patientTabs.style.display = 'flex';
        credHelper.innerHTML = `
            <div class="demo-chip" onclick="fillDemoCredentials('yadhu@gmail.com', 'pass123')">
                <div>
                    <span class="demo-chip-name">Yadunandan P (Patient)</span><br>
                    <span class="demo-chip-cred">yadhu@gmail.com • pass123</span>
                </div>
                <span class="badge badge-success">Fill &rarr;</span>
            </div>
            <div class="demo-chip" onclick="fillDemoCredentials('ashin@gmail.com', 'pass123')">
                <div>
                    <span class="demo-chip-name">Ashin Prakashan (Patient)</span><br>
                    <span class="demo-chip-cred">ashin@gmail.com • pass123</span>
                </div>
                <span class="badge badge-success">Fill &rarr;</span>
            </div>
        `;
        fillDemoCredentials('yadhu@gmail.com', 'pass123');
    } else if (selectedPortalRole === 'DOCTOR') {
        badge.classList.add('role-badge-doctor');
        badge.textContent = 'DOCTOR PORTAL';
        title.textContent = 'Doctor Consultation Gateway';
        desc.textContent = 'Evaluate patient appointments, review symptoms, and issue certified digital prescriptions.';
        patientTabs.style.display = 'none';
        credHelper.innerHTML = `
            <div class="demo-chip" onclick="fillDemoCredentials('doctor.mathew@stthomas.ac.in', 'doc123')">
                <div>
                    <span class="demo-chip-name">Dr. Mathew George (MD, Physician)</span><br>
                    <span class="demo-chip-cred">doctor.mathew@stthomas.ac.in • doc123</span>
                </div>
                <span class="badge badge-info">Fill &rarr;</span>
            </div>
            <div class="demo-chip" onclick="fillDemoCredentials('dr.sarah@stthomas.ac.in', 'doc123')">
                <div>
                    <span class="demo-chip-name">Dr. Sarah Thomas (Cardiologist)</span><br>
                    <span class="demo-chip-cred">dr.sarah@stthomas.ac.in • doc123</span>
                </div>
                <span class="badge badge-info">Fill &rarr;</span>
            </div>
        `;
        fillDemoCredentials('doctor.mathew@stthomas.ac.in', 'doc123');
    } else if (selectedPortalRole === 'PHARMACIST') {
        badge.classList.add('role-badge-pharmacist');
        badge.textContent = 'PHARMACIST PORTAL';
        title.textContent = 'Pharmacy Dispensing Gateway';
        desc.textContent = 'Manage drug inventory, stock alerts, expiry tracking, and customer order dispensing.';
        patientTabs.style.display = 'none';
        credHelper.innerHTML = `
            <div class="demo-chip" onclick="fillDemoCredentials('pharm.anjana@stthomas.ac.in', 'pharm123')">
                <div>
                    <span class="demo-chip-name">Anjana K (Senior Pharmacist)</span><br>
                    <span class="demo-chip-cred">pharm.anjana@stthomas.ac.in • pharm123</span>
                </div>
                <span class="badge badge-purple">Fill &rarr;</span>
            </div>
        `;
        fillDemoCredentials('pharm.anjana@stthomas.ac.in', 'pharm123');
    } else if (selectedPortalRole === 'ADMIN') {
        badge.classList.add('role-badge-admin');
        badge.textContent = 'ADMINISTRATOR PORTAL';
        title.textContent = 'Central Administration Gateway';
        desc.textContent = 'System user administration, staff credentials, revenue reports, and institutional audits.';
        patientTabs.style.display = 'none';
        credHelper.innerHTML = `
            <div class="demo-chip" onclick="fillDemoCredentials('admin@stthomas.ac.in', 'admin123')">
                <div>
                    <span class="demo-chip-name">System Administrator</span><br>
                    <span class="demo-chip-cred">admin@stthomas.ac.in • admin123</span>
                </div>
                <span class="badge badge-danger">Fill &rarr;</span>
            </div>
        `;
        fillDemoCredentials('admin@stthomas.ac.in', 'admin123');
    }
}

function fillDemoCredentials(email, pass) {
    const em = document.getElementById('loginEmail');
    const pw = document.getElementById('loginPassword');
    if (em) em.value = email;
    if (pw) pw.value = pass;
}

function switchLoginTab(tab) {
    const tabSignIn = document.getElementById('tabSignIn');
    const tabRegister = document.getElementById('tabRegister');
    const signInForm = document.getElementById('signInForm');
    const registerForm = document.getElementById('registerForm');

    hideLoginAlert();

    if (tab === 'register') {
        tabSignIn.classList.remove('active');
        tabRegister.classList.add('active');
        signInForm.style.display = 'none';
        registerForm.style.display = 'block';
    } else {
        tabSignIn.classList.add('active');
        tabRegister.classList.remove('active');
        signInForm.style.display = 'block';
        registerForm.style.display = 'none';
    }
}

function showLoginAlert(msg, isSuccess = false) {
    const el = document.getElementById('loginAlert');
    if (!el) return;
    el.className = 'alert-banner ' + (isSuccess ? 'alert-success' : 'alert-danger');
    el.textContent = msg;
    el.style.display = 'block';
}

function hideLoginAlert() {
    const el = document.getElementById('loginAlert');
    if (el) el.style.display = 'none';
}

// ==========================================================================
// 2. AUTHENTICATION & LOGIN HANDLERS
// ==========================================================================

async function handleDedicatedSignIn(e) {
    e.preventDefault();
    hideLoginAlert();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password,
                portalRole: selectedPortalRole
            })
        });

        const data = await res.json();
        if (res.ok) {
            currentUser = data;
            sessionStorage.setItem('pms_user', JSON.stringify(data));
            launchWorkspace();
        } else {
            showLoginAlert(data.error || 'Authentication failed. Please verify credentials.');
        }
    } catch (err) {
        showLoginAlert('Unable to communicate with the server. Please ensure the backend is running.');
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    hideLoginAlert();

    const payload = {
        name: document.getElementById('regName').value.trim(),
        phone: document.getElementById('regPhone').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        password: document.getElementById('regPassword').value.trim(),
        bloodGroup: document.getElementById('regBlood').value,
        dateOfBirth: document.getElementById('regDob').value,
        address: document.getElementById('regAddress').value.trim()
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            currentUser = data;
            sessionStorage.setItem('pms_user', JSON.stringify(data));
            launchWorkspace();
        } else {
            showLoginAlert(data.error || 'Registration failed. Email might already be taken.');
        }
    } catch (err) {
        showLoginAlert('Unable to register at this time. Please check your connection.');
    }
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('pms_user');
    localStorage.removeItem('pms_user');
    cart = [];
    updateCartUI();
    showPortalDirectory();
}

// ==========================================================================
// 3. WORKSPACE LAUNCH & STRICT ROLE ISOLATION
// ==========================================================================

function launchWorkspace() {
    if (!currentUser) {
        showPortalDirectory();
        return;
    }

    const dirScreen = document.getElementById('portalDirectoryScreen');
    const loginScreen = document.getElementById('dedicatedLoginScreen');
    const appWorkspace = document.getElementById('appWorkspace');

    if (dirScreen) dirScreen.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'none';
    if (appWorkspace) appWorkspace.style.display = 'flex';

    // Update Top Navigation User info
    document.getElementById('navUserName').textContent = currentUser.name || 'User';
    document.getElementById('navAvatar').textContent = (currentUser.name || 'U').charAt(0).toUpperCase();

    const roleBadge = document.getElementById('navUserRole');
    roleBadge.textContent = currentUser.role;
    roleBadge.className = 'user-role-badge';
    if (currentUser.role === 'PATIENT') roleBadge.classList.add('role-tag-patient');
    else if (currentUser.role === 'DOCTOR') roleBadge.classList.add('role-tag-doctor');
    else if (currentUser.role === 'PHARMACIST') roleBadge.classList.add('role-tag-pharmacist');
    else if (currentUser.role === 'ADMIN') roleBadge.classList.add('role-tag-admin');

    const sub = document.getElementById('navSubtitle');
    sub.textContent = `${currentUser.role.charAt(0) + currentUser.role.slice(1).toLowerCase()} Portal | St. Thomas College of Engg & Tech`;

    // Strictly build sidebar menu based on logged-in role
    buildRoleSidebar();
}

function buildRoleSidebar() {
    const menuContainer = document.getElementById('sidebarMenu');
    const menuTitle = document.getElementById('portalMenuTitle');
    menuContainer.innerHTML = '';

    const role = currentUser.role.toUpperCase();

    if (role === 'ADMIN') {
        menuTitle.textContent = 'ADMINISTRATION';
        menuContainer.innerHTML = `
            <button class="sidebar-item active" onclick="loadView('admin-overview', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                System Overview
            </button>
            <button class="sidebar-item" onclick="loadView('admin-users', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Staff & User Admin
            </button>
            <button class="sidebar-item" onclick="loadView('admin-inventory', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                Medicine Stock Catalog
            </button>
            <button class="sidebar-item" onclick="loadView('admin-orders', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                All Orders & Dispensing
            </button>
            <button class="sidebar-item" onclick="loadView('admin-reports', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Financial & Stock Reports
            </button>
        `;
        loadView('admin-overview');
    } else if (role === 'PHARMACIST') {
        menuTitle.textContent = 'PHARMACY OPS';
        menuContainer.innerHTML = `
            <button class="sidebar-item active" onclick="loadView('pharmacist-inventory', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                Inventory Management
            </button>
            <button class="sidebar-item" onclick="loadView('pharmacist-alerts', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Stock & Expiry Alerts
            </button>
            <button class="sidebar-item" onclick="loadView('pharmacist-orders', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
                Dispense Patient Orders
            </button>
        `;
        loadView('pharmacist-inventory');
    } else if (role === 'DOCTOR') {
        menuTitle.textContent = 'CLINICAL CARE';
        menuContainer.innerHTML = `
            <button class="sidebar-item active" onclick="loadView('doctor-consultations', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
                Patient Consultations
            </button>
            <button class="sidebar-item" onclick="loadView('doctor-issue-rx', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                Issue Digital Prescription
            </button>
            <button class="sidebar-item" onclick="loadView('doctor-prescriptions', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Prescription Records
            </button>
        `;
        loadView('doctor-consultations');
    } else if (role === 'PATIENT') {
        menuTitle.textContent = 'PATIENT SERVICES';
        menuContainer.innerHTML = `
            <button class="sidebar-item active" onclick="loadView('patient-medicines', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                Browse Medicines
            </button>
            <button class="sidebar-item" onclick="loadView('patient-orders', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                My Orders & Bills
            </button>
            <button class="sidebar-item" onclick="loadView('patient-consult', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
                Book Doctor Consultation
            </button>
            <button class="sidebar-item" onclick="loadView('patient-prescriptions', this)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                My Prescriptions
            </button>
        `;
        loadView('patient-medicines');
    }
}

function loadView(viewName, element) {
    if (element) {
        document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }

    const container = document.getElementById('viewsContainer');
    container.innerHTML = `<div class="empty-state">Loading portal view...</div>`;

    if (viewName === 'admin-overview') renderAdminOverview(container);
    else if (viewName === 'admin-users') renderAdminUsers(container);
    else if (viewName === 'admin-inventory') renderPharmacistInventory(container);
    else if (viewName === 'admin-orders') renderPharmacistOrders(container);
    else if (viewName === 'admin-reports') renderAdminReports(container);
    else if (viewName === 'pharmacist-inventory') renderPharmacistInventory(container);
    else if (viewName === 'pharmacist-alerts') renderPharmacistAlerts(container);
    else if (viewName === 'pharmacist-orders') renderPharmacistOrders(container);
    else if (viewName === 'doctor-consultations') renderDoctorConsultations(container);
    else if (viewName === 'doctor-issue-rx') renderDoctorIssueRx(container);
    else if (viewName === 'doctor-prescriptions') renderDoctorPrescriptions(container);
    else if (viewName === 'patient-medicines') renderPatientMedicines(container);
    else if (viewName === 'patient-orders') renderPatientOrders(container);
    else if (viewName === 'patient-consult') renderPatientConsult(container);
    else if (viewName === 'patient-prescriptions') renderPatientPrescriptions(container);
}

// ==========================================================================
// 4. ADMIN VIEWS & USER MANAGEMENT (ADD PHARMACIST, ADD DOCTOR, ADD ADMIN)
// ==========================================================================

async function renderAdminOverview(container) {
    try {
        const [repRes, usersRes] = await Promise.all([
            fetch('/api/reports'),
            fetch('/api/users')
        ]);
        const rep = await repRes.json();
        const users = await usersRes.json();

        const totalPharm = users.filter(u => u.role === 'PHARMACIST').length;
        const totalDocs = users.filter(u => u.role === 'DOCTOR').length;
        const totalPatients = users.filter(u => u.role === 'PATIENT').length;
        const totalAdmins = users.filter(u => u.role === 'ADMIN').length;

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Central Administration Dashboard</h2>
                    <p>System operational metrics, active staff roster, and pharmacy inventory statistics.</p>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="openAddUserModal('PHARMACIST')">+ Add Pharmacist</button>
                    <button class="btn btn-accent" onclick="openAddUserModal('DOCTOR')">+ Add Doctor</button>
                    <button class="btn btn-outline" onclick="openAddUserModal('ADMIN')">+ Add Admin</button>
                    <button class="btn btn-outline" onclick="openAddUserModal('PATIENT')">+ Add Patient</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background:#fee2e2; color:#dc2626;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">${users.length}</div>
                        <div class="stat-label">Total Users (${totalAdmins} Admin, ${totalPatients} Patients)</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#f5f3ff; color:#7c3aed;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">${totalPharm}</div>
                        <div class="stat-label">Licensed Pharmacists</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#e0f2fe; color:#0284c7;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><circle cx="20" cy="10" r="2"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">${totalDocs}</div>
                        <div class="stat-label">Certified Doctors</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#ecfdf5; color:#059669;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">₹${Number(rep.totalRevenue || 0).toFixed(2)}</div>
                        <div class="stat-label">Total Pharmacy Revenue</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#f1f5f9; color:#0f172a;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">${rep.totalOrdersPlaced || rep.totalOrders || 0}</div>
                        <div class="stat-label">Patient Orders Placed</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#fef3c7; color:#d97706;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">${rep.totalMedicines || 0}</div>
                        <div class="stat-label">Medicine Catalog SKUs</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#fee2e2; color:#dc2626;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
                    </div>
                    <div>
                        <div class="stat-number" style="color:var(--danger);">${rep.lowStockCount || 0}</div>
                        <div class="stat-label">Low Stock Alerts (&lt; 15)</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background:#e0e7ff; color:#4338ca;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div>
                        <div class="stat-number">₹${Number(rep.totalInventoryValue || rep.inventoryValue || 0).toFixed(2)}</div>
                        <div class="stat-label">Inventory Valuation</div>
                    </div>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Quick Administration Actions</h3>
                </div>
                <p style="font-size:0.875rem; color:var(--text-secondary); margin-bottom:1rem;">
                    As an authorized Administrator, you have full control over staffing, doctors, pharmacists, patient records, medicine catalog, and financial audits.
                </p>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="openAddUserModal('PHARMACIST')">
                        + Add Pharmacist
                    </button>
                    <button class="btn btn-accent" onclick="openAddUserModal('DOCTOR')">
                        + Add Doctor
                    </button>
                    <button class="btn btn-outline" onclick="openAddUserModal('ADMIN')">
                        + Add Admin
                    </button>
                    <button class="btn btn-outline" onclick="openAddUserModal('PATIENT')">
                        + Add Patient
                    </button>
                    <button class="btn btn-outline" onclick="openMedicineModal()">
                        + Add Medicine
                    </button>
                    <button class="btn btn-outline" onclick="loadView('admin-users')">
                        Manage Staff & Users &rarr;
                    </button>
                    <button class="btn btn-outline" onclick="loadView('admin-inventory')">
                        Inspect Inventory &rarr;
                    </button>
                    <button class="btn btn-outline" onclick="loadView('admin-reports')">
                        View Audit Reports &rarr;
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error loading admin dashboard: ${e.message}</div>`;
    }
}

let adminUserRoleFilter = 'ALL';

async function renderAdminUsers(container) {
    try {
        const res = await fetch('/api/users');
        const users = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Staff & User Administration</h2>
                    <p>Manage access credentials for Pharmacists, Doctors, Patients, and Administrators.</p>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="openAddUserModal('PHARMACIST')">+ Add Pharmacist</button>
                    <button class="btn btn-accent" onclick="openAddUserModal('DOCTOR')">+ Add Doctor</button>
                    <button class="btn btn-outline" onclick="openAddUserModal('ADMIN')">+ Add Admin</button>
                    <button class="btn btn-outline" onclick="openAddUserModal('PATIENT')">+ Add Patient</button>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar" style="flex-wrap:wrap; gap:1rem;">
                    <div>
                        <h3>Registered Accounts (${users.length})</h3>
                    </div>
                    <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                        <button class="btn btn-outline btn-sm admin-role-btn active" onclick="setAdminRoleFilter('ALL', this)">All (${users.length})</button>
                        <button class="btn btn-outline btn-sm admin-role-btn" onclick="setAdminRoleFilter('PHARMACIST', this)">Pharmacists (${users.filter(u => u.role === 'PHARMACIST').length})</button>
                        <button class="btn btn-outline btn-sm admin-role-btn" onclick="setAdminRoleFilter('DOCTOR', this)">Doctors (${users.filter(u => u.role === 'DOCTOR').length})</button>
                        <button class="btn btn-outline btn-sm admin-role-btn" onclick="setAdminRoleFilter('ADMIN', this)">Admins (${users.filter(u => u.role === 'ADMIN').length})</button>
                        <button class="btn btn-outline btn-sm admin-role-btn" onclick="setAdminRoleFilter('PATIENT', this)">Patients (${users.filter(u => u.role === 'PATIENT').length})</button>
                        <input type="text" id="userSearchInput" class="form-control" placeholder="Search by name, email..." style="width:200px; display:inline-block;" oninput="filterUserTable()">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table" id="usersAdminTable">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Full Name</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role Specifics</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(u => {
                                const uid = u.id || u.userId;
                                const isSelf = uid === (currentUser.id || currentUser.userId);
                                return `
                                <tr data-role="${escapeHtml(u.role)}">
                                    <td>#${uid}</td>
                                    <td><strong>${escapeHtml(u.name)}</strong></td>
                                    <td>
                                        <span class="badge ${
                                            u.role === 'ADMIN' ? 'badge-danger' :
                                            u.role === 'DOCTOR' ? 'badge-info' :
                                            u.role === 'PHARMACIST' ? 'badge-purple' : 'badge-success'
                                        }">${u.role}</span>
                                    </td>
                                    <td>${escapeHtml(u.email)}</td>
                                    <td>${escapeHtml(u.phone || 'N/A')}</td>
                                    <td>${escapeHtml(getUserSpecifics(u))}</td>
                                    <td>
                                        ${isSelf ? '<span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">(Current Account)</span>' : `
                                            <button class="btn btn-outline-danger btn-sm" onclick="confirmDeleteUser(${uid}, '${escapeHtml(u.name)}')">
                                                Delete
                                            </button>
                                        `}
                                    </td>
                                </tr>
                            `}).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Failed to load user directory: ${e.message}</div>`;
    }
}

function setAdminRoleFilter(role, btn) {
    adminUserRoleFilter = role;
    document.querySelectorAll('.admin-role-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    filterUserTable();
}

function filterUserTable() {
    const q = (document.getElementById('userSearchInput')?.value || '').toLowerCase();
    const rows = document.querySelectorAll('#usersAdminTable tbody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        const role = r.getAttribute('data-role') || '';
        const matchesQuery = text.includes(q);
        const matchesRole = (adminUserRoleFilter === 'ALL' || role === adminUserRoleFilter);
        r.style.display = (matchesQuery && matchesRole) ? '' : 'none';
    });
}

function getUserSpecifics(u) {
    if (u.role === 'ADMIN') return u.department || 'Central Admin';
    if (u.role === 'PHARMACIST') return `Lic: ${u.pharmacyLicense || 'KL-DRUG'} | Emp: ${u.employeeId || 'EMP-PH'}`;
    if (u.role === 'DOCTOR') return `${u.specialization || 'Medicine'} (${u.qualification || 'MBBS'}) • ₹${u.consultationFee || 300}`;
    if (u.role === 'PATIENT') return `Blood: ${u.bloodGroup || 'O+'} • ${u.address || 'Kannur'}`;
    return '-';
}

function openAddUserModal(role) {
    let extraFields = '';
    let title = '';

    if (role === 'PHARMACIST') {
        title = 'Add New Pharmacist';
        extraFields = `
            <div class="form-row">
                <div class="form-group">
                    <label>Employee ID:</label>
                    <input type="text" id="userExtra1" class="form-control" value="EMP-PH-${Math.floor(100 + Math.random() * 900)}" required>
                </div>
                <div class="form-group">
                    <label>Pharmacy License Number:</label>
                    <input type="text" id="userExtra2" class="form-control" value="KL-DRUG-LIC-${Math.floor(1000 + Math.random() * 9000)}" required>
                </div>
            </div>
        `;
    } else if (role === 'DOCTOR') {
        title = 'Add New Doctor';
        extraFields = `
            <div class="form-row">
                <div class="form-group">
                    <label>Specialization:</label>
                    <input type="text" id="userExtra1" class="form-control" placeholder="e.g. General Medicine, Pediatrics" value="General Medicine" required>
                </div>
                <div class="form-group">
                    <label>Qualifications:</label>
                    <input type="text" id="userExtra2" class="form-control" value="MBBS, MD" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Medical Council License:</label>
                    <input type="text" id="userExtra3" class="form-control" value="KMC-${Math.floor(10000 + Math.random() * 90000)}" required>
                </div>
                <div class="form-group">
                    <label>Consultation Fee (₹):</label>
                    <input type="number" id="userExtra4" class="form-control" value="300" required>
                </div>
            </div>
        `;
    } else if (role === 'ADMIN') {
        title = 'Add New Administrator';
        extraFields = `
            <div class="form-group">
                <label>Department / Authority:</label>
                <input type="text" id="userExtra1" class="form-control" value="Central Pharmacy Administration" required>
            </div>
        `;
    } else if (role === 'PATIENT') {
        title = 'Add New Patient Account';
        extraFields = `
            <div class="form-row">
                <div class="form-group">
                    <label>Blood Group:</label>
                    <select id="userExtra1" class="form-control">
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                        <option value="A-">A-</option>
                        <option value="B-">B-</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date of Birth:</label>
                    <input type="date" id="userExtra2" class="form-control" value="2003-08-15" required>
                </div>
            </div>
            <div class="form-group">
                <label>Residential / Delivery Address:</label>
                <textarea id="userExtra3" class="form-control" rows="2" placeholder="House name, street, Mattanur / Kannur..." required>Kannur, Kerala</textarea>
            </div>
        `;
    }

    const html = `
        <div class="modal-header">
            <h3>${title}</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
        </div>
        <form onsubmit="handleCreateUserSubmit(event, '${role}')">
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name:</label>
                    <input type="text" id="userNameInput" class="form-control" placeholder="e.g. Dr. John Doe / Anjana S" required>
                </div>
                <div class="form-group">
                    <label>Phone Number:</label>
                    <input type="tel" id="userPhoneInput" class="form-control" placeholder="+91 98460 12345" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Official Email Address:</label>
                    <input type="email" id="userEmailInput" class="form-control" placeholder="staff@stthomas.ac.in" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="userPasswordInput" class="form-control" placeholder="••••••••" value="staff123" required>
                </div>
            </div>

            ${extraFields}

            <div id="modalAlert" class="alert-banner" style="display:none;"></div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Create ${role}</button>
            </div>
        </form>
    `;

    showModal(html);
}

async function handleCreateUserSubmit(e, role) {
    e.preventDefault();
    const alertEl = document.getElementById('modalAlert');
    if (alertEl) alertEl.style.display = 'none';

    const payload = {
        role: role,
        name: document.getElementById('userNameInput').value.trim(),
        phone: document.getElementById('userPhoneInput').value.trim(),
        email: document.getElementById('userEmailInput').value.trim(),
        password: document.getElementById('userPasswordInput').value.trim()
    };

    if (role === 'PHARMACIST') {
        payload.employeeId = document.getElementById('userExtra1').value.trim();
        payload.pharmacyLicense = document.getElementById('userExtra2').value.trim();
    } else if (role === 'DOCTOR') {
        payload.specialization = document.getElementById('userExtra1').value.trim();
        payload.qualification = document.getElementById('userExtra2').value.trim();
        payload.licenseNumber = document.getElementById('userExtra3').value.trim();
        payload.consultationFee = document.getElementById('userExtra4').value.trim();
    } else if (role === 'ADMIN') {
        payload.department = document.getElementById('userExtra1').value.trim();
    } else if (role === 'PATIENT') {
        payload.bloodGroup = document.getElementById('userExtra1').value;
        payload.dateOfBirth = document.getElementById('userExtra2').value;
        payload.address = document.getElementById('userExtra3').value.trim();
    }

    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            closeModal();
            loadView('admin-users');
            showBannerNotification(`Successfully created new ${role}: ${payload.name}`, 'success');
        } else {
            if (alertEl) {
                alertEl.className = 'alert-banner alert-danger';
                alertEl.textContent = data.error || 'Failed to create user.';
                alertEl.style.display = 'block';
            }
        }
    } catch (err) {
        if (alertEl) {
            alertEl.className = 'alert-banner alert-danger';
            alertEl.textContent = 'Server communication error: ' + err.message;
            alertEl.style.display = 'block';
        }
    }
}

async function confirmDeleteUser(id, name) {
    if (!confirm(`Are you sure you want to permanently delete user "${name}" (ID #${id})?`)) {
        return;
    }

    try {
        const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            loadView('admin-users');
            showBannerNotification(`User #${id} (${name}) has been removed.`, 'success');
        } else {
            alert('Failed to delete user.');
        }
    } catch (e) {
        alert('Server error while deleting user: ' + e.message);
    }
}

async function renderAdminReports(container) {
    try {
        const res = await fetch('/api/reports');
        const data = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Financial & Stock Audit Reports</h2>
                    <p>Live analysis of sales revenue, inventory valuation, and consultation metrics.</p>
                </div>
                <button class="btn btn-outline" onclick="window.print()">Print Report</button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div>
                        <div class="stat-number">₹${(data.totalRevenue || 0).toFixed(2)}</div>
                        <div class="stat-label">Total Medicine Revenue</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div>
                        <div class="stat-number">₹${(data.totalInventoryValue || 0).toFixed(2)}</div>
                        <div class="stat-label">Total Stock Valuation</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div>
                        <div class="stat-number">${data.totalOrdersPlaced || 0}</div>
                        <div class="stat-label">Orders Processed</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div>
                        <div class="stat-number">${data.lowStockCount || 0}</div>
                        <div class="stat-label" style="color:var(--danger);">Low Stock Warnings</div>
                    </div>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Summary Breakdown</h3>
                </div>
                <table class="data-table">
                    <tbody>
                        <tr><td><strong>Total Registered Users:</strong></td><td>${data.totalUsers || 0} accounts</td></tr>
                        <tr><td><strong>Unique Medicine SKUs:</strong></td><td>${data.totalMedicines || 0} active products</td></tr>
                        <tr><td><strong>Doctor Consultations Booked:</strong></td><td>${data.totalConsultations || 0} consultations</td></tr>
                        <tr><td><strong>Near Expiry SKUs (&lt; 60 days):</strong></td><td>${data.nearExpiryCount || 0} products</td></tr>
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error loading reports: ${e.message}</div>`;
    }
}

// ==========================================================================
// 5. PHARMACIST VIEWS (INVENTORY, ALERTS, ORDER DISPENSING)
// ==========================================================================

async function renderPharmacistInventory(container) {
    try {
        const res = await fetch('/api/medicines');
        const meds = await res.json();
        cachedMedicines = meds;

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Pharmacy Inventory Management</h2>
                    <p>View, add, edit, and restock medicine batches.</p>
                </div>
                <button class="btn btn-primary" onclick="openMedicineModal()">+ Add New Medicine</button>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>In-Stock Medicine Catalog (${meds.length})</h3>
                    <div>
                        <input type="text" id="inventorySearch" class="form-control" placeholder="Search catalog..." style="width:240px; display:inline-block;" oninput="filterInventoryTable()">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="data-table" id="inventoryTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Medicine Name</th>
                                <th>Category</th>
                                <th>Batch No</th>
                                <th>Expiry Date</th>
                                <th>Stock Qty</th>
                                <th>Price (₹)</th>
                                <th>Rx Required</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${meds.map(m => `
                                <tr>
                                    <td>#${m.medicineId}</td>
                                    <td><strong>${escapeHtml(m.name)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(m.strength || '')} • ${escapeHtml(m.dosageForm || '')}</small></td>
                                    <td><span class="badge badge-info">${escapeHtml(m.category)}</span></td>
                                    <td><code>${escapeHtml(m.batchNumber)}</code></td>
                                    <td>${escapeHtml(m.expiryDate)}</td>
                                    <td>
                                        <strong style="color: ${m.stockQuantity <= 15 ? 'var(--danger)' : 'var(--success)'};">
                                            ${m.stockQuantity} units
                                        </strong>
                                    </td>
                                    <td><strong>₹${Number(m.price).toFixed(2)}</strong></td>
                                    <td>${m.requiresPrescription ? '<span class="badge badge-warning">Rx Required</span>' : '<span class="badge badge-success">OTC</span>'}</td>
                                    <td>
                                        <button class="btn btn-outline btn-sm" onclick="openMedicineModal(${m.medicineId})">Edit</button>
                                        <button class="btn btn-outline-danger btn-sm" onclick="confirmDeleteMedicine(${m.medicineId}, '${escapeHtml(m.name)}')">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error loading inventory: ${e.message}</div>`;
    }
}

function filterInventoryTable() {
    const q = document.getElementById('inventorySearch').value.toLowerCase();
    document.querySelectorAll('#inventoryTable tbody tr').forEach(r => {
        r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

function openMedicineModal(medId = null) {
    let m = {
        medicineId: 0,
        name: '',
        category: 'Analgesics',
        manufacturer: 'Cipla Ltd',
        price: 50.0,
        stockQuantity: 100,
        batchNumber: 'BAT-' + Math.floor(1000 + Math.random() * 9000),
        expiryDate: '2027-12-31',
        requiresPrescription: false,
        dosageForm: 'Tablet',
        strength: '500mg',
        description: ''
    };

    if (medId) {
        const found = cachedMedicines.find(item => item.medicineId === medId);
        if (found) m = found;
    }

    const html = `
        <div class="modal-header">
            <h3>${medId ? 'Edit Medicine #' + medId : 'Add New Medicine'}</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
        </div>
        <form onsubmit="handleSaveMedicineSubmit(event, ${m.medicineId})">
            <div class="form-row">
                <div class="form-group">
                    <label>Medicine Name:</label>
                    <input type="text" id="medName" class="form-control" value="${escapeHtml(m.name)}" placeholder="e.g. Paracetamol" required>
                </div>
                <div class="form-group">
                    <label>Category:</label>
                    <select id="medCategory" class="form-control">
                        <option value="Analgesics" ${m.category === 'Analgesics' ? 'selected' : ''}>Analgesics (Pain Relief)</option>
                        <option value="Antibiotics" ${m.category === 'Antibiotics' ? 'selected' : ''}>Antibiotics</option>
                        <option value="Antacids" ${m.category === 'Antacids' ? 'selected' : ''}>Antacids & Gastro</option>
                        <option value="Cardiology" ${m.category === 'Cardiology' ? 'selected' : ''}>Cardiology</option>
                        <option value="Antihistamines" ${m.category === 'Antihistamines' ? 'selected' : ''}>Antihistamines (Allergy)</option>
                        <option value="Vitamins" ${m.category === 'Vitamins' ? 'selected' : ''}>Vitamins & Supplements</option>
                        <option value="First Aid" ${m.category === 'First Aid' ? 'selected' : ''}>First Aid & Topicals</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Manufacturer:</label>
                    <input type="text" id="medMfg" class="form-control" value="${escapeHtml(m.manufacturer)}" required>
                </div>
                <div class="form-group">
                    <label>Batch Number:</label>
                    <input type="text" id="medBatch" class="form-control" value="${escapeHtml(m.batchNumber)}" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Dosage Form:</label>
                    <input type="text" id="medForm" class="form-control" value="${escapeHtml(m.dosageForm)}" placeholder="Tablet, Syrup, Injection..." required>
                </div>
                <div class="form-group">
                    <label>Strength / Potency:</label>
                    <input type="text" id="medStrength" class="form-control" value="${escapeHtml(m.strength)}" placeholder="e.g. 500mg, 10mg/5ml" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Unit Price (₹):</label>
                    <input type="number" step="0.01" id="medPrice" class="form-control" value="${m.price}" required>
                </div>
                <div class="form-group">
                    <label>Stock Quantity:</label>
                    <input type="number" id="medStock" class="form-control" value="${m.stockQuantity}" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Expiry Date:</label>
                    <input type="date" id="medExpiry" class="form-control" value="${m.expiryDate}" required>
                </div>
                <div class="form-group">
                    <label>Prescription Requirement:</label>
                    <select id="medRx" class="form-control">
                        <option value="false" ${!m.requiresPrescription ? 'selected' : ''}>No (Over The Counter / OTC)</option>
                        <option value="true" ${m.requiresPrescription ? 'selected' : ''}>Yes (Doctor Prescription Required)</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Description / Usage Note:</label>
                <textarea id="medDesc" class="form-control" rows="2" placeholder="Indications, precautions...">${escapeHtml(m.description || '')}</textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Medicine</button>
            </div>
        </form>
    `;
    showModal(html);
}

async function handleSaveMedicineSubmit(e, id) {
    e.preventDefault();
    const payload = {
        medicineId: id.toString(),
        name: document.getElementById('medName').value.trim(),
        category: document.getElementById('medCategory').value,
        manufacturer: document.getElementById('medMfg').value.trim(),
        batchNumber: document.getElementById('medBatch').value.trim(),
        dosageForm: document.getElementById('medForm').value.trim(),
        strength: document.getElementById('medStrength').value.trim(),
        price: document.getElementById('medPrice').value.trim(),
        stockQuantity: document.getElementById('medStock').value.trim(),
        expiryDate: document.getElementById('medExpiry').value.trim(),
        requiresPrescription: document.getElementById('medRx').value,
        description: document.getElementById('medDesc').value.trim()
    };

    try {
        const res = await fetch('/api/medicines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeModal();
            loadView('pharmacist-inventory');
            showBannerNotification(`Medicine "${payload.name}" updated successfully.`, 'success');
        } else {
            alert('Failed to save medicine.');
        }
    } catch (err) {
        alert('Server error: ' + err.message);
    }
}

async function confirmDeleteMedicine(id, name) {
    if (!confirm(`Delete medicine "${name}" (#${id}) from inventory?`)) return;

    try {
        const res = await fetch(`/api/medicines?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            loadView('pharmacist-inventory');
            showBannerNotification(`Medicine #${id} removed.`, 'success');
        } else {
            alert('Could not delete medicine.');
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }
}

async function renderPharmacistAlerts(container) {
    try {
        const [lowRes, expRes] = await Promise.all([
            fetch('/api/medicines?filter=low'),
            fetch('/api/medicines?filter=expiry')
        ]);
        const lowMeds = await lowRes.json();
        const expMeds = await expRes.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Stock & Expiry Surveillance</h2>
                    <p>Immediate alerts for low inventory thresholds and upcoming expiry dates.</p>
                </div>
            </div>

            <div class="content-card" style="border-left: 4px solid var(--danger);">
                <div class="card-title-bar">
                    <h3 style="color:var(--danger);">⚠️ Low Stock Alerts (&lt; 15 units remaining)</h3>
                    <span class="badge badge-danger">${lowMeds.length} items</span>
                </div>
                ${lowMeds.length === 0 ? '<p class="empty-state">All medicine stock levels are currently healthy!</p>' : `
                    <table class="data-table">
                        <thead><tr><th>Medicine</th><th>Current Stock</th><th>Batch</th><th>Action</th></tr></thead>
                        <tbody>
                            ${lowMeds.map(m => `
                                <tr>
                                    <td><strong>${escapeHtml(m.name)}</strong> (${m.category})</td>
                                    <td><strong style="color:var(--danger);">${m.stockQuantity} units</strong></td>
                                    <td>${m.batchNumber}</td>
                                    <td><button class="btn btn-primary btn-sm" onclick="openMedicineModal(${m.medicineId})">Restock Now</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            </div>

            <div class="content-card" style="border-left: 4px solid var(--warning);">
                <div class="card-title-bar">
                    <h3 style="color:var(--warning);">⏳ Near Expiry Alerts (&lt; 60 days)</h3>
                    <span class="badge badge-warning">${expMeds.length} items</span>
                </div>
                ${expMeds.length === 0 ? '<p class="empty-state">No medicines are nearing expiration in the next 60 days.</p>' : `
                    <table class="data-table">
                        <thead><tr><th>Medicine</th><th>Expiry Date</th><th>Batch</th><th>Stock</th><th>Action</th></tr></thead>
                        <tbody>
                            ${expMeds.map(m => `
                                <tr>
                                    <td><strong>${escapeHtml(m.name)}</strong></td>
                                    <td><strong style="color:var(--warning);">${m.expiryDate}</strong></td>
                                    <td>${m.batchNumber}</td>
                                    <td>${m.stockQuantity} units</td>
                                    <td><button class="btn btn-outline btn-sm" onclick="openMedicineModal(${m.medicineId})">Inspect Batch</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error loading alerts: ${e.message}</div>`;
    }
}

async function renderPharmacistOrders(container) {
    try {
        const res = await fetch('/api/orders');
        const orders = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Dispense & Track Customer Orders</h2>
                    <p>Review placed orders, verify prescriptions, and dispatch packages.</p>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Incoming Order Queue (${orders.length})</h3>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total (₹)</th>
                                <th>Delivery Address</th>
                                <th>Status</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(o => `
                                <tr>
                                    <td>#ORD-${o.orderId}</td>
                                    <td><strong>${escapeHtml(o.patientName)}</strong></td>
                                    <td>${o.orderDate}</td>
                                    <td>${o.items ? o.items.map(it => `${it.quantity}x ${escapeHtml(it.medicineName)}`).join('<br>') : '-'}</td>
                                    <td><strong>₹${Number(o.totalAmount).toFixed(2)}</strong></td>
                                    <td><small>${escapeHtml(o.deliveryAddress || 'Pickup')}</small></td>
                                    <td><span class="badge ${getStatusBadge(o.status)}">${o.status}</span></td>
                                    <td>
                                        <select class="form-control" style="width:130px; font-size:0.75rem;" onchange="updateOrderStatus(${o.orderId}, this.value)">
                                            <option value="PENDING" ${o.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                                            <option value="PROCESSING" ${o.status === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                                            <option value="DISPATCHED" ${o.status === 'DISPATCHED' ? 'selected' : ''}>DISPATCHED</option>
                                            <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                                            <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                                        </select>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error loading orders: ${e.message}</div>`;
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const res = await fetch('/api/orders/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId.toString(), status: newStatus })
        });
        if (res.ok) {
            showBannerNotification(`Order #ORD-${orderId} updated to ${newStatus}`, 'success');
        }
    } catch (e) {
        alert('Could not update status: ' + e.message);
    }
}

// ==========================================================================
// 6. DOCTOR VIEWS (CONSULTATIONS, PRESCRIPTIONS)
// ==========================================================================

async function renderDoctorConsultations(container) {
    try {
        const res = await fetch(`/api/consultations?doctorId=${currentUser.id}`);
        const list = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Clinical Consultation Queue</h2>
                    <p>Review patient symptom requests and issue certified digital prescriptions.</p>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Appointments Assigned to ${escapeHtml(currentUser.name)} (${list.length})</h3>
                </div>
                ${list.length === 0 ? '<p class="empty-state">No scheduled appointments at this time.</p>' : `
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Ref #</th>
                                    <th>Patient</th>
                                    <th>Slot / Date</th>
                                    <th>Reported Symptoms</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${list.map(c => `
                                    <tr>
                                        <td>#APT-${c.consultationId}</td>
                                        <td><strong>${escapeHtml(c.patientName)}</strong></td>
                                        <td>${c.consultationDate} • ${escapeHtml(c.timeSlot)}</td>
                                        <td>${escapeHtml(c.symptoms)}</td>
                                        <td><span class="badge ${c.status === 'SCHEDULED' ? 'badge-warning' : 'badge-success'}">${c.status}</span></td>
                                        <td>
                                            <button class="btn btn-primary btn-sm" onclick="openPrescriptionBuilder(${c.consultationId}, ${c.patientId}, '${escapeHtml(c.patientName)}')">
                                                Write Prescription &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error: ${e.message}</div>`;
    }
}

async function renderDoctorIssueRx(container) {
    try {
        const usersRes = await fetch('/api/users');
        const users = await usersRes.json();
        const patients = users.filter(u => u.role === 'PATIENT');

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Issue Certified Digital Prescription</h2>
                    <p>Formulate diagnosis, medicinal dosages, and safety advice.</p>
                </div>
            </div>

            <div class="content-card">
                <form onsubmit="handlePrescriptionSubmit(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Select Patient:</label>
                            <select id="rxPatientSelect" class="form-control" required>
                                ${patients.map(p => `<option value="${p.id}" data-name="${escapeHtml(p.name)}">${escapeHtml(p.name)} (ID #${p.id})</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Issue Date:</label>
                            <input type="date" id="rxDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Clinical Diagnosis / Findings:</label>
                        <input type="text" id="rxDiagnosis" class="form-control" placeholder="e.g. Acute Upper Respiratory Tract Infection, Allergic Rhinitis" required>
                    </div>

                    <div class="form-group">
                        <label>Prescribed Medicines:</label>
                        <div id="rxMedicinesRows" style="margin-bottom:0.75rem;">
                            <!-- Injected rows -->
                        </div>
                        <button type="button" class="btn btn-outline btn-sm" onclick="addRxMedicineRow()">+ Add Another Medicine</button>
                    </div>

                    <div class="form-group">
                        <label>Clinical Advice & Instructions:</label>
                        <textarea id="rxAdvice" class="form-control" rows="3" placeholder="Drink plenty of warm water, complete full antibiotic course, return for checkup if fever persists..." required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary" style="padding:0.65rem 1.5rem; font-weight:700;">
                        Certify & Issue Prescription
                    </button>
                </form>
            </div>
        `;
        addRxMedicineRow(); // initial row
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error: ${e.message}</div>`;
    }
}

let rxRowCounter = 0;
function addRxMedicineRow(defaultName = '', defaultDosage = '', defaultFreq = '', defaultDur = '') {
    const container = document.getElementById('rxMedicinesRows');
    if (!container) return;
    rxRowCounter++;
    const rowId = `rxRow_${rxRowCounter}`;

    const div = document.createElement('div');
    div.id = rowId;
    div.className = 'form-row';
    div.style.marginBottom = '0.5rem';
    div.innerHTML = `
        <input type="text" class="form-control rx-med-name" placeholder="Medicine Name (e.g. Paracetamol 650mg)" value="${defaultName}" required>
        <input type="text" class="form-control rx-med-dosage" placeholder="Dosage (e.g. 1 Tablet)" value="${defaultDosage || '1 Tablet'}" required>
        <input type="text" class="form-control rx-med-freq" placeholder="Frequency (e.g. 1-0-1 After Food)" value="${defaultFreq || '1-0-1 After Food'}" required>
        <div style="display:flex; gap:0.5rem;">
            <input type="text" class="form-control rx-med-dur" placeholder="Duration (e.g. 5 Days)" value="${defaultDur || '5 Days'}" required>
            <button type="button" class="btn btn-outline-danger btn-sm" onclick="document.getElementById('${rowId}').remove()">&times;</button>
        </div>
    `;
    container.appendChild(div);
}

function openPrescriptionBuilder(consultId, patientId, patientName) {
    loadView('doctor-issue-rx');
    setTimeout(() => {
        const sel = document.getElementById('rxPatientSelect');
        if (sel) sel.value = patientId;
    }, 100);
}

async function handlePrescriptionSubmit(e) {
    e.preventDefault();
    const sel = document.getElementById('rxPatientSelect');
    const patientId = sel.value;
    const patientName = sel.options[sel.selectedIndex].getAttribute('data-name');
    const issueDate = document.getElementById('rxDate').value;
    const diagnosis = document.getElementById('rxDiagnosis').value.trim();
    const advice = document.getElementById('rxAdvice').value.trim();

    const rows = document.querySelectorAll('#rxMedicinesRows .form-row');
    const items = [];
    rows.forEach(r => {
        const name = r.querySelector('.rx-med-name').value.trim();
        const dosage = r.querySelector('.rx-med-dosage').value.trim();
        const freq = r.querySelector('.rx-med-freq').value.trim();
        const dur = r.querySelector('.rx-med-dur').value.trim();
        if (name) {
            items.push(`${name}|${dosage}|${freq}|${dur}|Take as prescribed`);
        }
    });

    const payload = {
        consultationId: '0',
        patientId: patientId,
        patientName: patientName,
        doctorId: currentUser.id.toString(),
        doctorName: currentUser.name,
        issueDate: issueDate,
        diagnosis: diagnosis,
        advice: advice,
        medicinesList: items.join(';')
    };

    try {
        const res = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showBannerNotification(`Prescription for ${patientName} has been issued successfully.`, 'success');
            loadView('doctor-prescriptions');
        } else {
            alert('Failed to issue prescription.');
        }
    } catch (err) {
        alert('Server error: ' + err.message);
    }
}

async function renderDoctorPrescriptions(container) {
    try {
        const res = await fetch('/api/prescriptions');
        const list = await res.json();
        const myRx = list.filter(rx => rx.doctorId === currentUser.id);

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Doctor Prescription Log</h2>
                    <p>Digital medical prescriptions authorized under your medical license.</p>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Prescription Archives (${myRx.length})</h3>
                </div>
                ${myRx.length === 0 ? '<p class="empty-state">No prescriptions recorded yet.</p>' : `
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Rx ID</th>
                                    <th>Date</th>
                                    <th>Patient</th>
                                    <th>Diagnosis</th>
                                    <th>Medications Prescribed</th>
                                    <th>Advice</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${myRx.map(rx => `
                                    <tr>
                                        <td><strong>#RX-${rx.prescriptionId}</strong></td>
                                        <td>${rx.issueDate}</td>
                                        <td><strong>${escapeHtml(rx.patientName)}</strong></td>
                                        <td><span class="badge badge-info">${escapeHtml(rx.diagnosis)}</span></td>
                                        <td>
                                            ${rx.medicines ? rx.medicines.map(m => `• <strong>${escapeHtml(m.medicineName)}</strong>: ${escapeHtml(m.dosage)} (${escapeHtml(m.frequency)})`).join('<br>') : '-'}
                                        </td>
                                        <td><small>${escapeHtml(rx.advice)}</small></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error: ${e.message}</div>`;
    }
}

// ==========================================================================
// 7. PATIENT VIEWS (BROWSE MEDICINES, CART, ORDERS, BILLS, CONSULT)
// ==========================================================================

async function renderPatientMedicines(container) {
    try {
        const res = await fetch('/api/medicines');
        const meds = await res.json();
        cachedMedicines = meds;

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Pharmacy Medicine Store</h2>
                    <p>Order prescription drugs and wellness essentials with instant delivery to Kannur & campus.</p>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="toggleCart(true)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        View Cart (<span id="btnCartCount">${cart.reduce((s, i) => s + i.quantity, 0)}</span>)
                    </button>
                </div>
            </div>

            <div class="content-card" style="margin-bottom:1.25rem; padding:1rem 1.25rem;">
                <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
                    <input type="text" id="patientMedSearch" class="form-control" placeholder="Search medicine by name or symptoms..." style="flex:1; min-width:240px;" oninput="filterPatientMedicines()">
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        <button class="btn btn-outline btn-sm active" onclick="filterByCategory('ALL', this)">All</button>
                        <button class="btn btn-outline btn-sm" onclick="filterByCategory('Analgesics', this)">Analgesics</button>
                        <button class="btn btn-outline btn-sm" onclick="filterByCategory('Antibiotics', this)">Antibiotics</button>
                        <button class="btn btn-outline btn-sm" onclick="filterByCategory('Cardiology', this)">Cardiology</button>
                        <button class="btn btn-outline btn-sm" onclick="filterByCategory('Antacids', this)">Antacids</button>
                        <button class="btn btn-outline btn-sm" onclick="filterByCategory('Vitamins', this)">Vitamins</button>
                    </div>
                </div>
            </div>

            <div class="medicine-grid" id="patientMedicineGrid">
                ${renderMedicineCardsHtml(meds)}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error loading store: ${e.message}</div>`;
    }
}

function renderMedicineCardsHtml(meds) {
    if (!meds || meds.length === 0) {
        return '<p class="empty-state">No medicines found matching your criteria.</p>';
    }
    return meds.map(m => `
        <div class="medicine-card" data-category="${escapeHtml(m.category)}" data-name="${escapeHtml(m.name).toLowerCase()}">
            <div>
                <div class="med-header">
                    <div>
                        <span class="med-category">${escapeHtml(m.category)}</span>
                        <h4 class="med-name">${escapeHtml(m.name)}</h4>
                    </div>
                    ${m.requiresPrescription ? '<span class="badge badge-warning">Rx</span>' : '<span class="badge badge-success">OTC</span>'}
                </div>
                <p class="med-desc">${escapeHtml(m.description || 'Clinical therapeutic medicine.')}</p>
                <div class="med-meta">
                    Form: <strong>${escapeHtml(m.dosageForm || 'Tablet')}</strong> (${escapeHtml(m.strength || '-')})<br>
                    Stock: <span style="color:${m.stockQuantity > 10 ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">${m.stockQuantity} available</span>
                </div>
            </div>
            <div class="med-footer">
                <span class="med-price">₹${Number(m.price).toFixed(2)}</span>
                ${m.stockQuantity > 0 ? `
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${m.medicineId})">
                        + Add to Cart
                    </button>
                ` : `
                    <button class="btn btn-outline btn-sm" disabled style="opacity:0.5;">Out of Stock</button>
                `}
            </div>
        </div>
    `).join('');
}

function filterPatientMedicines() {
    const q = document.getElementById('patientMedSearch').value.toLowerCase();
    document.querySelectorAll('#patientMedicineGrid .medicine-card').forEach(c => {
        const text = c.textContent.toLowerCase();
        c.style.display = text.includes(q) ? 'flex' : 'none';
    });
}

function filterByCategory(cat, btn) {
    document.querySelectorAll('.btn-outline.btn-sm').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('#patientMedicineGrid .medicine-card').forEach(c => {
        if (cat === 'ALL' || c.getAttribute('data-category') === cat) {
            c.style.display = 'flex';
        } else {
            c.style.display = 'none';
        }
    });
}

// Cart Mechanics
function toggleCart(show) {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    if (show) drawer.classList.add('open');
    else drawer.classList.remove('open');
}

function addToCart(medId) {
    const med = cachedMedicines.find(m => m.medicineId === medId);
    if (!med) return;

    const existing = cart.find(item => item.medicineId === medId);
    if (existing) {
        if (existing.quantity < med.stockQuantity) {
            existing.quantity++;
        } else {
            alert(`Maximum available stock is ${med.stockQuantity} units.`);
            return;
        }
    } else {
        cart.push({
            medicineId: med.medicineId,
            name: med.name,
            price: med.price,
            quantity: 1
        });
    }

    updateCartUI();
    toggleCart(true);
}

function updateCartUI() {
    const list = document.getElementById('cartItemsList');
    const countEl = document.getElementById('cartCount');
    const btnCount = document.getElementById('btnCartCount');
    const subtotalEl = document.getElementById('cartSubtotal');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');

    const totalQty = cart.reduce((s, i) => s + i.quantity, 0);
    if (countEl) countEl.textContent = totalQty;
    if (btnCount) btnCount.textContent = totalQty;

    let subtotal = 0;
    cart.forEach(i => subtotal += (i.price * i.quantity));
    const tax = subtotal * 0.05; // 5% GST
    const total = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
        return;
    }

    list.innerHTML = cart.map((it, idx) => `
        <div class="cart-item-row">
            <div>
                <strong>${escapeHtml(it.name)}</strong><br>
                <small style="color:var(--text-muted);">₹${it.price.toFixed(2)} each</small>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <button class="btn btn-outline btn-sm" onclick="changeCartQty(${idx}, -1)">-</button>
                <span style="font-weight:700;">${it.quantity}</span>
                <button class="btn btn-outline btn-sm" onclick="changeCartQty(${idx}, 1)">+</button>
                <strong style="margin-left:0.5rem;">₹${(it.price * it.quantity).toFixed(2)}</strong>
            </div>
        </div>
    `).join('');

    const addr = document.getElementById('cartAddress');
    if (addr && currentUser && !addr.value) {
        addr.value = currentUser.address || 'Kannur, Kerala';
    }
}

function changeCartQty(idx, delta) {
    if (cart[idx]) {
        cart[idx].quantity += delta;
        if (cart[idx].quantity <= 0) {
            cart.splice(idx, 1);
        }
        updateCartUI();
    }
}

async function checkoutOrder() {
    if (cart.length === 0) {
        alert('Your shopping cart is empty.');
        return;
    }

    const addr = document.getElementById('cartAddress').value.trim();
    if (!addr) {
        alert('Please enter a delivery address.');
        return;
    }

    const itemsSummary = cart.map(i => `${i.medicineId}:${i.quantity}`).join(';');
    const payload = {
        patientId: currentUser.id.toString(),
        patientName: currentUser.name,
        prescriptionId: '0',
        deliveryAddress: addr,
        itemsSummary: itemsSummary
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            cart = [];
            updateCartUI();
            toggleCart(false);
            showBannerNotification(`Order #${data.orderId} placed successfully with automated bill generation!`, 'success');
            loadView('patient-orders');
        } else {
            alert(data.error || 'Failed to place order. Check stock availability.');
        }
    } catch (e) {
        alert('Network error: ' + e.message);
    }
}

async function renderPatientOrders(container) {
    try {
        const res = await fetch(`/api/orders?patientId=${currentUser.id}`);
        const orders = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>My Orders & Tax Invoices</h2>
                    <p>Track status and view GST tax bills for your medicine purchases.</p>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Purchase History (${orders.length})</h3>
                </div>
                ${orders.length === 0 ? '<p class="empty-state">You have not placed any medicine orders yet.</p>' : `
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Date</th>
                                    <th>Medicines</th>
                                    <th>Total (₹)</th>
                                    <th>Status</th>
                                    <th>Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(o => `
                                    <tr>
                                        <td><strong>#ORD-${o.orderId}</strong></td>
                                        <td>${o.orderDate}</td>
                                        <td>${o.items ? o.items.map(it => `${it.quantity}x ${escapeHtml(it.medicineName)}`).join(', ') : '-'}</td>
                                        <td><strong>₹${Number(o.totalAmount).toFixed(2)}</strong></td>
                                        <td><span class="badge ${getStatusBadge(o.status)}">${o.status}</span></td>
                                        <td>
                                            <button class="btn btn-outline btn-sm" onclick="viewOrderBill(${o.orderId})">
                                                View Bill &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error: ${e.message}</div>`;
    }
}

async function viewOrderBill(orderId) {
    try {
        const res = await fetch(`/api/bills?orderId=${orderId}`);
        const b = await res.json();

        const html = `
            <div class="bill-container" id="printableInvoice">
                <div class="bill-header">
                    <h2>ST. THOMAS PHARMACY</h2>
                    <p>St. Thomas College of Engineering & Technology, Kannur, Kerala - 670706</p>
                    <p style="font-size:0.8rem; color:var(--text-muted);">Drug License No: KL-DRUG-LIC-8821 | GSTIN: 32AABCU9603R1ZM</p>
                    <h3 style="margin-top:0.75rem; text-decoration:underline;">TAX INVOICE / CASH BILL</h3>
                </div>

                <div class="bill-meta-grid">
                    <div>
                        <strong>Bill No:</strong> #BILL-${b.billId || orderId}<br>
                        <strong>Order Ref:</strong> #ORD-${b.orderId || orderId}<br>
                        <strong>Bill Date:</strong> ${b.billDate || new Date().toISOString().split('T')[0]}
                    </div>
                    <div style="text-align:right;">
                        <strong>Billed To:</strong> ${escapeHtml(b.patientName || currentUser.name)}<br>
                        <strong>Patient ID:</strong> #${currentUser.id}<br>
                        <strong>Payment Status:</strong> <span class="badge badge-success">${b.paymentStatus || 'PAID'}</span>
                    </div>
                </div>

                <table class="data-table" style="margin-bottom:1.25rem;">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${b.items ? b.items.map(it => `
                            <tr>
                                <td>${escapeHtml(it.medicineName)}</td>
                                <td>${it.quantity}</td>
                                <td>₹${Number(it.unitPrice).toFixed(2)}</td>
                                <td>₹${(it.quantity * it.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>

                <div style="display:flex; justify-content:flex-end;">
                    <div style="width:250px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
                            <span>Subtotal:</span>
                            <strong>₹${Number(b.subtotal).toFixed(2)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
                            <span>GST (5%):</span>
                            <strong>₹${Number(b.taxAmount).toFixed(2)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; border-top:2px solid #000; padding-top:0.35rem;">
                            <span>Total Paid:</span>
                            <span style="color:var(--primary-dark);">₹${Number(b.grandTotal).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top:2rem; font-size:0.75rem; text-align:center; color:var(--text-muted); border-top:1px dashed var(--border-strong); padding-top:0.75rem;">
                    * Computer generated invoice certified by St. Thomas College of Engg & Tech Pharmacy Portal *
                </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
                <button class="btn btn-outline" onclick="closeModal()">Close</button>
                <button class="btn btn-primary" onclick="printInvoice()">Print Invoice</button>
            </div>
        `;

        showModal(html);
    } catch (e) {
        alert('Could not fetch bill details: ' + e.message);
    }
}

function printInvoice() {
    window.print();
}

async function renderPatientConsult(container) {
    try {
        const res = await fetch('/api/doctors');
        const doctors = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>Doctor Consultation Service</h2>
                    <p>Consult licensed medical practitioners online for symptom evaluation and prescriptions.</p>
                </div>
            </div>

            <div class="medicine-grid">
                ${doctors.map(d => `
                    <div class="medicine-card">
                        <div>
                            <div class="med-header">
                                <div>
                                    <span class="med-category">${escapeHtml(d.specialization || 'General Medicine')}</span>
                                    <h4 class="med-name">${escapeHtml(d.name)}</h4>
                                </div>
                                <span class="badge badge-info">${escapeHtml(d.qualification || 'MBBS')}</span>
                            </div>
                            <p class="med-desc">
                                Registered Medical Practitioner (${escapeHtml(d.licenseNumber || 'KMC')}). Specializing in diagnosis and chronic care.
                            </p>
                            <div class="med-meta">
                                Consultation Fee: <strong>₹${Number(d.consultationFee || 300).toFixed(2)}</strong><br>
                                Phone: ${escapeHtml(d.phone || 'Available')}
                            </div>
                        </div>
                        <div class="med-footer">
                            <button class="btn btn-accent btn-block" onclick="openBookConsultModal(${d.id}, '${escapeHtml(d.name)}')">
                                Book Consultation Appointment &rarr;
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error: ${e.message}</div>`;
    }
}

function openBookConsultModal(doctorId, doctorName) {
    const html = `
        <div class="modal-header">
            <h3>Book Appointment with ${doctorName}</h3>
            <button class="close-btn" onclick="closeModal()">&times;</button>
        </div>
        <form onsubmit="handleBookConsultSubmit(event, ${doctorId})">
            <div class="form-row">
                <div class="form-group">
                    <label>Preferred Date:</label>
                    <input type="date" id="bookDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label>Preferred Time Slot:</label>
                    <select id="bookSlot" class="form-control">
                        <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                        <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                        <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                        <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Current Symptoms & Health Concerns:</label>
                <textarea id="bookSymptoms" class="form-control" rows="3" placeholder="Describe symptoms (e.g. fever since 2 days, persistent headache, sore throat)..." required></textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Confirm Appointment</button>
            </div>
        </form>
    `;
    showModal(html);
}

async function handleBookConsultSubmit(e, doctorId) {
    e.preventDefault();
    const payload = {
        patientId: currentUser.id.toString(),
        patientName: currentUser.name,
        doctorId: doctorId.toString(),
        symptoms: document.getElementById('bookSymptoms').value.trim(),
        consultationDate: document.getElementById('bookDate').value,
        timeSlot: document.getElementById('bookSlot').value
    };

    try {
        const res = await fetch('/api/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeModal();
            showBannerNotification('Doctor appointment booked successfully! The doctor will review your case.', 'success');
        } else {
            alert('Failed to book appointment.');
        }
    } catch (err) {
        alert('Server error: ' + err.message);
    }
}

async function renderPatientPrescriptions(container) {
    try {
        const res = await fetch(`/api/prescriptions?patientId=${currentUser.id}`);
        const list = await res.json();

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h2>My Prescriptions</h2>
                    <p>Digital medical prescriptions issued by your consulting doctors.</p>
                </div>
            </div>

            <div class="content-card">
                <div class="card-title-bar">
                    <h3>Certified Prescriptions (${list.length})</h3>
                </div>
                ${list.length === 0 ? '<p class="empty-state">No prescriptions on file yet.</p>' : `
                    <div class="medicine-grid">
                        ${list.map(rx => `
                            <div class="medicine-card" style="border-top:3px solid var(--role-patient);">
                                <div>
                                    <div class="med-header">
                                        <div>
                                            <span class="med-category">Issued by ${escapeHtml(rx.doctorName)}</span>
                                            <h4 class="med-name">Rx #${rx.prescriptionId}</h4>
                                        </div>
                                        <span class="badge badge-success">${rx.issueDate}</span>
                                    </div>
                                    <div style="margin: 0.5rem 0;">
                                        <strong>Diagnosis:</strong> <span style="color:var(--primary-dark); font-weight:700;">${escapeHtml(rx.diagnosis)}</span>
                                    </div>
                                    <div style="background:var(--bg-surface); padding:0.75rem; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:0.75rem;">
                                        <strong>Medications:</strong><br>
                                        ${rx.medicines ? rx.medicines.map(m => `• <strong>${escapeHtml(m.medicineName)}</strong> - ${escapeHtml(m.dosage)} (${escapeHtml(m.frequency)}) for ${escapeHtml(m.duration)}`).join('<br>') : 'None'}
                                    </div>
                                    <div style="font-size:0.8rem; color:var(--text-secondary);">
                                        <strong>Doctor's Advice:</strong> ${escapeHtml(rx.advice)}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="alert-banner alert-danger">Error: ${e.message}</div>`;
    }
}

// ==========================================================================
// 8. MODAL & NOTIFICATION HELPERS
// ==========================================================================

function showModal(contentHtml) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    if (overlay && content) {
        content.innerHTML = contentHtml;
        overlay.style.display = 'flex';
    }
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.style.display = 'none';
}

function showBannerNotification(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.className = `alert-banner alert-${type}`;
    div.textContent = message;
    container.innerHTML = '';
    container.appendChild(div);

    setTimeout(() => {
        if (div.parentNode) div.remove();
    }, 4000);
}

function getStatusBadge(st) {
    if (st === 'DELIVERED') return 'badge-success';
    if (st === 'DISPATCHED' || st === 'PROCESSING') return 'badge-info';
    if (st === 'CANCELLED') return 'badge-danger';
    return 'badge-warning';
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
