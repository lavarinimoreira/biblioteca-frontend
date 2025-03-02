// services/api/books/books.js

import axios from 'axios'
import adapt_image_url from '@/services/api/adapt_image_url'


// URL base da API (definida via variável de ambiente ou localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getBooks({ titulo = '', autor = '', genero = '', skip = 0, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (titulo) params.append('titulo', titulo);
  if (autor) params.append('autor', autor);
  if (genero) params.append('genero', genero);
  params.append('skip', skip);
  params.append('limit', limit);

  const response = await fetch(`${API_URL}/livros?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar os livros');
  }

  const data = await response.json();

  // Atualiza a URL da imagem para cada livro utilizando a função adapt_image_url
  return {
    livros: data.livros.map((book) => ({
      ...book,
      image_url: adapt_image_url(book.image_url),
    })),
    total: data.total
  };
}


// Obter livro por id
export async function obterLivroPorId(livroId) {
  try {
    const response = await fetch(`http://localhost:8000/livros/${livroId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erro ${response.status}: ${errorMessage}`);
    }

    const livro = await response.json();
    livro.image_url = adapt_image_url(livro.image_url)
    return livro;
  } catch (error) {
    console.error('Erro ao obter o livro:', error);
    throw error;
  }
}

/**
 * Função para criar um novo livro.
 * @param {Object} livroData - Dados do livro a serem enviados para a API.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do livro criado.
 */
export const criarLivro = async (livroData, token) => {
  try {
    const response = await axios.post(`${API_URL}/livros/`, livroData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao criar livro:', error)
    throw error.response?.data?.detail || 'Erro ao criar livro.'
  }
}

/**
 * Função para atualizar um livro.
 * @param {number} livroId - ID do livro.
 * @param {Object} livroUpdate - Dados de atualização do livro.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<Object>} - Retorna os dados do livro atualizado.
 */
export const atualizarLivro = async (livroId, livroUpdate, token) => {
  try {
    const response = await axios.put(`${API_URL}/livros/${livroId}`, livroUpdate, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar livro:', error)
    throw error.response?.data?.detail || 'Erro ao atualizar livro.'
  }
}

/**
 * Função para deletar um livro.
 * @param {number} livroId - ID do livro.
 * @param {string} token - Token JWT para autenticação.
 * @returns {Promise<void>}
 */
export const deletarLivro = async (livroId, token) => {
  try {
    await axios.delete(`${API_URL}/livros/${livroId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    console.error('Erro ao deletar livro:', error)
    throw error.response?.data?.detail || 'Erro ao deletar livro.'
  }
}