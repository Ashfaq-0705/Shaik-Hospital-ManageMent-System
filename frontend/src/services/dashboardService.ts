import api from './api'
import type { DashboardStats } from '../types'

export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
  getRecentPatients: () => api.get('/dashboard/recent-patients'),
  getUpcomingAppointments: () => api.get('/dashboard/upcoming-appointments'),
  getMonthlyRevenue: () => api.get('/dashboard/monthly-revenue'),
  getAppointmentStats: () => api.get('/dashboard/appointment-stats'),
}