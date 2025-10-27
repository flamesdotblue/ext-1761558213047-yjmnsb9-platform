import { useEffect, useRef, useState } from 'react'

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    imageURL: product?.imageURL || '',
    category: product?.category || 'Général',
  })
  const [preview, setPreview] = useState(product?.imageURL || '')
  const fileRef = useRef(null)

  useEffect(()=>{ setPreview(form.imageURL) }, [form.imageURL])

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = String(ev.target?.result)
      setPreview(url)
      setForm((s)=>({ ...s, imageURL: url }))
    }
    reader.readAsDataURL(f)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name) return alert('Nom requis')
    onSubmit({ ...form, price: Number(form.price || 0) })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
        <div className="p-4 border-b font-semibold">{product ? 'Modifier le produit' : 'Ajouter un produit'}</div>
        <form onSubmit={handleSubmit} className="p-4 grid gap-4">
          <label className="block">
            <div className="text-sm font-medium mb-1">Nom du produit</div>
            <input className="input" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Description</div>
            <textarea className="input" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Prix (FCFA)</div>
              <input type="number" className="input" value={form.price} onChange={(e)=>setForm({ ...form, price: e.target.value })} />
            </label>
            <label className="block">
              <div className="text-sm font-medium mb-1">Catégorie</div>
              <select className="input" value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })}>
                <option>Général</option>
                <option>Produits</option>
                <option>Services</option>
              </select>
            </label>
          </div>
          <div className="grid gap-3">
            <div className="text-sm font-medium">Photo</div>
            {preview && <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl border"/>}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="block" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border">Annuler</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">{product ? 'Enregistrer' : 'Publier'}</button>
          </div>
        </form>
      </div>
      <style>{`.input{width:100%;padding:10px 12px;border:1px solid #e5e7eb;border-radius:10px;outline:none}.input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}`}</style>
    </div>
  )
}
