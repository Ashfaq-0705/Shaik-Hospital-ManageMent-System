"""
main.py
Entry point for the Hospital Management System (console application).

Run with:  python main.py
"""

from database import initialize_database
from modules import patient, doctor, appointment, billing


# --------------------------------------------------------------------------
# Helper / display functions
# --------------------------------------------------------------------------

def print_header(title):
    print("\n" + "=" * 55)
    print(title.center(55))
    print("=" * 55)


def pause():
    input("\nPress Enter to continue...")


def get_int(prompt):
    while True:
        value = input(prompt).strip()
        if value.isdigit():
            return int(value)
        print("Please enter a valid whole number.")


def get_float(prompt):
    while True:
        value = input(prompt).strip()
        try:
            return float(value)
        except ValueError:
            print("Please enter a valid number.")


def get_nonempty(prompt):
    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("This field cannot be empty.")


# --------------------------------------------------------------------------
# Patient menu
# --------------------------------------------------------------------------

def patient_menu():
    while True:
        print_header("PATIENT MANAGEMENT")
        print("1. Add Patient")
        print("2. View All Patients")
        print("3. Search Patient by Name")
        print("4. Update Patient")
        print("5. Delete Patient")
        print("6. Back to Main Menu")
        choice = input("Enter choice: ").strip()

        if choice == "1":
            name = get_nonempty("Name: ")
            age = get_int("Age: ")
            gender = get_nonempty("Gender: ")
            contact = get_nonempty("Contact number: ")
            address = input("Address: ").strip()
            disease = input("Disease / Reason for visit: ").strip()
            new_id = patient.add_patient(name, age, gender, contact, address, disease)
            print(f"\nPatient added successfully with ID: {new_id}")

        elif choice == "2":
            rows = patient.get_all_patients()
            display_patients(rows)

        elif choice == "3":
            name = get_nonempty("Enter name to search: ")
            rows = patient.search_patients_by_name(name)
            display_patients(rows)

        elif choice == "4":
            pid = get_int("Enter Patient ID to update: ")
            if not patient.get_patient_by_id(pid):
                print("Patient not found.")
            else:
                print("Leave field blank to keep current value.")
                name = input("New name: ").strip() or None
                age_input = input("New age: ").strip()
                age = int(age_input) if age_input else None
                gender = input("New gender: ").strip() or None
                contact = input("New contact: ").strip() or None
                address = input("New address: ").strip() or None
                disease = input("New disease/reason: ").strip() or None
                patient.update_patient(pid, name, age, gender, contact, address, disease)
                print("Patient updated successfully.")

        elif choice == "5":
            pid = get_int("Enter Patient ID to delete: ")
            if patient.delete_patient(pid):
                print("Patient deleted successfully.")
            else:
                print("Patient not found.")

        elif choice == "6":
            break
        else:
            print("Invalid choice. Try again.")

        pause()


def display_patients(rows):
    if not rows:
        print("\nNo patients found.")
        return
    print(f"\n{'ID':<5}{'Name':<20}{'Age':<5}{'Gender':<10}{'Contact':<15}{'Disease':<20}")
    print("-" * 75)
    for r in rows:
        print(f"{r['patient_id']:<5}{r['name']:<20}{r['age']:<5}{r['gender']:<10}"
              f"{r['contact']:<15}{(r['disease'] or ''):<20}")


# --------------------------------------------------------------------------
# Doctor menu
# --------------------------------------------------------------------------

