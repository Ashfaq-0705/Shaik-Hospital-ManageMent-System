import api from './api'
import type { Doctor } from '../types'

export const doctorService = {
  getAll: () => api.get<Doctor[]>('/doctors/'),
  getById: (id: number) => api.get<Doctor>(`/doctors/${id}`),
  create: (data: Omit<Doctor, 'doctor_id'>) => api.post<Doctor>('/doctors/', data),
  update: (id: number, data: Partial<Doctor>) => api.put<Doctor>(`/doctors/${id}`, data),
  delete: (id: number) => api.delete(`/doctors/${id}`),
}