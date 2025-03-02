// services/api/users.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Função para buscar o perfil do usuário
export const fetchUserProfile = async (token) => {
  try {
    if (!token) {
      throw new Error('Token não fornecido.');
    }

    const decoded = parseJwt(token); // Decodifica o token
    const userId = decoded?.id || decoded?.sub;

    if (!userId) {
      throw new Error('ID de usuário não encontrado no token.');
    }

    const response = await axios.get(`${API_URL}/usuarios/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
};

// Função para decodificar o token JWT (se necessário)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

/**
 * Função para listar todos os usuários.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Array>} - Retorna a lista de usuários.
 */
export const listarUsuarios = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    throw error.response?.data?.detail || 'Erro ao listar usuários.'
  }
}

/**
 * Função para obter um usuário pelo ID.
 * @param {number} usuarioId - ID do usuário.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do usuário.
 */
export const obterUsuario = async (usuarioId, token) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    throw error.response?.data?.detail || 'Erro ao obter usuário.'
  }
}

/**
 * Função para criar um novo usuário.
 * @param {Object} usuarioData - Dados do usuário a serem enviados para a API.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do usuário criado.
 */
export const criarUsuario = async (usuarioData, token) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/`, usuarioData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error.response?.data?.detail || 'Erro ao criar usuário.'
  }
}

/**
 * Função para atualizar um usuário.
 * @param {number} usuarioId - ID do usuário.
 * @param {Object} usuarioUpdate - Dados de atualização do usuário.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do usuário atualizado.
 */
export const atualizarUsuario = async (usuarioId, usuarioUpdate, token) => {
  try {
    const response = await axios.put(`${API_URL}/usuarios/${usuarioId}`, usuarioUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    throw error.response?.data?.detail || 'Erro ao atualizar usuário.'
  }
}

/**
 * Função para deletar um usuário.
 * @param {number} usuarioId - ID do usuário.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<void>}
 */
export const deletarUsuario = async (usuarioId, token) => {
  try {
    await axios.delete(`${API_URL}/usuarios/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    throw error.response?.data?.detail || 'Erro ao deletar usuário.'
  }
}