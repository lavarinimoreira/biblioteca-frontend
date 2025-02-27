import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { obterLivroPorId } from '@/services/api/books/books';
import Link from 'next/link';

export default async function BookPage({ params }) {
  // Aguarda a resolução dos parâmetros da rota
  const { id } = await params;

  let livro;
  try {
    livro = await obterLivroPorId(id);
  } catch (error) {
    return <div>Livro não encontrado</div>;
  }

  return (
    <Box sx={{ padding: 2 }} display="flex" justifyContent="center">
      <Box maxWidth={380}>
        <Typography variant="h4" component="h1" gutterBottom>
          {livro.titulo}
        </Typography>
        <Card>
          <CardMedia
            component="img"
            alt={livro.titulo}
            // height="400"
            image={livro.image_url}
          />
          <CardContent>
            <Typography variant="body1">
              <strong>Autor:</strong> {livro.autor}
            </Typography>
            <Typography variant="body1">
              <strong>Gênero:</strong> {livro.genero}
            </Typography>
            <Typography variant="body1">
              <strong>Editora:</strong> {livro.editora}
            </Typography>
            <Typography variant="body1">
              <strong>Publicação:</strong> {livro.ano_publicacao}
            </Typography>
            <Typography variant="body1">
              <strong>Páginas:</strong> {livro.numero_paginas}
            </Typography>
            <Typography variant="body1">
              <strong>Disponíveis:</strong> {livro.quantidade_disponivel}
            </Typography>
            <Typography variant="body1">
              <strong>ISBN:</strong> {livro.isbn}
            </Typography>
          </CardContent>
          <Link href="/">
          <Button>Voltar</Button>
        </Link>
        </Card>
        
      </Box>
    </Box>
  );
}

