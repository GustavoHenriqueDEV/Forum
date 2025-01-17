// src/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { getUserById } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const idusuario = localStorage.getItem("idusuario");
      if (idusuario) {
        try {
          const userData = await getUserById(idusuario);
          setUser(userData);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem("idusuario", userData.idusuario);
    localStorage.setItem("username", userData.nome);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};
