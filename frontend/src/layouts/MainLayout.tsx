import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, Stethoscope, Calendar, Receipt, LogOut } from 'lucide-react'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/billing', label: 'Billing', icon: Receipt },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Hospital MS</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{user?.username}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-800">Hospital Management System</h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}