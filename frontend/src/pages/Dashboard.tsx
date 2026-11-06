import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'
import type { DashboardStats } from '../types'
import { Users, Stethoscope, Calendar, DollarSign, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#ef4444']

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [appointmentStats, setAppointmentStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, revenueRes, apptRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getMonthlyRevenue(),
        dashboardService.getAppointmentStats(),
      ])
      setStats(statsRes.data)
      setMonthlyRevenue(revenueRes.data)
      setAppointmentStats(apptRes.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  const statCards = [
    { label: 'Total Patients', value: stats?.total_patients || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Doctors', value: stats?.total_doctors || 0, icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: "Today's Appointments", value: stats?.todays_appointments || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Completed Appointments', value: stats?.completed_appointments || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled Appointments', value: stats?.cancelled_appointments || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Dues', value: `$${(stats?.pending_dues || 0).toFixed(2)}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{card.label}</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">{card.value}</div>
              </div>
              <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No revenue data yet</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment Statistics</h2>
          {appointmentStats.some(s => s.count > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {appointmentStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No appointment data yet</div>
          )}
        </div>
      </div>
    </div>
  )
}