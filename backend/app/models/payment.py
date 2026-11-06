"""
models/payment.py
Payment SQLAlchemy ORM model.
"""

from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    bill_id = Column(Integer, ForeignKey("bills.bill_id", ondelete="CASCADE"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(String, nullable=True)
    payment_method = Column(String, nullable=True)