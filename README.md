# Hospital Management System

A console-based Hospital Management System built with **Python** and **SQLite**.
It manages patients, doctors, appointments, and billing through a clean,
menu-driven interface — a great demonstration of CRUD operations, relational
database design, and modular Python programming.

## Features

- **Patient Management** — add, view, search, update, and delete patient records
- **Doctor Management** — add, view, search by specialization, update, and delete doctors
- **Appointment Scheduling** — book appointments linking patients and doctors, track status (Scheduled / Completed / Cancelled)
- **Billing** — generate bills, track paid/unpaid status, view revenue and pending dues summary
- **Persistent storage** using SQLite (no external database server required)
- **Referential integrity** via foreign keys (e.g. deleting a patient cascades to their appointments and bills)

## Project Structure

```
hospital_management_system/
│
├── main.py                # Entry point — console menu interface
├── database.py             # Database connection & table initialization
├── modules/
│   ├── __init__.py
│   ├── patient.py          # Patient CRUD operations
│   ├── doctor.py            # Doctor CRUD operations
│   ├── appointment.py      # Appointment scheduling logic
│   └── billing.py          # Billing & revenue logic
├── requirements.txt
└── README.md
```

## Tech Stack

- **Language:** Python 3
- **Database:** SQLite3 (built into Python's standard library)
- **No external dependencies required**

## How to Run

1. Make sure Python 3.8+ is installed.
2. Navigate to the project folder:
   ```bash
   cd hospital_management_system
   ```
3. Run the application:
   ```bash
   python main.py
   ```
4. The database (`hospital.db`) will be created automatically on first run.
5. Follow the on-screen menu to manage patients, doctors, appointments, and bills.

## Database Schema

**patients**
| Column | Type |
|---|---|
| patient_id | INTEGER (PK) |
| name | TEXT |
| age | INTEGER |
| gender | TEXT |
| contact | TEXT |
| address | TEXT |
| disease | TEXT |
| admission_date | TEXT |

**doctors**
| Column | Type |
|---|---|
| doctor_id | INTEGER (PK) |
| name | TEXT |
| specialization | TEXT |
| contact | TEXT |
| consultation_fee | REAL |

**appointments**
| Column | Type |
|---|---|
| appointment_id | INTEGER (PK) |
| patient_id | INTEGER (FK -> patients) |
| doctor_id | INTEGER (FK -> doctors) |
| appointment_date | TEXT |
| appointment_time | TEXT |
| status | TEXT |

**bills**
| Column | Type |
|---|---|
| bill_id | INTEGER (PK) |
| patient_id | INTEGER (FK -> patients) |
| description | TEXT |
| amount | REAL |
| bill_date | TEXT |
| paid_status | TEXT |

## Possible Extensions (great talking points for interviews)

- Add a Tkinter or PyQt GUI on top of the existing modules
- Convert to a Flask/Django web app with the same database layer
- Add user authentication and role-based access (admin, doctor, receptionist)
- Export reports (patient list, revenue) to PDF or Excel
- Add unit tests with `pytest` for each module

## Resume Bullet Point Suggestions

- Designed and developed a modular Hospital Management System in Python using SQLite, implementing full CRUD functionality across four interconnected entities (patients, doctors, appointments, billing).
- Structured the application using separation of concerns (database layer, business logic modules, CLI presentation layer), enabling easy extension to a GUI or web framework.
- Implemented relational data integrity using foreign keys and cascading deletes to maintain consistency across appointment and billing records.
