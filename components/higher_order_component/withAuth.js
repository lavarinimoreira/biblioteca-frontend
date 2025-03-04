import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

export function withAuth(WrappedComponent, requiredPermission) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
      if (!loading) {
        if (!user || (requiredPermission && !user.permissoes?.includes(requiredPermission))) {
          router.push('/access-denied');
        }
      }
    }, [user, loading, router, requiredPermission]);

    if (loading || !user || (requiredPermission && !user.permissoes?.includes(requiredPermission))) {
      return null; // ou um spinner de carregamento
    }

    return <WrappedComponent {...props} />;
  };
}
