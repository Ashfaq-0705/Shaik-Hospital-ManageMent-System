import api from './api'
import type { Bill } from '../types'

export const billingService = {
  getAll: () => api.get<Bill[]>('/billing/'),
  getById: (id: number) => api.get<Bill>(`/billing/${id}`),
  create: (data: Omit<Bill, 'bill_id' | 'bill_date'>) => api.post<Bill>('/billing/', data),
  update: (id: number, data: Partial<Bill>) => api.put<Bill>(`/billing/${id}`, data),
  delete: (id: number) => api.delete(`/billing/${id}`),
  getRevenueSummary: () => api.get('/billing/revenue/summary'),
}