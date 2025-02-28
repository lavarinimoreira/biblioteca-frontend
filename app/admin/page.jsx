'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

const AdminPage = () => {
  const router = useRouter()
  const { user } = useContext(AuthContext) // Acessa o usuário do contexto

  useEffect(() => {
    // Verifica se o usuário está autenticado e tem a permissão "admin.create"
    if (!user || !user.permissoes?.includes('admin.create')) {
      router.push('/access-denied') // Redireciona para a página de acesso negado
    }
  }, [user, router])

  // Se o usuário não estiver autenticado ou não tiver permissão, não renderiza o conteúdo
  if (!user || !user.permissoes?.includes('admin.create')) {
    return null // Ou exiba uma mensagem de carregamento/spinner
  }

  return (
    <div>
      <h1>Página Administrativa</h1>
      <p>Bem-vindo, {user.sub}</p>
      {/* Conteúdo da página administrativa */}
    </div>
  )
}

export default AdminPage