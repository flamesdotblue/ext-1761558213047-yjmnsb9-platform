import { listUsers, setUserActive } from '../lib/storage'
import { useMemo, useState } from 'react'

export default function AdminPage() {
  const [query, setQuery] = useState('')
  const users = useMemo(() => listUsers(), [])
  const filtered = users.filter((u)=> !query || u.businessName.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))

  function toggle(u) {
    setUserActive(u.id, !u.active)
    window.location.reload()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <input className="input max-w-xs" placeholder="Rechercher..." value={query} onChange={(e)=>setQuery(e.target.value)} />
      </div>
      <div className="mt-6 grid gap-3">
        {filtered.map((u)=> (
          <div key={u.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{u.businessName} {u.active ? '' : '(Désactivée)'} </div>
              <div className="text-sm text-gray-600">{u.email} • /store/{u.storeSlug}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${u.plan==='free'?'bg-gray-100 text-gray-700':'bg-amber-100 text-amber-700'}`}>{u.plan}</span>
              <button onClick={()=>toggle(u)} className={`px-3 py-2 rounded-lg border ${u.active? 'text-red-600 border-red-200 hover:bg-red-50':'text-green-700 border-green-200 hover:bg-green-50'}`}>
                {u.active? 'Désactiver':'Activer'}
              </button>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="text-sm text-gray-600">Aucun compte trouvé.</div>}
      </div>
      <style>{`.input{padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;outline:none}.input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}`}</style>
    </div>
  )
}
