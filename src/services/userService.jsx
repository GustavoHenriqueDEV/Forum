import axios from "axios";

const API_URL = "http://localhost:8080";

export const getUserById = async (idusuario) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/usuarios/${idusuario}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${idusuario}:`, error);
    return { nome: "Usuário desconhecido" };
  }
};

export const getPostsByUser = async (idusuario) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/usuarios/${idusuario}/posts`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts do usuário:", error);
    throw error;
  }
};

export const updateUser = async (idusuario, userData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/usuarios/${idusuario}`, userData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};
