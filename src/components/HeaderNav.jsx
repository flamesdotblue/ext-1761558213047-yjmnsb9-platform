import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Rocket, Store, LogOut, User, LayoutDashboard } from 'lucide-react'

export default function HeaderNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <Rocket size={18} />
          </div>
          <span className="font-bold">Boutik Express</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900')}>Accueil</NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900')}>Admin</NavLink>
          {user ? (
            <>
              <Link to={`/store/${user.storeSlug}`} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <Store size={16} /> Ma boutique
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <LayoutDashboard size={16} /> Tableau de bord
              </Link>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 text-red-600 hover:underline">
                <LogOut size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
                <User size={16} /> Se connecter
              </Link>
              <Link to="/register" className="px-3 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">Créer ma boutique</Link>
            </>
          )}
        </nav>
        <div className="md:hidden">
          {user ? (
            <Link to="/dashboard" className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm">Dashboard</Link>
          ) : (
            <Link to="/register" className="px-3 py-2 rounded-full bg-blue-600 text-white text-sm">Commencer</Link>
          )}
        </div>
      </div>
    </header>
  )
}
