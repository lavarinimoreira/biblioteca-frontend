// services/api/auth/auth.js
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'


export async function login(username, password) {
  try {
    // Cria o corpo da requisição no formato URL-encoded
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)

    // Faz a requisição POST para a rota /auth/token
    const response = await axios.post(`${API_URL}/auth/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    // Retorna os dados do token (ex: { access_token, token_type })
    return response.data
  } catch (error) {
    console.error('Erro no login:', error)
    throw error
  }
}

/**
 * Função para criar um novo usuário.
 * @param {Object} userData - Dados do usuário a serem enviados para a API.
 * @param {string} userData.nome - Nome do usuário.
 * @param {string} userData.email - Email do usuário.
 * @param {string} userData.telefone - Telefone do usuário.
 * @param {string} userData.endereco_completo - Endereço completo do usuário.
 * @param {string} userData.senha_hash - Senha do usuário.
 * @returns {Promise<Object>} - Retorna os dados do usuário criado.
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/`, userData)
    return response.data // Retorna os dados do usuário criado
  } catch (error) {
    console.error('Erro ao criar usuário:', error)

    // Tratamento de erros específicos
    if (error.response?.status === 400) {
      throw new Error(error.response.data.detail || 'O email fornecido já está cadastrado.')
    }

    throw new Error('Erro ao criar usuário. Tente novamente mais tarde.')
  }
}