'use client'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { listarEmprestimos } from '@/services/api/consumir_rotas/loans'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const EmprestimosPage = () => {
  const { user } = useContext(AuthContext)
  const [emprestimos, setEmprestimos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Função para recuperar o token do localStorage
  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const token = getToken()
    if (token) {
      setLoading(true)
      listarEmprestimos(token)
        .then(data => setEmprestimos(data))
        .catch(err => setError(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  // Definição das colunas para exibir os dados
  const columns = [
    {
      field: 'livro',
      headerName: 'Livro',
      width: 250,
      renderCell: (params) => params.value?.titulo || '',
    },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'data_emprestimo',
      headerName: 'Data do Empréstimo',
      width: 200,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null
        return date ? date.toLocaleString() : ''
      }
    },
    {
      field: 'data_devolucao',
      headerName: 'Data de Devolução',
      width: 200,
      renderCell: (params) => {
        const date = params.value ? new Date(params.value) : null
        return date ? date.toLocaleString() : 'Não devolvido'
      }
    },
    { field: 'numero_renovacoes', headerName: 'Nº Renov.', width: 130 }
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3
      }}
    >
      <Typography variant="h4" gutterBottom>
        Meus Empréstimos
      </Typography>
      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ height: 500, width: '80%' }}>
        <DataGrid
          rows={emprestimos}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  )
}

export default EmprestimosPage
