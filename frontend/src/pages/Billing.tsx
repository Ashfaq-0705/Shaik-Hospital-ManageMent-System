import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { billingService } from '../services/billingService'
import { patientService } from '../services/patientService'
import type { Bill, Patient } from '../types'
import { Plus, CheckCircle, Trash2 } from 'lucide-react'

export default function Billing() {
  const [bills, setBills] = useState<Bill[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [billsRes, patientsRes, summaryRes] = await Promise.all([
        billingService.getAll(),
        patientService.getAll(),
        billingService.getRevenueSummary(),
      ])
      setBills(billsRes.data)
      setPatients(patientsRes.data)
      setSummary(summaryRes.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const getPatientName = (id: number) => patients.find(p => p.patient_id === id)?.name || `Patient ${id}`

  const handleMarkPaid = async (id: number) => {
    try {
      await billingService.update(id, { paid_status: 'Paid' })
      loadData()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bill?')) return
    try { await billingService.delete(id); loadData() }
    catch (err) { console.error(err) }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
        <Link to="/billing/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} /> Create Bill
        </Link>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">${summary.total_revenue?.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Pending Dues</div>
            <div className="text-2xl font-bold text-red-600">${summary.pending_dues?.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Partially Paid</div>
            <div className="text-2xl font-bold text-yellow-600">${summary.partially_paid?.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">Total Bills</div>
            <div className="text-2xl font-bold text-blue-600">{summary.total_bills}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bills.map(b => (
              <tr key={b.bill_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{b.bill_id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{getPatientName(b.patient_id)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{b.description || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${b.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{b.bill_date}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    b.paid_status === 'Paid' ? 'bg-green-100 text-green-700' :
                    b.paid_status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {b.paid_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {b.paid_status !== 'Paid' && (
                      <button onClick={() => handleMarkPaid(b.bill_id)} className="text-green-600 hover:text-green-800" title="Mark Paid">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(b.bill_id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bills.length === 0 && (
          <div className="text-center py-12 text-gray-500">No bills found</div>
        )}
      </div>
    </div>
  )
}
