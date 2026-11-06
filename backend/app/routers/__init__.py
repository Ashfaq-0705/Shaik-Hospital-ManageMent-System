"""
routers/__init__.py
Routers package export.
"""

from app.routers import auth, users, patients, doctors, appointments, billing, dashboard

__all__ = ["auth", "users", "patients", "doctors", "appointments", "billing", "dashboard"]