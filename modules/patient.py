"""
patient.py
Handles all CRUD operations related to patients.
"""

from database import get_connection


def add_patient(name, age, gender, contact, address, disease):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO patients (name, age, gender, contact, address, disease)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (name, age, gender, contact, address, disease))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_all_patients():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients ORDER BY patient_id")
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_patient_by_id(patient_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,))
    row = cursor.fetchone()
    conn.close()
    return row


def search_patients_by_name(name):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients WHERE name LIKE ?", (f"%{name}%",))
    rows = cursor.fetchall()
    conn.close()
    return rows


def update_patient(patient_id, name=None, age=None, gender=None,
                    contact=None, address=None, disease=None):
    existing = get_patient_by_id(patient_id)
    if not existing:
        return False

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE patients
        SET name = ?, age = ?, gender = ?, contact = ?, address = ?, disease = ?
        WHERE patient_id = ?
    """, (
        name or existing["name"],
        age or existing["age"],
        gender or existing["gender"],
        contact or existing["contact"],
        address or existing["address"],
        disease or existing["disease"],
        patient_id
    ))
    conn.commit()
    conn.close()
    return True


def delete_patient(patient_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM patients WHERE patient_id = ?", (patient_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0
