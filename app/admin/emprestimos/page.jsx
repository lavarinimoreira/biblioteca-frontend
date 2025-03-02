'use client'
import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { 
  criarEmprestimo, 
  listarTodosEmprestimos, 
  deletarEmprestimo,
  atualizarEmprestimo
} from '@/services/api/consumir_rotas/loans'
import { 
  Box, Typography, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const EmprestimosPage = () => {
  const { user } = useContext(AuthContext)
  const [emprestimos, setEmprestimos] = useState([])
  const [novoEmprestimoData, setNovoEmprestimoData] = useState({
    usuario_id: '',
    livro_id: '',
    status: 'Renovado'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estados para o diálogo de edição
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedEmprestimo, setSelectedEmprestimo] = useState(null)

  // Recupera o token diretamente do localStorage
  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const token = getToken()
    if (token) {
      setLoading(true)
      listarTodosEmprestimos(token)
        .then(data => setEmprestimos(data))
        .catch(err => setError(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  // Atualiza os valores do formulário de criação
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovoEmprestimoData(prev => ({ ...prev, [name]: value }))
  }

  // Função para criar um novo empréstimo
  const handleCriarEmprestimo = async () => {
    const token = getToken()
    if (!token) {
      console.error("Token não encontrado. Usuário não autenticado.")
      return
    }
    try {
      setLoading(true)
      const payload = {
        ...novoEmprestimoData,
        usuario_id: Number(novoEmprestimoData.usuario_id),
        livro_id: Number(novoEmprestimoData.livro_id)
      }
      const novo = await criarEmprestimo(payload, token)
      setEmprestimos(prev => [...prev, novo])
      setNovoEmprestimoData({ usuario_id: '', livro_id: '', status: 'Renovado' })
    } catch (err) {
      console.error("Erro ao criar empréstimo:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // Função para deletar um empréstimo
  const handleDeletarEmprestimo = async (id) => {
    const token = getToken()
    if (!token) return
    try {
      setLoading(true)
      await deletarEmprestimo(id, token)
      setEmprestimos(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error("Erro ao deletar empréstimo:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // Abre o diálogo de edição com os dados do empréstimo selecionado
  const handleOpenEditDialog = (emprestimo) => {
    setSelectedEmprestimo(emprestimo)
    setOpenEditDialog(true)
  }

  // Função para salvar a edição (apenas o status é enviado, pois o backend trata o incremento)
  const handleSaveEdit = async () => {
    if (!selectedEmprestimo) return
    const token = getToken()
    if (!token) {
      console.error("Token não encontrado. Usuário não autenticado.")
      return
    }
    try {
      setLoading(true)
      const payload = {
        status: selectedEmprestimo.status
      }
      const updated = await atualizarEmprestimo(
        selectedEmprestimo.id,
        payload,
        token
      )
      setEmprestimos(prev =>
        prev.map(e => (e.id === selectedEmprestimo.id ? updated : e))
      )
      setOpenEditDialog(false)
      setSelectedEmprestimo(null)
    } catch (err) {
      console.error("Erro ao atualizar empréstimo:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  // Definição das colunas para o DataGrid, com a ação de editar atualizada
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'usuario_id', headerName: 'ID do Usuário', width: 150 },
    { field: 'livro_id', headerName: 'ID do Livro', width: 150 },
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
    { field: 'numero_renovacoes', headerName: 'Nº Renov.', width: 130 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => handleOpenEditDialog(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeletarEmprestimo(params.row.id)}
          >
            Deletar
          </Button>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Empréstimos
      </Typography>

      {loading && <Typography>Carregando...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Formulário para criar um novo empréstimo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Criar Empréstimo</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
          <TextField
            label="ID do Usuário"
            name="usuario_id"
            type="number"
            value={novoEmprestimoData.usuario_id}
            onChange={handleInputChange}
          />
          <TextField
            label="ID do Livro"
            name="livro_id"
            type="number"
            value={novoEmprestimoData.livro_id}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={handleCriarEmprestimo}>
            Criar
          </Button>
        </Box>
      </Box>

      {/* DataGrid para listar os empréstimos */}
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={emprestimos}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>

      {/* Diálogo para editar o empréstimo */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Empréstimo</DialogTitle>
        <DialogContent>
          {selectedEmprestimo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={selectedEmprestimo.status}
                  label="Status"
                  onChange={(e) =>
                    setSelectedEmprestimo(prev => ({
                      ...prev,
                      status: e.target.value
                    }))
                  }
                >
                  <MenuItem value="Renovado">Renovado</MenuItem>
                  <MenuItem value="Devolvido">Devolvido</MenuItem>
                </Select>
              </FormControl>
              <Typography>
                Nº Renov.: {selectedEmprestimo.numero_renovacoes}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmprestimosPage
