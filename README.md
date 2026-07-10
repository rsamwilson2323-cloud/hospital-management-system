# Hospital Management System (HMS)

A full-featured web application for managing hospital operations — patients, doctors, appointments, billing, medical records, pharmacy, and lab reports.

---

## Table of Contents

1. [System Requirements](#1-system-requirements)
2. [Step 1 — Install Node.js](#2-step-1--install-nodejs)
3. [Step 2 — Install pnpm](#3-step-2--install-pnpm)
4. [Step 3 — Install PostgreSQL](#4-step-3--install-postgresql)
5. [Step 4 — Create the HMS Database](#5-step-4--create-the-hms-database)
6. [Step 5 — Configure the Project](#6-step-5--configure-the-project)
7. [Step 6 — Run the Project](#7-step-6--run-the-project)
8. [How to Use the System](#8-how-to-use-the-system)
9. [Module Guide](#9-module-guide)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. System Requirements

Before starting, make sure your computer has:

| Requirement | Version | Download |
|-------------|---------|----------|
| Windows | 10 or 11 | — |
| Node.js | 18 or higher | https://nodejs.org |
| pnpm | Latest | Installed via npm |
| PostgreSQL | 15 or 16 | https://www.postgresql.org |

---

## 2. Step 1 — Install Node.js

1. Go to **https://nodejs.org/en/download**
2. Download the **LTS (Long-Term Support)** version for Windows
3. Run the installer (.msi file)
4. Keep all default settings and click **Next** through to finish
5. Restart your computer after installation

**Verify it worked** — open Command Prompt and type:
```
node --version
```
You should see something like `v20.11.0`

---

## 3. Step 2 — Install pnpm

pnpm is the package manager used by this project.

1. Open **Command Prompt** (search "cmd" in Start menu)
2. Type this command and press Enter:
```
npm install -g pnpm
```
3. Wait for it to finish

**Verify it worked:**
```
pnpm --version
```
You should see a version number like `8.15.0`

---

## 4. Step 3 — Install PostgreSQL

PostgreSQL is the database that stores all hospital data.

1. Go to **https://www.postgresql.org/download/windows/**
2. Click **"Download the installer"**
3. Select the latest **16.x** version, **Windows x86-64**
4. Run the downloaded installer

During installation:
- **Installation Directory**: Keep default
- **Components**: Keep all checked (PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools)
- **Data Directory**: Keep default
- **Password**: Set a password for the `postgres` user. **Write this down — you will need it!**
- **Port**: Keep `5432` (default)
- **Locale**: Keep default
- Click **Next** through to finish
- When asked to launch Stack Builder: **Uncheck it** and click Finish

---

## 5. Step 4 — Create the HMS Database

After PostgreSQL is installed, you need to create a database named `hms`.

### Option A — Using pgAdmin 4 (Graphical, Easier)

1. Open **pgAdmin 4** from your Start menu
2. On first launch, it will ask for a **Master Password** — set any password you like
3. In the left panel, expand: **Servers** → **PostgreSQL 16**
4. It will ask for the PostgreSQL password you set during installation — enter it
5. Right-click on **Databases**
6. Select **Create** → **Database...**
7. In the "Database" field, type: `hms`
8. Click **Save**

The `hms` database now appears in the list.

### Option B — Using Command Line (Faster)

1. Search for **"SQL Shell (psql)"** in your Start menu and open it
2. Press Enter for all prompts (Server, Database, Port, Username) to use defaults
3. When it asks `Password for user postgres:` — type the password you set during installation
4. You will see `postgres=#` — type this and press Enter:
```sql
CREATE DATABASE hms;
```
5. Type `\q` and press Enter to exit

---

## 6. Step 5 — Configure the Project

1. **Extract** the `hospital-management-system.zip` file to a folder (e.g. `C:\HMS\`)
2. Inside the extracted folder, find the file named `.env`
   - If you don't see it, enable "Show hidden files" in Windows Explorer (View → Hidden Items)
3. Open `.env` with Notepad
4. You will see:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/hms
```
5. Replace `password` with the PostgreSQL password you set during installation

**Example** — if your password is `mypass123`:
```
DATABASE_URL=postgresql://postgres:mypass123@localhost:5432/hms
```
6. Save and close the file

> If the `.env` file does not exist yet, run `run.bat` once — it will create the file automatically, then edit it.

---

## 7. Step 6 — Run the Project

1. Open the extracted project folder in File Explorer
2. Double-click **`run.bat`**
3. A Command Prompt window opens — it will automatically:
   - Install all project dependencies (first run takes 2–5 minutes)
   - Create all database tables
   - Start the API server
   - Start the web application
4. Two new windows will open (one for the API server, one for the frontend)
5. Open your web browser and go to:

```
http://localhost:3000
```

The Hospital Management System dashboard will load.

> **Every time** you want to use the system, just run `run.bat`. Keep both terminal windows open while using it.

---

## 8. How to Use the System

### Accessing the System

Open your browser and go to: **http://localhost:3000**

The system opens directly to the **Dashboard** — no login is required in this version (single-admin setup).

### Dashboard Overview

When you first open the system, you'll see:

| Card | What it shows |
|------|--------------|
| Total Patients | Number of registered patients |
| Total Doctors | Number of registered doctors |
| Today's Appointments | Appointments scheduled for today |
| Total Revenue | Revenue from paid bills |
| Revenue Chart | Monthly revenue bar chart |
| Appointment Trends | Daily appointments line chart |
| Doctor Workload | Appointments per doctor table |
| Recent Activity | Latest actions in the system |

### Navigation

Use the **left sidebar** to navigate between modules:

- **Dashboard** — Overview and analytics
- **Patients** — Manage patient records
- **Doctors** — Manage doctor profiles
- **Appointments** — Book and track appointments
- **Medical Records** — EMR / diagnosis records
- **Billing** — Invoices and payment tracking
- **Pharmacy** — Medicine inventory
- **Lab Reports** — Laboratory test results
- **Reports** — Full analytics with charts

---

## 9. Module Guide

### Patients

**How to add a new patient:**
1. Click **Patients** in the sidebar
2. Click the **"Add Patient"** button (top right)
3. Fill in: Name, Age, Gender, Phone (required), and optional fields
4. Click **Save**

**How to search for a patient:**
- Type in the search bar at the top of the Patients page
- Or filter by Blood Group using the dropdown

**How to view a patient's full record:**
- Click on any patient's name to open their detail page
- Shows all linked appointments, medical records, bills, and lab reports

**How to edit or delete a patient:**
- Click the **edit (pencil)** or **delete (trash)** icon next to the patient

---

### Doctors

**How to add a new doctor:**
1. Click **Doctors** in the sidebar
2. Click **"Add Doctor"**
3. Fill in: Name, Specialization, Phone, Email (required)
4. Add Qualification, Experience (years), and Availability optionally
5. Click **Save**

**How to filter doctors by specialization:**
- Use the Specialization dropdown on the Doctors page

---

### Appointments

**How to book an appointment:**
1. Click **Appointments** in the sidebar
2. Click **"Book Appointment"**
3. Select a Patient from the dropdown
4. Select a Doctor
5. Pick a Date and Time
6. Add any Notes (optional)
7. Click **Save** — status is automatically set to "Scheduled"

**How to update appointment status:**
- Click the edit icon next to any appointment
- Change status to: `scheduled`, `completed`, or `cancelled`

**How to filter appointments:**
- Filter by Status (scheduled / completed / cancelled)
- Filter by Date

---

### Medical Records (EMR)

**How to add a medical record:**
1. Click **Medical Records** in the sidebar
2. Click **"Add Record"**
3. Select the Patient
4. Select the Doctor (optional)
5. Enter Diagnosis, Prescription, Treatment, Notes
6. Click **Save**

**How to find records for a specific patient:**
- Use the Patient filter dropdown on the Medical Records page

---

### Billing

**How to create a bill:**
1. Click **Billing** in the sidebar
2. Click **"Create Bill"**
3. Select the Patient
4. Enter fee amounts: Consultation Fee, Lab Charges, Medicine Charges
5. The Total Amount calculates automatically
6. Add a Description (optional)
7. Click **Save** — status starts as "Pending"

**How to mark a bill as paid:**
1. Find the bill in the list
2. Click the edit icon
3. Change Payment Status to `paid`
4. Set the Payment Date
5. Click **Save**

---

### Pharmacy

**How to add a medicine:**
1. Click **Pharmacy** in the sidebar
2. Click **"Add Medicine"**
3. Enter: Name, Quantity, Price (required)
4. Enter: Expiry Date, Manufacturer, Category (optional)
5. Click **Save**

**Low Stock Warning:**
- Medicines with quantity **10 or below** are automatically flagged with a warning
- Filter to see only low-stock items using the "Low Stock" toggle

**How to update stock:**
- Click the edit icon on any medicine and update the Quantity

---

### Lab Reports

**How to create a lab report:**
1. Click **Lab Reports** in the sidebar
2. Click **"Add Report"**
3. Select the Patient
4. Enter the Test Name and Report Date
5. Status defaults to "Pending" until results are ready
6. Click **Save**

**How to add results to a lab report:**
1. Find the report in the list
2. Click the edit icon
3. Fill in the Result field
4. Change Status to `completed`
5. Click **Save**

---

### Reports & Analytics

The **Reports** page shows:
- Monthly Revenue bar chart
- Appointment Trends line chart (last 30 days)
- Doctor Workload bar chart (appointments per doctor)

No action needed — all charts update automatically based on your data.

---

## 10. Troubleshooting

### "Could not connect to database"
- Make sure PostgreSQL is running:
  - Press `Win + R`, type `services.msc`, press Enter
  - Find **postgresql-x64-16**, right-click → **Start**
- Check your password in the `.env` file is correct

### "Port 3000 already in use"
- Another app is using port 3000
- Close the conflicting app or restart your computer

### "pnpm: command not found"
- Open Command Prompt and run: `npm install -g pnpm`

### Page is blank or not loading
- Make sure both terminal windows from `run.bat` are still open (API server and frontend)
- Wait 10–15 seconds after running `run.bat` before opening the browser

### Changes not saving
- Check the terminal window titled "HMS - API Server" for any red error messages

### First run is very slow
- Normal — the first run downloads and installs all packages (2–5 minutes)
- Subsequent runs start in under 30 seconds

---

## Project Folder Structure

```
hospital-management-system/
├── run.bat                    ← Double-click to start the system
├── .env                       ← Your database connection settings
├── artifacts/
│   ├── api-server/            ← Backend (Express.js API)
│   │   └── src/routes/        ← API endpoints
│   └── hms/                   ← Frontend (React web app)
│       └── src/               ← Pages and components
├── lib/
│   ├── db/src/schema/         ← Database table definitions
│   └── api-spec/openapi.yaml  ← API contract definition
└── pnpm-workspace.yaml        ← Project workspace config
```

---

## Support

If something is not working:
1. Check the **Troubleshooting** section above
2. Look at the error message in the terminal window
3. Make sure PostgreSQL is running and the `.env` password is correct

---

*Hospital Management System — Built with React, Express.js, and PostgreSQL*
