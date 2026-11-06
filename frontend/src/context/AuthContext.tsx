import { createContext, useContext, useState, useEffect } from 'react'; import type { ReactNode } from 'react'
import type { User, AuthResponse } from '../types'
import api, { setAuthToken } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      api.get<User>('/auth/me').then(res => setUser(res.data)).catch(() => {
        setAuthToken(null)
        setToken(null)
        setUser(null)
      })
    }
  }, [token])

  const login = async (username: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { username, password })
    const newToken = res.data.access_token
    setAuthToken(newToken)
    setToken(newToken)
    const userRes = await api.get<User>('/auth/me')
    setUser(userRes.data)
  }

  const logout = () => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
