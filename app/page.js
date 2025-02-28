"use client";

import { useState } from 'react';
import BooksList from "@/components/books/Books";
import { Box, Button, TextField } from '@mui/material';

export default function HomePage() {
  const [filters, setFilters] = useState({
    titulo: '',
    autor: '',
    genero: '',
    skip: 0,
    limit: 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui podemos disparar a busca ou atualizar o estado que controla a listagem.
    console.log("Filtros aplicados:", filters);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <h1>Bem-vindo à Biblioteca</h1>
      <h2>Livros</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField 
          label="Título" 
          name="titulo" 
          value={filters.titulo} 
          onChange={handleChange}
          margin="normal"
        />
        <TextField 
          label="Autor" 
          name="autor" 
          value={filters.autor} 
          onChange={handleChange}
          margin="normal"
        />
        <TextField 
          label="Gênero" 
          name="genero" 
          value={filters.genero} 
          onChange={handleChange}
          margin="normal"
        />
        <Box>
          <Button type="submit" variant="contained" color="primary">
            Filtrar
          </Button>
        </Box>
      </form>
      <BooksList filters={filters} />
    </Box>
  );
}
