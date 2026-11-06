export interface Patient {
  patient_id: number
  name: string
  age: number
  gender: string
  contact: string
  email?: string
  address?: string
  disease?: string
  admission_date?: string
}

export interface Doctor {
  doctor_id: number
  name: string
  specialization: string
  contact: string
  email?: string
  qualification?: string
  experience?: string
  consultation_fee: number
}

export interface Appointment {
  appointment_id: number
  patient_id: number
  doctor_id: number
  appointment_date: string
  appointment_time: string
  status: string
}

export interface Bill {
  bill_id: number
  patient_id: number
  description?: string
  amount: number
  bill_date?: string
  paid_status: string
}

export interface User {
  id: number
  username: string
  email: string
  role: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface DashboardStats {
  total_patients: number
  total_doctors: number
  todays_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  total_revenue: number
  pending_dues: number
}