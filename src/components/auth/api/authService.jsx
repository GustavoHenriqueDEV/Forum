import axios from "axios";

const API_URL = "http://localhost:8080";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const getUserById = async (idusuario) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/usuarios/${idusuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${idusuario}:`, error);
    throw error;
  }
};
