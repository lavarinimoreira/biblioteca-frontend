import { GlobalStyles } from '@mui/material';
import Providers from './providers';
import { AuthProvider } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'

export const metadata = {
  title: "Biblioteca",
  description: "Frontend para consumir a API-biblioteca",
  name: "viewport",
  content: "initial-scale=1, width=device-width"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <GlobalStyles styles={{
          body: {
            // margin: 0,
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
            // minHeight: '100vh'
          }
        }} />
        <Providers>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
