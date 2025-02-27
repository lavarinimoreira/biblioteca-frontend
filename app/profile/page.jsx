'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { format } from 'date-fns'
import adaptImageUrl from '@/services/api/adapt_image_url' // ajuste o caminho conforme necessário

// Função para decodificar um JWT
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Erro ao decodificar o token:', error)
    return null
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Usuário não autenticado.')
          setLoading(false)
          return
        }

        // Decodifica o token para obter o ID do usuário
        const decoded = parseJwt(token)
        const userId = decoded?.id || decoded?.sub
        if (!userId) {
          setError('ID de usuário não encontrado no token.')
          setLoading(false)
          return
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await axios.get(`${API_URL}/usuarios/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        // Adapta a URL da imagem usando a função adaptImageUrl
        const profileData = response.data
        profileData.profile_picture_url = adaptImageUrl(profileData.profile_picture_url)
        
        setProfile(profileData)
      } catch (err) {
        console.error(err)
        setError('Erro ao carregar o perfil.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {profile.profile_picture_url ? (
              <Avatar
                alt={profile.nome}
                src={profile.profile_picture_url}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
            ) : (
              <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                {profile.nome.charAt(0)}
              </Avatar>
            )}
            <Typography variant="h5">{profile.nome}</Typography>
          </Box>
          <Typography variant="body1">
            <strong>Email:</strong> {profile.email}
          </Typography>
          {profile.telefone && (
            <Typography variant="body1">
              <strong>Telefone:</strong> {profile.telefone}
            </Typography>
          )}
          {profile.endereco_completo && (
            <Typography variant="body1">
              <strong>Endereço:</strong> {profile.endereco_completo}
            </Typography>
          )}
          <Typography variant="body1">
            <strong>Grupo Política:</strong> {profile.grupo_politica}
          </Typography>
          <Typography variant="body1">
            <strong>Data Criação:</strong>{' '}
            {profile.data_criacao
              ? format(new Date(profile.data_criacao), 'dd/MM/yyyy HH:mm')
              : '-'}
          </Typography>
          {profile.data_atualizacao && (
            <Typography variant="body1">
              <strong>Data Atualização:</strong>{' '}
              {format(new Date(profile.data_atualizacao), 'dd/MM/yyyy HH:mm')}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
