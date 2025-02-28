import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Button } from '@mui/material'
import Link from 'next/link'

const NavbarAdmin = () => {
     const { logout } = useContext(AuthContext)

  return (
        <>
            <Link href="/profile" passHref legacyBehavior>
                <Button color="inherit">Perfil</Button>
            </Link>
            {/* <Link href="/emprestimos" passHref legacyBehavior>
                <Button color="inherit">Emprestimos</Button>
            </Link> */}
            <Link href="/admin" passHref legacyBehavior>
                <Button color="inherit">Área Administrativa</Button>
            </Link>
            
            <Button color="inherit" onClick={logout}>
                Logout
            </Button>
        </>
  )
}

export default NavbarAdmin