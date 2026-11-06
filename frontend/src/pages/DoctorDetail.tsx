import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doctorService } from '../services/doctorService'
import type { Doctor } from '../types'
import { ArrowLeft } from 'lucide-react'

export default function DoctorDetail() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    doctorService.getById(Number(id)).then(res => {
      setDoctor(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (!doctor) return <div className="text-center py-12 text-gray-500">Doctor not found</div>

  return (
    <div>
      <Link to="/doctors" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={20} /> Back to Doctors
      </Link>
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{doctor.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div><span className="text-gray-500">ID:</span> {doctor.doctor_id}</div>
          <div><span className="text-gray-500">Specialization:</span> {doctor.specialization}</div>
          <div><span className="text-gray-500">Contact:</span> {doctor.contact}</div>
          <div><span className="text-gray-500">Email:</span> {doctor.email || '-'}</div>
          <div><span className="text-gray-500">Qualification:</span> {doctor.qualification || '-'}</div>
          <div><span className="text-gray-500">Experience:</span> {doctor.experience || '-'}</div>
          <div><span className="text-gray-500">Consultation Fee:</span> ${doctor.consultation_fee}</div>
        </div>
      </div>
    </div>
  )
}