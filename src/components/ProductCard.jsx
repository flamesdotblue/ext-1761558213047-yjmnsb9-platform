import { sanitizePhone } from '../lib/storage'
import { MessageCircle } from 'lucide-react'

export default function ProductCard({ product, owner }) {
  const number = sanitizePhone(owner.whatsappNumber || owner.phoneNumber || '')
  const text = encodeURIComponent(`Bonjour! Je suis intéressé par votre produit ${product.name}.`)
  const wa = number ? `https://wa.me/${number}?text=${text}` : null

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <img src={product.imageURL} alt={product.name} className="h-48 w-full object-cover"/>
      <div className="p-4">
        <div className="font-semibold">{product.name}</div>
        <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-bold">{product.price.toLocaleString()} FCFA</div>
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 text-sm">
              <MessageCircle size={16}/> WhatsApp
            </a>
          ) : (
            <div className="text-xs text-gray-500">Numéro WhatsApp non renseigné</div>
          )}
        </div>
      </div>
    </div>
  )
}
