"""
billing.py
Handles generation and management of patient bills.
"""

from database import get_connection


def create_bill(patient_id, description, amount):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO bills (patient_id, description, amount)
        VALUES (?, ?, ?)
    """, (patient_id, description, amount))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_all_bills():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT b.bill_id, p.name AS patient_name, b.description,
               b.amount, b.bill_date, b.paid_status
        FROM bills b
        JOIN patients p ON b.patient_id = p.patient_id
        ORDER BY b.bill_date DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_bills_for_patient(patient_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT bill_id, description, amount, bill_date, paid_status
        FROM bills WHERE patient_id = ?
        ORDER BY bill_date DESC
    """, (patient_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def mark_bill_paid(bill_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE bills SET paid_status = 'Paid' WHERE bill_id = ?", (bill_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


def get_total_revenue():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(amount) AS total FROM bills WHERE paid_status = 'Paid'")
    result = cursor.fetchone()
    conn.close()
    return result["total"] or 0


def get_pending_dues():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(amount) AS total FROM bills WHERE paid_status = 'Unpaid'")
    result = cursor.fetchone()
    conn.close()
    return result["total"] or 0
