import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  onAuthChange,
  updateUser,
} from '../lib/storage'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthChange(setUser)
    return () => unsub()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      register: async (data) => {
        setLoading(true)
        try {
          const u = await createUser(data)
          return u
        } finally {
          setLoading(false)
        }
      },
      login: async (email, password) => {
        setLoading(true)
        try {
          return await loginUser(email, password)
        } finally {
          setLoading(false)
        }
      },
      logout: async () => {
        await logoutUser()
      },
      updateProfile: async (patch) => {
        const u = await updateUser(patch)
        setUser(u)
        return u
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
