// services/api/consumir_rotas/files.js
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Função para enviar a imagem de perfil para o backend.
 * @param {File} file - O arquivo de imagem a ser enviado.
 * @param {string} token - O token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do usuário atualizados.
 */
export const uploadProfilePicture = async (file, token) => {
  try {
    const formData = new FormData()
    formData.append('file', file) // Adiciona o arquivo ao FormData

    const response = await axios.post(`${API_URL}/images/profile`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Define o tipo de conteúdo como multipart/form-data
      },
    })

    return response.data // Retorna os dados do usuário atualizados
  } catch (error) {
    console.error('Erro ao enviar imagem de perfil:', error)
    throw error.response?.data?.message || 'Erro ao enviar imagem de perfil.'
  }
}