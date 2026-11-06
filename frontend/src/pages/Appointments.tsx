import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appointmentService } from '../services/appointmentService'
import { patientService } from '../services/patientService'
import { doctorService } from '../services/doctorService'
import type { Appointment, Patient, Doctor } from '../types'
import { Plus, CheckCircle, XCircle, Trash2 } from 'lucide-react'

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [apptRes, patRes, docRes] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
      ])
      setAppointments(apptRes.data)
      setPatients(patRes.data)
      setDoctors(docRes.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const getPatientName = (id: number) => patients.find(p => p.patient_id === id)?.name || `Patient ${id}`
  const getDoctorName = (id: number) => doctors.find(d => d.doctor_id === id)?.name || `Doctor ${id}`

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await appointmentService.update(id, { status })
      loadData()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return
    try { await appointmentService.delete(id); loadData() }
    catch (err) { console.error(err) }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Link to="/appointments/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} /> Book Appointment
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map(a => (
              <tr key={a.appointment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{a.appointment_id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getPatientName(a.patient_id)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{getDoctorName(a.doctor_id)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{a.appointment_date}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{a.appointment_time}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    a.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    a.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {a.status === 'Scheduled' && (
                      <>
                        <button onClick={() => handleStatusUpdate(a.appointment_id, 'Completed')} className="text-green-600 hover:text-green-800" title="Mark Completed">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => handleStatusUpdate(a.appointment_id, 'Cancelled')} className="text-red-600 hover:text-red-800" title="Cancel">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(a.appointment_id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">No appointments found</div>
        )}
      </div>
    </div>
  )
}
