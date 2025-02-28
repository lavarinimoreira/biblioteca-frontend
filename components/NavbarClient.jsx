import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Button } from '@mui/material'
import Link from 'next/link'

const NavbarClient = () => {
     const { logout } = useContext(AuthContext)

  return (
        <>
            <Link href="/profile" passHref legacyBehavior>
            <Button color="inherit">Perfil</Button>
            </Link>
            <Link href="/" passHref legacyBehavior>
            <Button color="inherit">Livros</Button>
            </Link>
            <Link href="/emprestimos" passHref legacyBehavior>
            <Button color="inherit">Emprestimos</Button>
            </Link>
            <Button color="inherit" onClick={logout}>
            Logout
            </Button>
        </>
  )
}

export default NavbarClient