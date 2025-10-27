import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductsByOwner, getUserBySlug, recordStoreView } from '../lib/storage'
import ProductCard from './ProductCard'

export default function Storefront() {
  const { slug } = useParams()
  const [owner, setOwner] = useState(null)

  useEffect(() => {
    const u = getUserBySlug(slug)
    setOwner(u || null)
    if (u) recordStoreView(u.id)
  }, [slug])

  const products = useMemo(()=> owner ? getProductsByOwner(owner.id) : [], [owner])

  if (!owner) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Boutique introuvable</h1>
        <p className="text-gray-600 mt-2">Ce lien n'est pas valide ou la boutique a été désactivée.</p>
        <Link to="/" className="mt-6 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{owner.businessName}</h1>
              <p className="text-gray-600 max-w-2xl">{owner.businessDescription}</p>
              <div className="text-sm text-gray-500 mt-2">Lien: {window.location.origin}/store/{owner.storeSlug}</div>
            </div>
            <a href={`https://wa.me/${owner.whatsappNumber?.replace(/^\+/, '') || ''}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-green-600 text-white">Contacter</a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p)=> (
            <ProductCard key={p.id} product={p} owner={owner} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center text-gray-600">Aucun produit pour le moment.</div>
        )}
      </div>
    </div>
  )
}
