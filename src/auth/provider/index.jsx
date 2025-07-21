import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {jwtDecode} from 'jwt-decode';
import AuthContext from '../context';

const AuthProvider = ({ children }) => {
  const token = window.localStorage.getItem('token');
  const storedUser = window.localStorage.getItem('user');
  const storedClienteId = window.localStorage.getItem('clienteId');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [clienteId, setClienteId] = useState(storedClienteId || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded && decoded?.user_id) {
        setUser({ token, nome: decoded?.nome, admin: decoded?.admin, id: decoded?.user_id, cliente: decoded?.cliente });
      }
    }
  }, [token]);

  const redirectUsers = useCallback((user) => {
    const adminRoutes = ['/admin'];
    const authenticatedRoutes = ['/dashboard', '/admin'];
    if (!user && authenticatedRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/login', { state: { redirect: window.location.hash.slice(1) } });
    }
    if (user?.admin === true && !adminRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/admin/app');
    }
    if (user?.admin === false && adminRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/dashboard');
    }

    return null
  }, [navigate])

  useEffect(() => {
    redirectUsers(user)
  }, [user, redirectUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        clienteId,
        setClienteId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
