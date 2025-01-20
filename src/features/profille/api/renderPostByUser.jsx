import axios from "axios";

const API_URL = "http://localhost:8080";


export const getPostsByUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o post específico:", error);
    throw error;
  }
};