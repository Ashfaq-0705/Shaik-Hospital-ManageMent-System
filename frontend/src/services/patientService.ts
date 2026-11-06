import api from './api'
import type { Patient } from '../types'

export const patientService = {
  getAll: () => api.get<Patient[]>('/patients/'),
  getById: (id: number) => api.get<Patient>(`/patients/${id}`),
  create: (data: Omit<Patient, 'patient_id'>) => api.post<Patient>('/patients/', data),
  update: (id: number, data: Partial<Patient>) => api.put<Patient>(`/patients/${id}`, data),
  delete: (id: number) => api.delete(`/patients/${id}`),
}
