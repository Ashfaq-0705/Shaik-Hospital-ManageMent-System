"""
main.py
FastAPI application entry point for Hospital Management System.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, users, patients, doctors, appointments, billing, dashboard

app = FastAPI(
    title="Hospital Management System API",
    description="Full-stack Hospital Management System with React + FastAPI",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/")
async def root():
    return {"message": "Hospital Management System API", "version": "2.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "sqlite"}