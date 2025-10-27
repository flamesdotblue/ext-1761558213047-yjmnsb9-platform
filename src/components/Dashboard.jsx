import { useMemo, useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addProduct, deleteProduct, getProductsByOwner } from '../lib/storage'
import ProductForm from './ProductForm'
import { Pencil, Trash2, Plus, ExternalLink, Store, Settings, CreditCard } from 'lucide-react'

export default function Dashboard() {
  const { user, updateProfile } = useAuth()
  const [tab, setTab] = useState('products')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()

  const products = useMemo(() => getProductsByOwner(user.id), [user.id])
  const filtered = products.filter(
    (p) => (!query || p.name.toLowerCase().includes(query.toLowerCase())) && (!category || p.category === category)
  )

  const productLimit = user.plan === 'free' ? 10 : 9999

  function handleAdd(product) {
    if (products.length >= productLimit) return alert('Limite atteinte pour le plan gratuit (10 produits).')
    addProduct({ ownerId: user.id, ...product })
    setAdding(false)
    navigate(0)
  }

  function handleDelete(id) {
    if (confirm('Supprimer ce produit ?')) {
      deleteProduct(id)
      navigate(0)
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    await updateProfile({
      businessName: data.businessName,
      businessDescription: data.businessDescription,
      whatsappNumber: data.whatsappNumber,
    })
    alert('Profil mis à jour')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b">
          <div className="font-semibold">Bonjour, {user.name || user.businessName}</div>
          <div className="text-sm text-gray-600">Plan: <span className="font-medium uppercase">{user.plan}</span></div>
        </div>
        <nav className="p-2">
          <button onClick={() => setTab('products')} className={`navbtn ${tab==='products'?'active':''}`}><Store size={16}/> Mes produits</button>
          <button onClick={() => setTab('store')} className={`navbtn ${tab==='store'?'active':''}`}><ExternalLink size={16}/> Ma boutique</button>
          <button onClick={() => setTab('settings')} className={`navbtn ${tab==='settings'?'active':''}`}><Settings size={16}/> Paramètres</button>
          <button onClick={() => setTab('upgrade')} className={`navbtn ${tab==='upgrade'?'active':''}`}><CreditCard size={16}/> Upgrade plan</button>
        </nav>
      </aside>

      <section className="md:col-span-3">
        {tab === 'products' && (
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">Mes produits</div>
                <div className="text-sm text-gray-600">{products.length}/{productLimit} produits</div>
              </div>
              <button onClick={() => setAdding(true)} className="px-3 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"><Plus size={16}/> Ajouter un produit</button>
            </div>
            <div className="p-4 flex flex-col md:flex-row gap-3">
              <input className="input flex-1" placeholder="Rechercher..." value={query} onChange={(e)=>setQuery(e.target.value)} />
              <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value="">Toutes catégories</option>
                <option>Produits</option>
                <option>Services</option>
                <option>Général</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filtered.map((p)=> (
                <div key={p.id} className="border rounded-lg overflow-hidden bg-white">
                  <img src={p.imageURL} alt={p.name} className="h-40 w-full object-cover"/>
                  <div className="p-3">
                    <div className="font-semibold line-clamp-1">{p.name}</div>
                    <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="font-bold">{p.price.toLocaleString()} FCFA</div>
                      <div className="flex gap-2">
                        <Link to={`edit/${p.id}`} className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-1 text-sm"><Pencil size={14}/> Modifier</Link>
                        <button onClick={()=>handleDelete(p.id)} className="px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1 text-sm"><Trash2 size={14}/> Suppr.</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length===0 && <div className="text-sm text-gray-600 p-4">Aucun produit.</div>}
            </div>
          </div>
        )}

        {tab === 'store' && (
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Lien public de votre boutique</div>
                <div className="text-sm text-gray-600">Partagez ce lien avec vos clients</div>
              </div>
              <a target="_blank" rel="noreferrer" href={`${window.location.origin}/store/${user.storeSlug}`} className="px-3 py-2 rounded-lg bg-blue-600 text-white">Ouvrir</a>
            </div>
            <div className="mt-3">
              <input readOnly className="input" value={`${window.location.origin}/store/${user.storeSlug}`} />
            </div>
            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              <Stat label="Vues" value={user.stats?.viewsCount || 0} />
              <Stat label="Commandes" value={user.stats?.ordersCount || 0} />
              <Stat label="Plan" value={user.plan?.toUpperCase()} />
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="font-semibold mb-3">Paramètres de la boutique</div>
            <form onSubmit={handleUpdateProfile} className="grid gap-4 max-w-xl">
              <label className="block">
                <div className="text-sm font-medium mb-1">Nom de la boutique</div>
                <input name="businessName" defaultValue={user.businessName} className="input" required />
              </label>
              <label className="block">
                <div className="text-sm font-medium mb-1">Description</div>
                <textarea name="businessDescription" defaultValue={user.businessDescription} className="input" />
              </label>
              <label className="block">
                <div className="text-sm font-medium mb-1">Numéro WhatsApp</div>
                <input name="whatsappNumber" defaultValue={user.whatsappNumber} className="input" placeholder="ex: +22507010203" />
              </label>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white w-max">Enregistrer</button>
            </form>
          </div>
        )}

        {tab === 'upgrade' && (
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="font-semibold">Passez au plan Premium</div>
            <p className="text-gray-600 mt-2 max-w-2xl">Le plan Premium débloquera des limites plus élevées, des statistiques avancées et d'autres fonctionnalités. Pour l'instant, contactez-nous pour activer manuellement votre plan.</p>
            <a href="mailto:hello@boutikexpress.com" className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white">Nous contacter</a>
          </div>
        )}
      </section>

      {adding && (
        <ProductForm onCancel={()=>setAdding(false)} onSubmit={handleAdd} />
      )}

      <Routes>
        <Route path="edit/:id" element={<EditProductModal />} />
      </Routes>

      <style>{`
        .input { padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px; outline: none; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15) }
        .navbtn { width: 100%; display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:10px; color:#374151 }
        .navbtn:hover { background:#f3f4f6 }
        .navbtn.active { background:#e8f0ff; color:#1d4ed8 }
      `}</style>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

import { useParams, useLocation } from 'react-router-dom'
import { getProductsByOwner as getByOwner, updateProduct as upd, } from '../lib/storage'
import { useEffect } from 'react'

function EditProductModal() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const product = useMemo(() => getByOwner(user.id).find((p) => p.id === id), [id, user.id])

  useEffect(() => {
    if (!product) navigate('/dashboard')
  }, [product, navigate])

  if (!product) return null

  function handleSubmit(data) {
    upd(product.id, data)
    navigate('/dashboard')
  }

  return <ProductForm product={product} onSubmit={handleSubmit} onCancel={()=>navigate('/dashboard')} />
}
