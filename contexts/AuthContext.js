// contexts/AuthContext.js
'use client'
import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import parseJwt from '@/services/api/auth/jwt_decoder' // Função para decodificar o token JWT

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Função para decodificar o token e extrair as informações do usuário
  const decodeTokenAndSetUser = (token) => {
    try {
      const decoded = parseJwt(token) // Decodifica o token
      if (decoded) {
        // Extrai o `id` e `grupo_politica` do token
        const { id, permissoes, sub } = decoded
        if (id && sub && permissoes) {
          setUser({ id, permissoes, sub }) // Define o usuário no estado
        } else {
          console.error('Token não contém id ou grupo_politica ou permissões.')
        }
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error)
    }
  }

  // Verifica o token ao carregar o contexto
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      decodeTokenAndSetUser(token) // Decodifica o token e define o usuário
    }
  }, [])

  // Função de login
  const login = (data) => {
    localStorage.setItem('token', data.token) // Armazena o token no localStorage
    decodeTokenAndSetUser(data.token) // Decodifica o token e define o usuário
    router.push('/profile') // Redireciona para a página de perfil
  }

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token') // Remove o token do localStorage
    setUser(null) // Limpa o estado do usuário
    router.push('/') // Redireciona para a página inicial
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}