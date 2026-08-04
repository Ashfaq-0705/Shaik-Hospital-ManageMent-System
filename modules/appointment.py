"""
appointment.py
Handles scheduling and management of patient-doctor appointments.
"""

from database import get_connection


def book_appointment(patient_id, doctor_id, appointment_date, appointment_time):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time)
        VALUES (?, ?, ?, ?)
    """, (patient_id, doctor_id, appointment_date, appointment_time))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def get_all_appointments():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT a.appointment_id, p.name AS patient_name, d.name AS doctor_name,
               a.appointment_date, a.appointment_time, a.status
        FROM appointments a
        JOIN patients p ON a.patient_id = p.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        ORDER BY a.appointment_date, a.appointment_time
    """)
    rows = cursor.fetchall()
    conn.close()
    return rows


def get_appointments_for_patient(patient_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT a.appointment_id, d.name AS doctor_name, a.appointment_date,
               a.appointment_time, a.status
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.doctor_id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date
    """, (patient_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows


def update_appointment_status(appointment_id, status):
    """status should be one of: Scheduled, Completed, Cancelled"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE appointments SET status = ? WHERE appointment_id = ?
    """, (status, appointment_id))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


def cancel_appointment(appointment_id):
    return update_appointment_status(appointment_id, "Cancelled")


def delete_appointment(appointment_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM appointments WHERE appointment_id = ?", (appointment_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0
