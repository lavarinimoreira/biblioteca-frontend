'use client'
import { useState } from 'react'
import { uploadProfilePicture } from '@/services/api/consumir_rotas/files'
import { Button, CircularProgress, Alert, Box } from '@mui/material'

export default function ProfilePictureUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]) // Armazena o arquivo selecionado
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo antes de enviar.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('token') // Obtém o token JWT do localStorage
      const updatedUser = await uploadProfilePicture(file, token) // Envia a imagem
      console.log('Usuário atualizado:', updatedUser)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Erro ao enviar imagem de perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Botão para selecionar o arquivo */}
      <Button variant="contained" component="label">
        Selecionar Imagem
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </Button>

      {/* Botão para realizar o upload */}
      <Button onClick={handleUpload} disabled={loading} sx={{ ml: 2 }}>
        {loading ? <CircularProgress size={24} /> : 'Enviar Imagem'}
      </Button>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Box>
  )
}