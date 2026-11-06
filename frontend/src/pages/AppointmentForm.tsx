import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import { doctorService } from '../services/doctorService'
import type { Patient, Doctor } from '../types'

export default function AppointmentForm() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([patientService.getAll(), doctorService.getAll()]).then(([pRes, dRes]) => {
      setPatients(pRes.data)
      setDoctors(dRes.data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await appointmentService.create({
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        status: 'Scheduled',
      })
      navigate('/appointments')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
          <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
            <option value="">Select Patient</option>
            {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name} (ID: {p.patient_id})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
          <select value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.name} - {d.specialization}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" value={form.appointment_date} onChange={e => setForm({ ...form, appointment_date: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <input type="time" value={form.appointment_time} onChange={e => setForm({ ...form, appointment_time: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
          <button type="button" onClick={() => navigate('/appointments')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}