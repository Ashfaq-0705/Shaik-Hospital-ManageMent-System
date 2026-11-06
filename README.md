# Shaik Hospital Management System

A full-stack Hospital Management System with a React frontend and FastAPI backend, built on SQLite.

## Tech Stack

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy ORM
- SQLite
- JWT Authentication (PyJWT)
- bcrypt password hashing
- Pydantic validation

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Recharts
- Lucide React

## Project Structure

```
hospital_management_system/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── database.py          # SQLAlchemy config
│   │   ├── models/              # ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # Business logic
│   │   ├── core/                # Config & security
│   │   └── migrations/          # DB migration scripts
│   ├── startup.py               # Server startup script
│   ├── requirements.txt         # Python dependencies
│   └── .env.example            # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── layouts/             # Layout components
│   │   ├── services/            # API services
│   │   ├── context/             # React context
│   │   └── types/               # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── hospital.db                   # SQLite database
├── hospital.db.bak.*            # Database backup
├── main.py                      # Original console app
├── modules/                     # Original modules
├── database.py                  # Original DB module
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the backend server:
   ```bash
   python startup.py
   ```

The backend will run on `http://localhost:8000`
- Swagger API docs: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- Role: Admin

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

### Database

The SQLite database (`hospital.db`) is located in the project root. It contains:
- `patients` - Patient records
- `doctors` - Doctor records
- `appointments` - Appointment scheduling
- `bills` - Billing records
- `users` - User accounts
- `medical_records` - Patient medical history
- `payments` - Payment records

A backup is created automatically during migration: `hospital.db.bak.*`

## API Endpoints

| Group | Endpoint | Description |
|-------|----------|-------------|
| Auth | `/api/auth/login` | User login |
| Auth | `/api/auth/register` | User registration |
| Auth | `/api/auth/me` | Current user info |
| Patients | `/api/patients/` | Patient CRUD |
| Doctors | `/api/doctors/` | Doctor CRUD |
| Appointments | `/api/appointments/` | Appointment CRUD |
| Billing | `/api/billing/` | Billing CRUD |
| Billing | `/api/billing/revenue/summary` | Revenue summary |
| Dashboard | `/api/dashboard/stats` | Dashboard statistics |
| Dashboard | `/api/dashboard/monthly-revenue` | Monthly revenue chart data |
| Dashboard | `/api/dashboard/appointment-stats` | Appointment statistics |
| Users | `/api/users/` | User management (Admin only) |

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full system access, user management |
| Doctor | View appointments, patient info |
| Receptionist | Register patients, schedule appointments, manage billing |

## Features

- **Patient Management** - Add, view, search, update, delete patients
- **Doctor Management** - Register, view, search, filter by specialization
- **Appointment Scheduling** - Book appointments with conflict prevention
- **Billing** - Generate bills, track payments, revenue analytics
- **Dashboard** - Real-time statistics and charts
- **Authentication** - JWT-based with role-based access control
- **Responsive Design** - Works on desktop, tablet, and mobile

## Development Phases Completed

1. ✅ Repository analysis and backup
2. ✅ Backend restructuring and database integration
3. ✅ API development
4. ✅ Frontend setup and dashboard design
5. ✅ Patient management
6. ✅ Doctor management
7. ✅ Appointment management
8. ✅ Billing management
9. ✅ Authentication and role-based access
10. ✅ Analytics and additional features
11. ✅ Integration testing
12. ✅ Documentation and deployment preparation

## Console Application (Original)

The original console-based application is still available:

```bash
python main.py
```

## License

This project is for educational and demonstration purposes.