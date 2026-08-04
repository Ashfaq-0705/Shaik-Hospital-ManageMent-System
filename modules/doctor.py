"""
doctor.py
Handles all CRUD operations related to doctors.
"""

from database import get_connection


def add_doctor(name, specialization, contact, consultation_fee=0):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO doctors (name, specialization, contact, consultation_fee)
        VALUES (?, ?, ?, ?)
    """, (name, specialization, contact, consultation_fee))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_all_doctors():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctors ORDER BY doctor_id")
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_doctor_by_id(doctor_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctors WHERE doctor_id = ?", (doctor_id,))
    row = cursor.fetchone()
    conn.close()
    return row


def search_doctors_by_specialization(specialization):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM doctors WHERE specialization LIKE ?",
        (f"%{specialization}%",)
    )
    rows = cursor.fetchall()
    conn.close()
    return rows


def update_doctor(doctor_id, name=None, specialization=None,
                   contact=None, consultation_fee=None):
    existing = get_doctor_by_id(doctor_id)
    if not existing:
        return False

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE doctors
        SET name = ?, specialization = ?, contact = ?, consultation_fee = ?
        WHERE doctor_id = ?
    """, (
        name or existing["name"],
        specialization or existing["specialization"],
        contact or existing["contact"],
        consultation_fee if consultation_fee is not None else existing["consultation_fee"],
        doctor_id
    ))
    conn.commit()
    conn.close()
    return True


def delete_doctor(doctor_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM doctors WHERE doctor_id = ?", (doctor_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0
