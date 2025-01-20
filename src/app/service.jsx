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

