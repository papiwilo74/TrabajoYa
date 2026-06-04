import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión desde localStorage al iniciar la app
    try {
      const savedToken = localStorage.getItem('trabajoya-token');
      const savedUser = localStorage.getItem('trabajoya-user');
      if (savedToken && savedUser) {
        const decodedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(decodedUser);
        setRole(decodedUser.role);
      }
    } catch (e) {
      console.error('Error restaurando sesión:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? 'Error al iniciar sesión.');
    }

    setToken(data.token);
    setUser(data.user);
    setRole(data.user.role);

    localStorage.setItem('trabajoya-token', data.token);
    localStorage.setItem('trabajoya-user', JSON.stringify(data.user));
    
    return data.user;
  };

  const register = async (name, email, password, role) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? 'Error al registrarse.');
    }

    // Auto-login al registrarse si el backend devuelve sesión
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      localStorage.setItem('trabajoya-token', data.token);
      localStorage.setItem('trabajoya-user', JSON.stringify(data.user));
    }
    
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('trabajoya-token');
    localStorage.removeItem('trabajoya-user');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
