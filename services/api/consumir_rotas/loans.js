/**----------------------------------------------
  /app/services/api/consumir_rotas/loans.js
=================================================

  Arquivo para organizar as funções responsáveis 
  por consumir as rotas de Empréstimos
  
 ----------------------------------------------*/

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Função para criar um novo empréstimo.
 * @param {Object} emprestimoData - Dados do empréstimo a serem enviados para a API.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do empréstimo criado.
 */
export const criarEmprestimo = async (emprestimoData, token) => {
  try {
    const response = await axios.post(`${API_URL}/emprestimos/`, emprestimoData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error)
    throw error.response?.data?.detail || 'Erro ao criar empréstimo.'
  }
}


/**
 * Função para listar todos os empréstimos do sistema.
 * Apenas usuários com a permissão "admin.read" podem acessar essa rota.
 *
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Array>} - Retorna a lista completa de empréstimos.
 */
export const listarTodosEmprestimos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/emprestimos/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao listar todos os empréstimos:', error)
    throw error.response?.data?.detail || 'Erro ao listar todos os empréstimos.'
  }
}


/**
 * Função para listar todos os empréstimos do usuário autenticado.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Array>} - Retorna a lista de empréstimos.
 */
export const listarEmprestimos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/emprestimos/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao listar empréstimos:', error)
    throw error.response?.data?.detail || 'Erro ao listar empréstimos.'
  }
}

/**
 * Função para obter um empréstimo por ID.
 * @param {number} emprestimoId - ID do empréstimo.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do empréstimo.
 */
export const obterEmprestimo = async (emprestimoId, token) => {
  try {
    const response = await axios.get(`${API_URL}/emprestimos/${emprestimoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao obter empréstimo:', error)
    throw error.response?.data?.detail || 'Erro ao obter empréstimo.'
  }
}

/**
 * Função para atualizar um empréstimo.
 * @param {number} emprestimoId - ID do empréstimo.
 * @param {Object} emprestimoUpdate - Dados de atualização do empréstimo.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do empréstimo atualizado.
 */
export const atualizarEmprestimo = async (emprestimoId, emprestimoUpdate, token) => {
  try {
    const response = await axios.put(`${API_URL}/emprestimos/${emprestimoId}`, emprestimoUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error)
    throw error.response?.data?.detail || 'Erro ao atualizar empréstimo.'
  }
}

/**
 * Função para deletar um empréstimo.
 * @param {number} emprestimoId - ID do empréstimo.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<void>}
 */
export const deletarEmprestimo = async (emprestimoId, token) => {
  try {
    await axios.delete(`${API_URL}/emprestimos/${emprestimoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    console.error('Erro ao deletar empréstimo:', error)
    throw error.response?.data?.detail || 'Erro ao deletar empréstimo.'
  }
}