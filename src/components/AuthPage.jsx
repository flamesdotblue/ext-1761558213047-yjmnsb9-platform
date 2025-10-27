import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const { login, register, loading } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    businessDescription: '',
    whatsappNumber: '',
  })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold">{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</h1>
      <p className="text-gray-600 mt-1">Accédez à votre tableau de bord Boutik Express</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-white p-6 rounded-xl shadow-sm border">
        {mode === 'register' && (
          <>
            <Field label="Votre nom">
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Nom de la boutique">
              <input className="input" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
            </Field>
            <Field label="Description de la boutique">
              <textarea className="input" value={form.businessDescription} onChange={(e) => setForm({ ...form, businessDescription: e.target.value })} />
            </Field>
            <Field label="Numéro WhatsApp">
              <input className="input" value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="ex: +22507010203" />
            </Field>
          </>
        )}
        <Field label="Email">
          <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </Field>
        <Field label="Mot de passe">
          <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </Field>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        {mode === 'login' ? (
          <span>Pas de compte ? <Link className="text-blue-600" to="/register">Créer un compte</Link></span>
        ) : (
          <span>Déjà un compte ? <Link className="text-blue-600" to="/login">Se connecter</Link></span>
        )}
      </div>

      <style>{`
        .input { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 10px; outline: none; }
        .input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15) }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  )
}
