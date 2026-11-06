"""
migrate.py
Database migration script to expand schema while preserving existing data.
Creates new tables: users, medical_records, payments
Adds new columns to existing tables.
"""

import os
import shutil
import sqlite3
from datetime import datetime

# Paths
# backend/app/migrations/migrate.py -> go up 3 levels to project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DB_PATH = os.path.join(BASE_DIR, "hospital.db")
BACKUP_PATH = os.path.join(BASE_DIR, f"hospital.db.bak.{datetime.now().strftime('%Y%m%d%H%M%S')}")


def backup_database():
    """Create backup of existing database before migration."""
    if os.path.exists(DB_PATH):
        shutil.copy2(DB_PATH, BACKUP_PATH)
        print(f"Backup created: {BACKUP_PATH}")


def get_connection():
    """Get SQLite connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def get_existing_tables(conn):
    """Get list of existing tables."""
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    return [row[0] for row in cursor.fetchall()]


def column_exists(conn, table, column):
    """Check if a column exists in a table."""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table})")
    return any(row[1] == column for row in cursor.fetchall())


def migrate():
    """Run all migrations."""
    backup_database()
    conn = get_connection()
    cursor = conn.cursor()
    
    existing_tables = get_existing_tables(conn)
    print(f"Existing tables: {existing_tables}")
    
    # Add email column to patients if not exists
    if not column_exists(conn, "patients", "email"):
        cursor.execute("ALTER TABLE patients ADD COLUMN email TEXT")
        print("Added email column to patients")
    
    # Add email, qualification, experience columns to doctors if not exists
    if not column_exists(conn, "doctors", "email"):
        cursor.execute("ALTER TABLE doctors ADD COLUMN email TEXT")
        print("Added email column to doctors")
    
    if not column_exists(conn, "doctors", "qualification"):
        cursor.execute("ALTER TABLE doctors ADD COLUMN qualification TEXT")
        print("Added qualification column to doctors")
    
    if not column_exists(conn, "doctors", "experience"):
        cursor.execute("ALTER TABLE doctors ADD COLUMN experience TEXT")
        print("Added experience column to doctors")
    
    # Create users table if not exists
    if "users" not in existing_tables:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                role TEXT DEFAULT 'Receptionist'
            )
        """)
        print("Created users table")
    
    # Create medical_records table if not exists
    if "medical_records" not in existing_tables:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS medical_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                diagnosis TEXT,
                notes TEXT,
                created_at TEXT,
                FOREIGN KEY (patient_id) REFERENCES patients (patient_id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE
            )
        """)
        print("Created medical_records table")
    
    # Create payments table if not exists
    if "payments" not in existing_tables:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bill_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                payment_date TEXT,
                payment_method TEXT,
                FOREIGN KEY (bill_id) REFERENCES bills (bill_id) ON DELETE CASCADE
            )
        """)
        print("Created payments table")
    
    conn.commit()
    conn.close()
    print("Migration completed successfully!")


if __name__ == "__main__":
    migrate()