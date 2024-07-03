import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [fullname, setFullname] = useState('');
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(JSON.parse(storedUserId));
    }
  }, []);

  const login = (userId) => {
    setUserId(userId);
    localStorage.setItem('userId', JSON.stringify(userId));
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const usersResponse = await axios.get(`http://localhost:9999/users/${userId}`);
        const rolesResponse = await axios.get(`http://localhost:9999/roles`);

        const user = usersResponse.data;
        const userRole = rolesResponse.data.find(role => role.id == user.roleID);

        setFullname(user.fullname);
        setRoleName(userRole.roleName);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, login, logout, fullname, roleName }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
