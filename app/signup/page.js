'use client'
import { useState } from 'react'
import { createUser } from '@/services/api/auth/auth'
import { Button, TextField, Container, Typography, Alert, CircularProgress } from '@mui/material'

export default function SignUpPage() {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const newUser = await createUser(formData) // Chama a função para criar o usuário
      console.log('Usuário criado:', newUser)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Usuário
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Usuário criado com sucesso!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Endereço Completo"
          name="endereco_completo"
          value={formData.endereco_completo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Senha"
          name="senha_hash"
          type="password"
          value={formData.senha_hash}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
        </Button>
      </form>
    </Container>
  )
}