import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctorService } from '../services/doctorService'


export default function DoctorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    specialization: '',
    contact: '',
    email: '',
    qualification: '',
    experience: '',
    consultation_fee: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      doctorService.getById(Number(id)).then(res => {
        const d = res.data
        setForm({
          name: d.name,
          specialization: d.specialization,
          contact: d.contact,
          email: d.email || '',
          qualification: d.qualification || '',
          experience: d.experience || '',
          consultation_fee: String(d.consultation_fee),
        })
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = {
        name: form.name,
        specialization: form.specialization,
        contact: form.contact,
        email: form.email || undefined,
        qualification: form.qualification || undefined,
        experience: form.experience || undefined,
        consultation_fee: Number(form.consultation_fee) || 0,
      }
      if (isEdit) {
        await doctorService.update(Number(id), data)
      } else {
        await doctorService.create(data)
      }
      navigate('/doctors')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Doctor' : 'Add Doctor'}</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
            <input type="text" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
            <input type="text" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input type="text" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
            <input type="number" value={form.consultation_fee} onChange={e => setForm({ ...form, consultation_fee: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Doctor'}
          </button>
          <button type="button" onClick={() => navigate('/doctors')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
