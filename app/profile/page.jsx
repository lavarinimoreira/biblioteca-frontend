'use client'
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '@/services/api/consumir_rotas/users'; // Importa o serviço
import adaptImageUrl from '@/services/api/adapt_image_url'; // Ajuste o caminho conforme necessário
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@mui/material';


export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado.');
        }

        const profileData = await fetchUserProfile(token); // Usa o serviço para buscar o perfil
        profileData.profile_picture_url = adaptImageUrl(profileData.profile_picture_url); // Adapta a URL da imagem
        setProfile(profileData);
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

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
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
            <Typography variant="h5">{profile.nome}</Typography>
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
            {profile.data_criacao
              ? format(new Date(profile.data_criacao), 'dd/MM/yyyy HH:mm')
              : '-'}
          </Typography>
          {profile.data_atualizacao && (
            <Typography variant="body1">
              <strong>Data Atualização:</strong>{' '}
              {format(new Date(profile.data_atualizacao), 'dd/MM/yyyy HH:mm')}
            </Typography>
          )}
        </CardContent>
        <Link href="/profile/update">
          <Button>Editar</Button>
        </Link>
      </Card>
    </Container>
  );
}