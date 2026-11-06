import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { billingService } from '../services/billingService'
import { patientService } from '../services/patientService'
import type { Patient } from '../types'

export default function BillForm() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const [form, setForm] = useState({
    patient_id: '',
    description: '',
    amount: '',
    paid_status: 'Unpaid',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    patientService.getAll().then(res => setPatients(res.data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await billingService.create({
        patient_id: Number(form.patient_id),
        description: form.description,
        amount: Number(form.amount),
        paid_status: form.paid_status,
      })
      navigate('/billing')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create bill')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Bill</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. Consultation, Lab test" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.paid_status} onChange={e => setForm({ ...form, paid_status: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Bill'}
          </button>
          <button type="button" onClick={() => navigate('/billing')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}