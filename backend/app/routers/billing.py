"""
routers/billing.py
Billing API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core import security
from app.models.bill import Bill
from app.models.patient import Patient
from app.models.user import User
from app.schemas.bill import BillCreate, BillResponse, BillUpdate
from sqlalchemy import func

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


@router.get("/", response_model=list[BillResponse])
def list_bills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bills = db.query(Bill).all()
    return bills


@router.get("/{bill_id}", response_model=BillResponse)
def get_bill(
    bill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bill = db.query(Bill).filter(Bill.bill_id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    return bill


@router.post("/", response_model=BillResponse, status_code=status.HTTP_201_CREATED)
def create_bill(
    bill_data: BillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).filter(Patient.patient_id == bill_data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    bill = Bill(**bill_data.model_dump())
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill


@router.put("/{bill_id}", response_model=BillResponse)
def update_bill(
    bill_id: int,
    bill_data: BillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bill = db.query(Bill).filter(Bill.bill_id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    
    for field, value in bill_data.model_dump(exclude_unset=True).items():
        setattr(bill, field, value)
    
    db.commit()
    db.refresh(bill)
    return bill


@router.delete("/{bill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bill(
    bill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bill = db.query(Bill).filter(Bill.bill_id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bill not found")
    db.delete(bill)
    db.commit()
    return {"detail": "Bill deleted"}


@router.get("/revenue/summary")
def revenue_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_revenue = db.query(func.sum(Bill.amount)).filter(Bill.paid_status == "Paid").scalar() or 0
    pending_dues = db.query(func.sum(Bill.amount)).filter(Bill.paid_status == "Unpaid").scalar() or 0
    partially_paid = db.query(func.sum(Bill.amount)).filter(Bill.paid_status == "Partially Paid").scalar() or 0
    total_bills = db.query(func.count(Bill.bill_id)).scalar() or 0
    
    return {
        "total_revenue": float(total_revenue),
        "pending_dues": float(pending_dues),
        "partially_paid": float(partially_paid),
        "total_bills": int(total_bills),
    }