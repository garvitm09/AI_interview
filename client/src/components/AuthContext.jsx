import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('loggedInUser');
    const email = localStorage.getItem('userEmail');
    
    if (token && email && email) {
      setIsAuthenticated(true);
      setUserInfo({ name, email });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
