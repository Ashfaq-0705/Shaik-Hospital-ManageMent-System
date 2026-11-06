import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { patientService } from '../services/patientService'


export default function PatientForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    email: '',
    address: '',
    disease: '',
    admission_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      patientService.getById(Number(id)).then(res => {
        const p = res.data
        setForm({
          name: p.name,
          age: String(p.age),
          gender: p.gender,
          contact: p.contact,
          email: p.email || '',
          address: p.address || '',
          disease: p.disease || '',
          admission_date: p.admission_date || '',
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
        age: Number(form.age),
        gender: form.gender,
        contact: form.contact,
        email: form.email || undefined,
        address: form.address || undefined,
        disease: form.disease || undefined,
        admission_date: form.admission_date || undefined,
      }
      if (isEdit) {
        await patientService.update(Number(id), data)
      } else {
        await patientService.create(data)
      }
      navigate('/patients')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save patient')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Patient' : 'Add Patient'}
      </h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
            <input
              type="number"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact *</label>
            <input
              type="text"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
            <input
              type="date"
              value={form.admission_date}
              onChange={e => setForm({ ...form, admission_date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disease / Reason for Visit</label>
          <input
            type="text"
            value={form.disease}
            onChange={e => setForm({ ...form, disease: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
