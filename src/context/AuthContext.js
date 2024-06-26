import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    // Lấy giá trị từ LocalStorage khi khởi tạo
    const savedRole = localStorage.getItem('role');
    return savedRole ? JSON.parse(savedRole) : null;
  });

  useEffect(() => {
    // Lưu giá trị vào LocalStorage khi role thay đổi
    if (role) {
      localStorage.setItem('role', JSON.stringify(role));
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const login = (role) => {
    setRole(role);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
