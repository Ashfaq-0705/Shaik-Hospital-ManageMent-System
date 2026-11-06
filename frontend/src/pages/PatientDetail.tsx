import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { patientService } from '../services/patientService'
import type { Patient } from '../types'
import { ArrowLeft } from 'lucide-react'

export default function PatientDetail() {
  const { id } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientService.getById(Number(id)).then(res => {
      setPatient(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (!patient) return <div className="text-center py-12 text-gray-500">Patient not found</div>

  return (
    <div>
      <Link to="/patients" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={20} /> Back to Patients
      </Link>
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{patient.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-gray-500">ID:</span> {patient.patient_id}</div>
          <div><span className="text-gray-500">Age:</span> {patient.age}</div>
          <div><span className="text-gray-500">Gender:</span> {patient.gender}</div>
          <div><span className="text-gray-500">Contact:</span> {patient.contact}</div>
          <div><span className="text-gray-500">Email:</span> {patient.email || '-'}</div>
          <div><span className="text-gray-500">Admission Date:</span> {patient.admission_date || '-'}</div>
          <div className="col-span-2"><span className="text-gray-500">Address:</span> {patient.address || '-'}</div>
          <div className="col-span-2"><span className="text-gray-500">Disease:</span> {patient.disease || '-'}</div>
        </div>
      </div>
    </div>
  )
}
