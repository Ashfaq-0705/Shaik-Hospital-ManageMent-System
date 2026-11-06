import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doctorService } from '../services/doctorService'
import type { Doctor } from '../types'
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadDoctors() }, [])

  const loadDoctors = async () => {
    setLoading(true)
    try {
      const res = await doctorService.getAll()
      setDoctors(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    try { await doctorService.delete(id); loadDoctors() }
    catch (err) { console.error(err) }
  }

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase()) ||
    String(d.doctor_id).includes(search)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
        <Link to="/doctors/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} /> Add Doctor
        </Link>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, specialization, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No doctors found</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(d => (
                <tr key={d.doctor_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{d.doctor_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.specialization}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{d.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${d.consultation_fee}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Link to={`/doctors/${d.doctor_id}`} className="text-blue-600 hover:text-blue-800"><Eye size={18} /></Link>
                      <Link to={`/doctors/${d.doctor_id}/edit`} className="text-green-600 hover:text-green-800"><Pencil size={18} /></Link>
                      <button onClick={() => handleDelete(d.doctor_id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}