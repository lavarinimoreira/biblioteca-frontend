// services/api/books/books.js

import adapt_image_url from '@/services/api/adapt_image_url'


// URL base da API (definida via variável de ambiente ou localhost)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getBooks({ titulo = '', autor = '', genero = '', skip = 0, limit = 10 } = {}) {
  // Cria os parâmetros da query string
  const params = new URLSearchParams();
  if (titulo) params.append('titulo', titulo);
  if (autor) params.append('autor', autor);
  if (genero) params.append('genero', genero);
  params.append('skip', skip);
  params.append('limit', limit);

  // Monta a URL completa com os parâmetros
  const response = await fetch(`${API_URL}/livros?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar os livros');
  }

  const data = await response.json();

  // Atualiza a URL da imagem para cada livro utilizando a função adapt_image_url
  return data.map((book) => ({
    ...book,
    image_url: adapt_image_url(book.image_url),
  }));
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
