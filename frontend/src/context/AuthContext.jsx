import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error("Failed to load user profile:", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  };

  const adminLogin = async (email, password) => {
    const response = await api.post('/auth/admin-login', { email, password });
    const { access_token, user: userData } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const updateProfile = async (name, email, password) => {
    const payload = { name, email };
    if (password) payload.password = password;
    const response = await api.put('/auth/profile', payload);
    const { user: updatedUser } = response.data;
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, register, updateProfile, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
