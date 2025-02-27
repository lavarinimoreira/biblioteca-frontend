// contexts/AuthContext.js
'use client'
import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Aqui, pode-se validar o token ou decodificá-lo para obter os dados do usuário...
      setUser({ username: 'usuarioExemplo' })
    }
  }, [])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    setUser(data.user)
    router.push('/profile')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
