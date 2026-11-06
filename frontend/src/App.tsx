import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientForm from './pages/PatientForm'
import PatientDetail from './pages/PatientDetail'
import Doctors from './pages/Doctors'
import DoctorForm from './pages/DoctorForm'
import DoctorDetail from './pages/DoctorDetail'
import Billing from './pages/Billing'
import BillForm from './pages/BillForm'
import Appointments from './pages/Appointments'
import AppointmentForm from './pages/AppointmentForm'
import './index.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/new" element={<PatientForm />} />
            <Route path="patients/:id" element={<PatientDetail />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/new" element={<DoctorForm />} />
            <Route path="doctors/:id" element={<DoctorDetail />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/new" element={<AppointmentForm />} />
            <Route path="billing" element={<Billing />} />
            <Route path="billing/new" element={<BillForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
