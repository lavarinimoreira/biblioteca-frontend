'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/navigation';

const AcessoNegadoPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        Acesso Negado
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Você não tem permissão para acessar esta página.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleBack}>
        Voltar para o Início
      </Button>
    </Box>
  );
};

export default AcessoNegadoPage;