def doctor_menu():
    while True:
        print_header("DOCTOR MANAGEMENT")
        print("1. Add Doctor")
        print("2. View All Doctors")
        print("3. Search by Specialization")
        print("4. Update Doctor")
        print("5. Delete Doctor")
        print("6. Back to Main Menu")
        choice = input("Enter choice: ").strip()

        if choice == "1":
            name = get_nonempty("Name: ")
            specialization = get_nonempty("Specialization: ")
            contact = get_nonempty("Contact number: ")
            fee = get_float("Consultation fee: ")
            new_id = doctor.add_doctor(name, specialization, contact, fee)
            print(f"\nDoctor added successfully with ID: {new_id}")

        elif choice == "2":
            rows = doctor.get_all_doctors()
            display_doctors(rows)

        elif choice == "3":
            spec = get_nonempty("Enter specialization to search: ")
            rows = doctor.search_doctors_by_specialization(spec)
            display_doctors(rows)

        elif choice == "4":
            did = get_int("Enter Doctor ID to update: ")
            if not doctor.get_doctor_by_id(did):
                print("Doctor not found.")
            else:
                print("Leave field blank to keep current value.")
                name = input("New name: ").strip() or None
                specialization = input("New specialization: ").strip() or None
                contact = input("New contact: ").strip() or None
                fee_input = input("New consultation fee: ").strip()
                fee = float(fee_input) if fee_input else None
                doctor.update_doctor(did, name, specialization, contact, fee)
                print("Doctor updated successfully.")

        elif choice == "5":
            did = get_int("Enter Doctor ID to delete: ")
            if doctor.delete_doctor(did):
                print("Doctor deleted successfully.")
            else:
                print("Doctor not found.")

        elif choice == "6":
            break
        else:
            print("Invalid choice. Try again.")

        pause()


def display_doctors(rows):
    if not rows:
        print("\nNo doctors found.")
        return
    print(f"\n{'ID':<5}{'Name':<20}{'Specialization':<20}{'Contact':<15}{'Fee':<10}")
    print("-" * 70)
    for r in rows:
        print(f"{r['doctor_id']:<5}{r['name']:<20}{r['specialization']:<20}"
              f"{r['contact']:<15}{r['consultation_fee']:<10}")


# --------------------------------------------------------------------------
# Appointment menu
# --------------------------------------------------------------------------

def appointment_menu():
    while True:
        print_header("APPOINTMENT MANAGEMENT")
        print("1. Book Appointment")
        print("2. View All Appointments")
        print("3. View Appointments for a Patient")
        print("4. Cancel Appointment")
        print("5. Mark Appointment Completed")
        print("6. Back to Main Menu")
        choice = input("Enter choice: ").strip()

        if choice == "1":
            pid = get_int("Patient ID: ")
            if not patient.get_patient_by_id(pid):
                print("Patient not found. Please add the patient first.")
                pause()
                continue
            did = get_int("Doctor ID: ")
            if not doctor.get_doctor_by_id(did):
                print("Doctor not found. Please add the doctor first.")
                pause()
                continue
            date = get_nonempty("Appointment date (YYYY-MM-DD): ")
            time = get_nonempty("Appointment time (HH:MM): ")
            new_id = appointment.book_appointment(pid, did, date, time)
            print(f"\nAppointment booked successfully with ID: {new_id}")

        elif choice == "2":
            rows = appointment.get_all_appointments()
            display_appointments(rows)

        elif choice == "3":
            pid = get_int("Patient ID: ")
            rows = appointment.get_appointments_for_patient(pid)
            if not rows:
                print("\nNo appointments found for this patient.")
            else:
                print(f"\n{'ID':<5}{'Doctor':<20}{'Date':<12}{'Time':<8}{'Status':<12}")
                print("-" * 60)
                for r in rows:
                    print(f"{r['appointment_id']:<5}{r['doctor_name']:<20}"
                          f"{r['appointment_date']:<12}{r['appointment_time']:<8}"
                          f"{r['status']:<12}")

        elif choice == "4":
            aid = get_int("Enter Appointment ID to cancel: ")
            if appointment.cancel_appointment(aid):
                print("Appointment cancelled.")
            else:
                print("Appointment not found.")

        elif choice == "5":
            aid = get_int("Enter Appointment ID to mark completed: ")
            if appointment.update_appointment_status(aid, "Completed"):
                print("Appointment marked as completed.")
            else:
                print("Appointment not found.")

        elif choice == "6":
            break
        else:
            print("Invalid choice. Try again.")

        pause()


