"""
routers/dashboard.py
Dashboard analytics API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core import security
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.bill import Bill
from app.models.user import User
from sqlalchemy import func
from datetime import date

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = security.decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.get("/stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_patients = db.query(func.count(Patient.patient_id)).scalar() or 0
    total_doctors = db.query(func.count(Doctor.doctor_id)).scalar() or 0
    today = date.today().isoformat()
    
    todays_appointments = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.appointment_date == today
    ).scalar() or 0
    
    completed_appointments = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.status == "Completed"
    ).scalar() or 0
    
    cancelled_appointments = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.status == "Cancelled"
    ).scalar() or 0
    
    total_revenue = db.query(func.sum(Bill.amount)).filter(Bill.paid_status == "Paid").scalar() or 0
    pending_dues = db.query(func.sum(Bill.amount)).filter(Bill.paid_status == "Unpaid").scalar() or 0
    
    return {
        "total_patients": int(total_patients),
        "total_doctors": int(total_doctors),
        "todays_appointments": int(todays_appointments),
        "completed_appointments": int(completed_appointments),
        "cancelled_appointments": int(cancelled_appointments),
        "total_revenue": float(total_revenue),
        "pending_dues": float(pending_dues),
    }


@router.get("/recent-patients")
def get_recent_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 5,
):
    patients = db.query(Patient).order_by(Patient.patient_id.desc()).limit(limit).all()
    return patients


@router.get("/upcoming-appointments")
def get_upcoming_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 5,
):
    today = date.today().isoformat()
    appointments = db.query(Appointment).filter(
        Appointment.appointment_date >= today,
        Appointment.status == "Scheduled"
    ).order_by(Appointment.appointment_date, Appointment.appointment_time).limit(limit).all()
    return appointments


@router.get("/monthly-revenue")
def get_monthly_revenue(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bills = db.query(Bill).filter(Bill.paid_status == "Paid").all()
    monthly_data = {}
    for bill in bills:
        month = bill.bill_date[:7] if bill.bill_date else "unknown"
        if month not in monthly_data:
            monthly_data[month] = 0
        monthly_data[month] += float(bill.amount)
    
    return [{"month": k, "revenue": v} for k, v in sorted(monthly_data.items())]


@router.get("/appointment-stats")
def get_appointment_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    scheduled = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.status == "Scheduled"
    ).scalar() or 0
    completed = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.status == "Completed"
    ).scalar() or 0
    cancelled = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.status == "Cancelled"
    ).scalar() or 0
    
    return [
        {"status": "Scheduled", "count": int(scheduled)},
        {"status": "Completed", "count": int(completed)},
        {"status": "Cancelled", "count": int(cancelled)},
    ]