// services/api/consumir_rotas/files.js
import axios from 'axios'
import adaptImageUrl from '@/services/api/adapt_image_url';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Função para enviar a imagem de perfil para o backend.
 * @param {File} file - O arquivo de imagem a ser enviado.
 * @param {string} token - O token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do usuário atualizados.
 */
// export const uploadProfilePicture = async (file, token) => {
//   try {
//     const formData = new FormData()
//     formData.append('file', file) // Adiciona o arquivo ao FormData

//     const response = await axios.post(`${API_URL}/images/profile`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data', // Define o tipo de conteúdo como multipart/form-data
//       },
//     })

//     return response.data // Retorna os dados do usuário atualizados
//   } catch (error) {
//     console.error('Erro ao enviar imagem de perfil:', error)
//     throw error.response?.data?.message || 'Erro ao enviar imagem de perfil.'
//   }
// }

export const uploadProfilePicture = async (userId, file, token) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(`${API_URL}/images/profile/${userId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    })

    return response.data
  } catch (error) {
    console.error('Erro ao enviar imagem de perfil:', error)
    throw error.response?.data?.message || 'Erro ao enviar imagem de perfil.'
  }
}



/**
 * Função para enviar a imagem da capa do livro para o backend.
 * @param {string} bookId - O ID do livro.
 * @param {File} file - O arquivo de imagem a ser enviado.
 * @param {string} token - O token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados atualizados do livro.
 */
export async function uploadBookCover(bookId, file, token) {
  try {
    const formData = new FormData()
    formData.append('book_id', bookId)
    formData.append('file', file)

    const response = await axios.post(`${API_URL}/images/book_cover`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    const data = response.data

    if (data.image_url) {
      data.image_url = adaptImageUrl(data.image_url)
    }

    return data
  } catch (error) {
    console.error('Erro ao enviar a imagem da capa do livro:', error)
    throw error.response?.data?.message || 'Erro ao enviar imagem da capa do livro.'
  }
}
