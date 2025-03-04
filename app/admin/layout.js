// app/admin/layout.js
'use client'
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemText, CssBaseline, Button } from '@mui/material'
import Link from 'next/link'

const drawerWidth = 240

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Cabeçalho */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div">
            Área Administrativa
            </Typography>
            <Link href="/" passHref legacyBehavior>
            <Button color="inherit">Retornar ao site</Button>
            </Link>
        </Toolbar>
        </AppBar>
      {/* Menu lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { label: 'Usuários', href: '/admin/usuarios' },
              { label: 'Livros', href: '/admin/livros' },
              { label: 'Empréstimos', href: '/admin/emprestimos' },
              { label: 'Grupos', href: '/admin/grupos' },
              { label: 'Permissões', href: '/admin/permissoes' }                            
            ].map((item) => (
              <Link key={item.href} href={item.href} passHref legacyBehavior>
                <ListItemButton>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Área de conteúdo */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
