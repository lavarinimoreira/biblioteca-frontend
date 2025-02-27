'use client'
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/contexts/AuthContext'
import { login as loginService } from '@/services/api/auth/auth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Chama o serviço de login que consome a rota /auth/token da FastAPI
      const tokenData = await loginService(formData.username, formData.password)
      // Atualiza o contexto de autenticação (armazenando token e dados do usuário)
      login({ token: tokenData.access_token, user: { username: formData.username } })
      // Redireciona para a página home ou outra rota desejada
      router.push('/')
    } catch (err) {
      setError('Erro no login. Verifique suas credenciais.')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4">
          Login
        </Typography>
        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
