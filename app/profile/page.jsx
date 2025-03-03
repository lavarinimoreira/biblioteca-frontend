'use client'
import { useState, useEffect, useRef } from 'react';
import { fetchUserProfile, atualizarUsuario } from '@/services/api/consumir_rotas/users';
import { uploadProfilePicture } from '@/services/api/consumir_rotas/files';
import adaptImageUrl from '@/services/api/adapt_image_url';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import { Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, PhotoCamera } from '@mui/icons-material';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado.');
        }
        const profileData = await fetchUserProfile(token);
        profileData.profile_picture_url = adaptImageUrl(profileData.profile_picture_url);
        setProfile(profileData);
        setProfileForm({
          nome: profileData.nome,
          email: profileData.email,
          telefone: profileData.telefone || '',
          endereco_completo: profileData.endereco_completo || ''
        });
      } catch (err) {
        console.error(err);
        setError(err.message || 'Erro ao carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Perfil não encontrado.
        </Typography>
      </Container>
    );
  }

  // Abre o input para atualizar a imagem
  const handleOpenUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Lida com o envio do arquivo e atualiza o perfil com a nova imagem
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Chama a função de upload passando o ID do usuário
      const updatedProfile = await uploadProfilePicture(profile.id, file, token);
      setProfile(updatedProfile);
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar a imagem de perfil.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Abre o diálogo para edição
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  // Atualiza os valores do formulário
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Salva as alterações do perfil
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const updatedProfile = await atualizarUsuario(profile.id, profileForm, token);
      setProfile(updatedProfile);
      setOpenEditDialog(false);
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {profile.profile_picture_url ? (
              <Avatar
                alt={profile.nome}
                src={profile.profile_picture_url}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
            ) : (
              <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                {profile.nome?.charAt(0)}
              </Avatar>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5">{profile.nome}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton onClick={handleOpenEditDialog} size="small">
                  <Edit />
                </IconButton>
                <IconButton onClick={handleOpenUpload} size="small">
                  <PhotoCamera />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Typography variant="body1">
            <strong>Email:</strong> {profile.email}
          </Typography>
          {profile.telefone && (
            <Typography variant="body1">
              <strong>Telefone:</strong> {profile.telefone}
            </Typography>
          )}
          {profile.endereco_completo && (
            <Typography variant="body1">
              <strong>Endereço:</strong> {profile.endereco_completo}
            </Typography>
          )}
          <Typography variant="body1">
            <strong>Data Criação:</strong>{' '}
            {profile.data_criacao ? format(new Date(profile.data_criacao), 'dd/MM/yyyy HH:mm') : '-'}
          </Typography>
          {profile.data_atualizacao && (
            <Typography variant="body1">
              <strong>Data Atualização:</strong>{' '}
              {format(new Date(profile.data_atualizacao), 'dd/MM/yyyy HH:mm')}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Input de arquivo oculto para upload de imagem */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />

      {/* Diálogo de edição do perfil */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nome"
            name="nome"
            value={profileForm?.nome || ''}
            onChange={handleProfileFormChange}
          />
          <TextField
            label="Email"
            name="email"
            value={profileForm?.email || ''}
            onChange={handleProfileFormChange}
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={profileForm?.telefone || ''}
            onChange={handleProfileFormChange}
          />
          <TextField
            label="Endereço"
            name="endereco_completo"
            value={profileForm?.endereco_completo || ''}
            onChange={handleProfileFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveProfile} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