def display_appointments(rows):
    if not rows:
        print("\nNo appointments found.")
        return
    print(f"\n{'ID':<5}{'Patient':<18}{'Doctor':<18}{'Date':<12}{'Time':<8}{'Status':<12}")
    print("-" * 75)
    for r in rows:
        print(f"{r['appointment_id']:<5}{r['patient_name']:<18}{r['doctor_name']:<18}"
              f"{r['appointment_date']:<12}{r['appointment_time']:<8}{r['status']:<12}")


# --------------------------------------------------------------------------
# Billing menu
# --------------------------------------------------------------------------

def billing_menu():
    while True:
        print_header("BILLING MANAGEMENT")
        print("1. Create Bill")
        print("2. View All Bills")
        print("3. View Bills for a Patient")
        print("4. Mark Bill as Paid")
        print("5. View Revenue Summary")
        print("6. Back to Main Menu")
        choice = input("Enter choice: ").strip()

        if choice == "1":
            pid = get_int("Patient ID: ")
            if not patient.get_patient_by_id(pid):
                print("Patient not found. Please add the patient first.")
                pause()
                continue
            description = get_nonempty("Description (e.g. Consultation, Lab test): ")
            amount = get_float("Amount: ")
            new_id = billing.create_bill(pid, description, amount)
            print(f"\nBill created successfully with ID: {new_id}")

        elif choice == "2":
            rows = billing.get_all_bills()
            display_bills(rows)

        elif choice == "3":
            pid = get_int("Patient ID: ")
            rows = billing.get_bills_for_patient(pid)
            if not rows:
                print("\nNo bills found for this patient.")
            else:
                print(f"\n{'ID':<5}{'Description':<20}{'Amount':<10}{'Date':<12}{'Status':<10}")
                print("-" * 60)
                for r in rows:
                    print(f"{r['bill_id']:<5}{r['description']:<20}{r['amount']:<10}"
                          f"{r['bill_date']:<12}{r['paid_status']:<10}")

        elif choice == "4":
            bid = get_int("Enter Bill ID to mark as paid: ")
            if billing.mark_bill_paid(bid):
                print("Bill marked as paid.")
            else:
                print("Bill not found.")

        elif choice == "5":
            total = billing.get_total_revenue()
            pending = billing.get_pending_dues()
            print(f"\nTotal Revenue Collected: {total:.2f}")
            print(f"Total Pending Dues:      {pending:.2f}")

        elif choice == "6":
            break
        else:
            print("Invalid choice. Try again.")

        pause()


def display_bills(rows):
    if not rows:
        print("\nNo bills found.")
        return
    print(f"\n{'ID':<5}{'Patient':<18}{'Description':<20}{'Amount':<10}{'Date':<12}{'Status':<10}")
    print("-" * 80)
    for r in rows:
        print(f"{r['bill_id']:<5}{r['patient_name']:<18}{r['description']:<20}"
              f"{r['amount']:<10}{r['bill_date']:<12}{r['paid_status']:<10}")


# --------------------------------------------------------------------------
# Main menu
# --------------------------------------------------------------------------

def main_menu():
    initialize_database()
    while True:
        print_header("HOSPITAL MANAGEMENT SYSTEM")
        print("1. Patient Management")
        print("2. Doctor Management")
        print("3. Appointment Management")
        print("4. Billing Management")
        print("5. Exit")
        choice = input("Enter choice: ").strip()

        if choice == "1":
            patient_menu()
        elif choice == "2":
            doctor_menu()
        elif choice == "3":
            appointment_menu()
        elif choice == "4":
            billing_menu()
        elif choice == "5":
            print("\nThank you for using the Hospital Management System. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")
            pause()


if __name__ == "__main__":
    main_menu()
