'use client';

import { withAuth } from '@/components/higher_order_component/withAuth';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Add } from '@mui/icons-material';
import { 
  listarGruposPolitica, 
  criarGrupoPolitica, 
  atualizarGrupoPolitica, 
  deletarGrupoPolitica 
} from '@/services/api/consumir_rotas/policy_groups';
import { 
  listarPermissoesGrupo, 
  removerPermissaoDoGrupo, 
  adicionarPermissaoAoGrupo 
} from '@/services/api/consumir_rotas/policy_group_permissions';

const Permissoes = ({ grupoNome, relacoes, token, refreshRelacoes }) => {
  // Filtra as permissões associadas ao grupo atual
  const permissoesDoGrupo = relacoes.filter(
    (rel) => rel.grupo_politica_nome === grupoNome
  );

  // Remove a permissão ao chamar a API e atualiza a lista
  const handleRemove = async (permissionNamespace) => {
    try {
      await removerPermissaoDoGrupo(grupoNome, permissionNamespace, token);
      refreshRelacoes();
    } catch (error) {
      console.error('Erro ao remover permissão:', error);
    }
  };

  // Abre um prompt para o usuário informar o namespace da nova permissão a ser adicionada
  const handleAdd = async () => {
    const newNamespace = prompt("Informe o namespace da nova permissão:");
    if (newNamespace) {
      try {
        await adicionarPermissaoAoGrupo(
          { grupo_politica_nome: grupoNome, permissao_namespace: newNamespace },
          token
        );
        refreshRelacoes();
      } catch (error) {
        console.error('Erro ao adicionar permissão:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {permissoesDoGrupo.length > 0 ? (
        permissoesDoGrupo.map((item, index) => (
          <Chip
            key={index}
            label={item.permissao_namespace}
            size="small"
            // O onDelete renderiza o "x" e executa a função handleRemove
            onDelete={() => handleRemove(item.permissao_namespace)}
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))
      ) : (
        <Box component="span" sx={{ fontStyle: 'italic', color: 'text.secondary', mr: 1 }}>
          Sem permissões
        </Box>
      )}
      {/* Ícone de '+' para adicionar nova permissão */}
      <Chip
        icon={<AddIcon />}
        label=""
        size="small"
        clickable
        onClick={handleAdd}
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    </Box>
  );
};

const GruposPage = () => {
  const [grupos, setGrupos] = useState([]);
  const [relacoes, setRelacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [nome, setNome] = useState('');
  const [token, setToken] = useState(null);

  // Recupera o token do localStorage ao montar o componente
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    setToken(tokenFromStorage);
  }, []);

  // Busca os grupos via API
  const fetchGrupos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await listarGruposPolitica(token);
      setGrupos(data);
    } catch (error) {
      console.error('Erro ao carregar os grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os relacionamentos entre grupos e permissões via API
  const fetchRelacoes = async () => {
    if (!token) return;
    try {
      const data = await listarPermissoesGrupo(token);
      setRelacoes(data);
    } catch (error) {
      console.error('Erro ao carregar as permissões do grupo:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGrupos();
      fetchRelacoes();
    }
  }, [token]);

  const handleOpenDialog = (grupo = null) => {
    if (grupo) {
      setIsEditing(true);
      setSelectedGrupo(grupo);
      setNome(grupo.nome);
    } else {
      setIsEditing(false);
      setSelectedGrupo(null);
      setNome('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNome('');
    setSelectedGrupo(null);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && selectedGrupo) {
        await atualizarGrupoPolitica(selectedGrupo.id, { nome }, token);
      } else {
        await criarGrupoPolitica({ nome }, token);
      }
      fetchGrupos();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
    }
  };

  const handleDelete = async (grupoId) => {
    try {
      await deletarGrupoPolitica(grupoId, token);
      fetchGrupos();
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grupos Administrativos
      </Typography>
      <Button
        startIcon={<Add />}
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Adicionar Grupo
      </Button>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <List>
          {grupos.map((grupo) => (
            <ListItem key={grupo.id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <ListItemText
                primary={grupo.nome}
                secondary={
                  <Typography component="span">
                    <Permissoes
                      grupoNome={grupo.nome}
                      relacoes={relacoes}
                      token={token}
                      refreshRelacoes={fetchRelacoes}
                    />
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="editar"
                  onClick={() => handleOpenDialog(grupo)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  edge="end"
                  aria-label="deletar"
                  onClick={() => handleDelete(grupo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Editar Grupo' : 'Adicionar Grupo'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Grupo"
            type="text"
            fullWidth
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Atualizar' : 'Criar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default withAuth(GruposPage, 'admin.create');
