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