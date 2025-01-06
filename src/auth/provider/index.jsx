import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {jwtDecode} from 'jwt-decode';
import AuthContext from '../context';
import { axios } from '../../api';

const AuthProvider = ({ children }) => {
  const token = window.localStorage.getItem('token');
  const storedClienteId = window.localStorage.getItem('clienteId');
  const [user, setUser] = useState(token ? { token } : null);
  const [clienteId, setClienteId] = useState(storedClienteId || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ token, nome: decoded?.nome, admin: decoded?.admin, id: decoded?.user_id });
    }
  }, [token]);

  const redirectUsers = useCallback((user) => {
    const adminRoutes = ['/admin'];
    const authenticatedRoutes = ['/dashboard', '/admin'];
    if (!user && authenticatedRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/login', { state: { redirect: window.location.hash.slice(1) } });
    }
    if (user?.admin === true && !adminRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/admin');
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
        loading,
        setLoading,
        clienteId,
        setClienteId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
