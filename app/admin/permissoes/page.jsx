'use client'

import { withAuth } from '@/components/higher_order_component/withAuth';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from '@mui/icons-material';
import {
  listarPermissoes,
  criarPermissao,
  atualizarPermissao,
  deletarPermissao,
} from '@/services/api/consumir_rotas/permissions';

// Função auxiliar para formatar datas
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

const PermissoesPage = () => {
  const [permissoes, setPermissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermissao, setSelectedPermissao] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [namespace, setNamespace] = useState('');
  const [token, setToken] = useState(null);

  // Recupera o token do localStorage ao montar o componente
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage);
  }, []);

  // Busca as permissões da API
  const fetchPermissoes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await listarPermissoes(token);
      setPermissoes(data);
    } catch (error) {
      console.error('Erro ao carregar as permissões:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPermissoes();
    }
  }, [token]);

  // Abre o diálogo para criar ou editar uma permissão
  const handleOpenDialog = (permissao = null) => {
    if (permissao) {
      setIsEditing(true);
      setSelectedPermissao(permissao);
      setNome(permissao.nome);
      setDescricao(permissao.descricao || '');
      setNamespace(permissao.namespace || '');
    } else {
      setIsEditing(false);
      setSelectedPermissao(null);
      setNome('');
      setDescricao('');
      setNamespace('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNome('');
    setDescricao('');
    setNamespace('');
    setSelectedPermissao(null);
  };

  // Cria ou atualiza uma permissão
  const handleSubmit = async () => {
    try {
      if (isEditing && selectedPermissao) {
        await atualizarPermissao(selectedPermissao.id, { nome, descricao, namespace }, token);
      } else {
        await criarPermissao({ nome, descricao, namespace }, token);
      }
      fetchPermissoes();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar permissão:', error);
    }
  };

  // Deleta uma permissão
  const handleDelete = async (id) => {
    try {
      await deletarPermissao(id, token);
      fetchPermissoes();
    } catch (error) {
      console.error('Erro ao deletar permissão:', error);
    }
  };

  // Define as colunas do DataGrid com formatação para datas
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'descricao', headerName: 'Descrição', width: 300 },
    { field: 'namespace', headerName: 'Namespace', width: 150 },
    { 
      field: 'data_criacao', 
      headerName: 'Criado Em', 
      width: 180,
      renderCell: (params) => formatDate(params.value)
    },
    { 
      field: 'data_atualizacao', 
      headerName: 'Atualizado Em', 
      width: 180,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton aria-label="editar" onClick={() => handleOpenDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="deletar" color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Permissões Administrativas
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Adicionar Permissão
      </Button>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={permissoes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={loading}
          autoHeight
        />
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditing ? 'Editar Permissão' : 'Adicionar Permissão'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descrição"
            type="text"
            fullWidth
            variant="outlined"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Namespace"
            type="text"
            fullWidth
            variant="outlined"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withAuth(PermissoesPage, 'admin.create');
