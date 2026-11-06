import api from './api'
import type { Appointment } from '../types'

export const appointmentService = {
  getAll: () => api.get<Appointment[]>('/appointments/'),
  getById: (id: number) => api.get<Appointment>(`/appointments/${id}`),
  create: (data: Omit<Appointment, 'appointment_id'>) => api.post<Appointment>('/appointments/', data),
  update: (id: number, data: Partial<Appointment>) => api.put<Appointment>(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
}