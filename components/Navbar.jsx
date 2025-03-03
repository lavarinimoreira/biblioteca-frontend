'use client'
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import NavbarClient from './NavbarClient'
import NavbarAdmin from './NavbarAdmin'

const Navbar = () => {
  const { user } = useContext(AuthContext)
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Link para Home */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" passHref legacyBehavior>
              <Button color="inherit">Início</Button>
            </Link>
          </Typography>

          {user ? (
            // Verifica se o usuário tem a permissão "admin.create"
            user.permissoes.includes('admin.create') ? (
              <NavbarAdmin/>
            ) : <NavbarClient />
          ) : (
            // Links para usuários não autenticados
            <>
              <Link href="/login" passHref legacyBehavior>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <Button color="inherit">Cadastro</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
