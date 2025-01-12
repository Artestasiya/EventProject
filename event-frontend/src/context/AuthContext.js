import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user); // ������ ������������
        })
        .catch((err) => {
          const message = err.response
            ? err.response.data.message
            : 'Failed to retrieve user data';
          setError(message);
        });
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token); // ��������� �����
      setUser(user); // ������������� ������������
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login error');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {error && <div>{error}</div>}
      {children}
    </AuthContext.Provider>
  );
};
