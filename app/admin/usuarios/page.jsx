'use client'

import { withAuth } from '@/components/higher_order_component/withAuth';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from '@/services/api/consumir_rotas/users';
import {listarGruposPolitica }from '@/services/api/consumir_rotas/policy_groups';
import { uploadProfilePicture } from '@/services/api/consumir_rotas/files';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, PhotoCamera } from '@mui/icons-material';

const AdminUsersPage = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [gruposPolitica, setGruposPolitica] = useState([]); // estado para os grupos de política
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userForm, setUserForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco_completo: '',
    grupo_politica: 'cliente',
    senha_hash: ''
  });

  const fileInputRef = useRef(null);
  const [selectedUserForUpload, setSelectedUserForUpload] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchGrupos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Busca a lista de usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const data = await listarUsuarios(token);
      setUsers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Busca a lista de grupos de política do backend
  const fetchGrupos = async () => {
    try {
      const token = getToken();
      const data = await listarGruposPolitica(token);
      setGruposPolitica(data);
      // Se existir algum grupo, define o primeiro como padrão
      if (data.length > 0) {
        setUserForm((prev) => ({ ...prev, grupo_politica: data[0] }));
      }
    } catch (err) {
      console.error('Erro ao buscar grupos de política:', err);
    }
  };

// Ao abrir o diálogo de criação:
const handleOpenCreateDialog = () => {
  setUserForm({
    nome: '',
    email: '',
    telefone: '',
    endereco_completo: '',
    grupo_politica: gruposPolitica.length > 0 ? gruposPolitica[0].nome : 'cliente',
    senha_hash: ''
  });
  setOpenCreateDialog(true);
};

  const handleCreateUser = async () => {
    const token = getToken();
    if (!token) {
      setError('Token não encontrado. Usuário não autenticado.');
      return;
    }
    try {
      setLoading(true);
      const novoUsuario = await criarUsuario(userForm, token);
      setUsers((prev) => [...prev, novoUsuario]);
      setOpenCreateDialog(false);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

 // Ao abrir o diálogo de edição:
const handleOpenEditDialog = (userData) => {
  setSelectedUser(userData);
  setUserForm({
    nome: userData.nome || '',
    email: userData.email || '',
    telefone: userData.telefone || '',
    endereco_completo: userData.endereco_completo || '',
    grupo_politica: userData.grupo_politica || (gruposPolitica.length > 0 ? gruposPolitica[0].nome : 'cliente'),
    senha_hash: ''
  });
  setOpenEditDialog(true);
};

const handleUpdateUser = async () => {
  if (!selectedUser) return;
  const token = getToken();
  if (!token) {
    setError('Token não encontrado. Usuário não autenticado.');
    return;
  }
  try {
    setLoading(true);
    // Cria uma cópia dos dados do formulário
    const formToSend = { ...userForm };
    // Se o campo senha_hash estiver vazio, remove-o do objeto
    if (!formToSend.senha_hash) {
      delete formToSend.senha_hash;
    }
    const updatedUser = await atualizarUsuario(selectedUser.id, formToSend, token);
    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
    setOpenEditDialog(false);
    setSelectedUser(null);
  } catch (err) {
    setError(String(err));
  } finally {
    setLoading(false);
  }
};


  const handleDeleteUser = async (userId) => {
    const token = getToken();
    if (!token) {
      setError('Token não encontrado. Usuário não autenticado.');
      return;
    }
    try {
      setLoading(true);
      await deletarUsuario(userId, token);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpload = (userId) => {
    setSelectedUserForUpload(userId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUserForUpload) return;
    try {
      setLoading(true);
      const token = getToken();
      const data = await uploadProfilePicture(selectedUserForUpload, file, token);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === data.id ? { ...u, profile_picture_url: data.profile_picture_url } : u
        )
      );
    } catch (err) {
      setError('Erro ao enviar a imagem de perfil.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSelectedUserForUpload(null);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'email', headerName: 'E-mail', width: 200 },
    { field: 'telefone', headerName: 'Telefone', width: 150 },
    { field: 'endereco_completo', headerName: 'Endereço', width: 200 },
    { field: 'grupo_politica', headerName: 'Grupo Políticas', width: 150 },
    {
      field: 'data_criacao',
      headerName: 'Data Criação',
      width: 180,
      renderCell: (params) => {
        const value = params.row?.data_criacao;
        return value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '-';
      }
    },
    {
      field: 'data_atualizacao',
      headerName: 'Data Atualização',
      width: 180,
      renderCell: (params) => {
        const value = params.row?.data_atualizacao;
        return value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '-';
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleOpenEditDialog(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteUser(params.row.id)}>
            <Delete />
          </IconButton>
          <IconButton color="primary" onClick={() => handleOpenUpload(params.row.id)}>
            <PhotoCamera />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administração de Usuários
      </Typography>

      <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreateDialog}>
        Criar Usuário
      </Button>

      {loading && <Typography sx={{ mt: 2 }}>Carregando...</Typography>}
      {error && <Typography color="error" sx={{ mt: 2 }}>{String(error)}</Typography>}

      <Box sx={{ height: 500, width: '100%', mt: 2 }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>

      {/* Input para upload de imagem */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />

      {/* Diálogo de criação */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Criar Usuário</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            name="nome"
            value={userForm.nome}
            onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
          />
          <TextField
            label="E-mail"
            name="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={userForm.telefone}
            onChange={(e) => setUserForm({ ...userForm, telefone: e.target.value })}
          />
          <TextField
            label="Endereço"
            name="endereco_completo"
            value={userForm.endereco_completo}
            onChange={(e) => setUserForm({ ...userForm, endereco_completo: e.target.value })}
          />
          <FormControl>
            <InputLabel id="grupo-label">Grupo Políticas</InputLabel>
            <Select
              labelId="grupo-label"
              value={userForm.grupo_politica}
              label="Grupo Políticas"
              onChange={(e) => setUserForm({ ...userForm, grupo_politica: e.target.value })}
            >
              {gruposPolitica.length > 0 ? (
                gruposPolitica.map((grupo) => (
                  <MenuItem key={grupo.id} value={grupo.nome}>
                    {grupo.nome}
                  </MenuItem>
                ))
              ) : (
                <>
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Senha"
            type="password"
            name="senha_hash"
            value={userForm.senha_hash}
            onChange={(e) => setUserForm({ ...userForm, senha_hash: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edição */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            name="nome"
            value={userForm.nome}
            onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })}
          />
          <TextField
            label="E-mail"
            name="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={userForm.telefone}
            onChange={(e) => setUserForm({ ...userForm, telefone: e.target.value })}
          />
          <TextField
            label="Endereço"
            name="endereco_completo"
            value={userForm.endereco_completo}
            onChange={(e) => setUserForm({ ...userForm, endereco_completo: e.target.value })}
          />
          <FormControl>
            <InputLabel id="grupo-edit-label">Grupo Políticas</InputLabel>
            <Select
              labelId="grupo-edit-label"
              value={userForm.grupo_politica}
              label="Grupo Políticas"
              onChange={(e) => setUserForm({ ...userForm, grupo_politica: e.target.value })}
            >
              {gruposPolitica.length > 0 ? (
                gruposPolitica.map((grupo) => (
                  <MenuItem key={grupo.id} value={grupo.nome}>
                    {grupo.nome}
                  </MenuItem>
                ))
              ) : (
                <>
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Senha"
            type="password"
            name="senha_hash"
            value={userForm.senha_hash}
            onChange={(e) => setUserForm({ ...userForm, senha_hash: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withAuth(AdminUsersPage, 'admin.create');
