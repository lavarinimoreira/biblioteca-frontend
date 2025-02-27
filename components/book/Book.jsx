'use client';

import { useEffect, useState } from 'react';
import { getBooks } from '@/services/api/books/books';
import { Card, CardMedia, CardContent, Typography, Grid2, Box, Pagination } from '@mui/material';
import Link from 'next/link';

export default function BooksList({ filters = {} }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para paginação
  const [page, setPage] = useState(1);
  const itemsPerPage = 12; // Número de registros por página
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);

        // Converte o número da página para skip e limit:
        // Página 1: skip = 0; Página 2: skip = 10; etc.
        const skip = (page - 1) * itemsPerPage;

        // Junta os filtros com os parâmetros de paginação
        const query = { ...filters, skip, limit: itemsPerPage };

        // Supondo que a função getBooks retorne um objeto no formato:
        // { livros: [...], total: númeroTotalDeLivros }
        // Mas se retornar um array diretamente, ajustamos:
        const data = await getBooks(query);

        // Se a resposta tiver a propriedade "livros", usamos ela; senão, assumimos que data já é o array
        const booksData = data?.livros || (Array.isArray(data) ? data : []);
        setBooks(booksData);

        // Para calcular o total de páginas, verificamos se a resposta possui "total".
        // Caso contrário, usamos o tamanho do array (o que não é ideal para paginação, mas evita erros).
        const totalItems = data?.total || booksData.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [filters, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">Erro: {error}</Typography>;

  return (
   <Box maxWidth={1000}>
  <Grid2 container spacing={2} >
    {books.map((book) => (
      <Grid2 key={book.id} xs={1} size={3} >
        <Link href={`/livro/${book.id}`} style={{ textDecoration: 'none' }}>
          <Card>
            <CardMedia
              component="img"
              alt={book.titulo}
              // height="220"                  
              image={book.image_url}
            />
            <CardContent>
              <Typography variant="h6">{book.titulo}</Typography>
              <Typography variant="body2" color="text.secondary">
                {book.autor} - {book.genero}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid2>
    ))}
  </Grid2>
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, marginBottom: '1rem'}}>
    <Pagination count={totalPages} page={page} onChange={handlePageChange} />
  </Box>
</Box>

  );
}
