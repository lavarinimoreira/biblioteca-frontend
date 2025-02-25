'use client';

import { useEffect, useState } from 'react';
import { getBooks } from '@/services/api/books/books';
import { Card, CardMedia, CardContent, Typography, Grid2, Box } from '@mui/material';
import Link from 'next/link';

export default function BooksList({ filters = {} }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const data = await getBooks(filters);
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [filters]);

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">Erro: {error}</Typography>;

  return (
    <Box>
      {/* <Typography variant="h4" component="h1" gutterBottom>
        Livros
      </Typography> */}
      <Grid2 container spacing={2}>
        {books.map((book) => (
          <Grid2 key={book.id} xs={12} sm={6} md={4}>
            <Link href={`/livro/${book.id}`} >
              <Card>
                <CardMedia
                  component="img"
                  alt={book.titulo}
                  height="200"
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

    </Box>
  );
}
