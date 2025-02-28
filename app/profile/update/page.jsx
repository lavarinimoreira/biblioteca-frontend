'use client'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/contexts/AuthContext'
import axios from 'axios'
import { Container, Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material'
import validatePassword from '@/services/api/validate_password'
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

export default function ProfileUpdatePage() {
  const { user } = useContext(AuthContext) // Acessa o usuário do contexto
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco_completo: '',
    senha_hash: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Carrega os dados do usuário ao montar a página
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile()
    }
  }, [user])

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/usuarios/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFormData({
        nome: response.data.nome || '',
        email: response.data.email || '',
        telefone: response.data.telefone || '',
        endereco_completo: response.data.endereco_completo || '',
        senha_hash: '', // Senha não é preenchida por padrão
      })
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      setError('Erro ao carregar o perfil.')
    }
  }

  // Função para atualizar os dados do usuário
  const handleUpdateProfile = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
  
    // Valida a senha
    const passwordError = validatePassword(formData.senha_hash)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }
  
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
      // Remove campos vazios antes de enviar
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      )
  
      // Remove o campo de senha se estiver vazio
      if (!payload.senha_hash) {
        delete payload.senha_hash
      }
  
      await axios.put(`${API_URL}/usuarios/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
  
      setSuccess(true)
      setTimeout(() => {
        router.push('/profile') // Redireciona para a página de perfil após a atualização
      }, 2000)
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setError(err.response?.data?.message || 'Erro ao atualizar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Atualizar Perfil
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Perfil atualizado com sucesso! Redirecionando...
            </Alert>
          )}

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ProfilePictureUpload/>
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Endereço Completo"
              name="endereco_completo"
              value={formData.endereco_completo}
              onChange={handleChange}
              fullWidth
            />
            <TextField
                label="Nova Senha"
                name="senha_hash"
                type="password"
                value={formData.senha_hash}
                onChange={handleChange}
                fullWidth
                helperText="Deixe em branco para manter a senha atual. Mínimo de 8 caracteres."
                error={!!error && error.includes('senha')} // Destaca o campo se houver erro de senha
            />

            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}