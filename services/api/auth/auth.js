// auth.js
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
