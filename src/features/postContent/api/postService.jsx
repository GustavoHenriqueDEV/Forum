import axios from "axios";

const API_URL = "http://localhost:8080";

export const getComentariosByPost = async (idpost) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${idpost}/comentarios`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários do post ${idpost}:`, error);
    throw error;
  }
};
export const createComentario = async (idpost, comentario) => {
  try {
    const token = localStorage.getItem("token"); 
    const idusuario = localStorage.getItem("idusuario"); 

    if (!idusuario) {
      throw new Error("Usuário não autenticado. ID não encontrado.");
    }

    const response = await axios.post(
      `${API_URL}/posts/${idpost}/comentarios`,
      {
        ...comentario,
        usuario: { idusuario: parseInt(idusuario) }, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Erro ao criar comentário no post ${idpost}:`, error);
    throw error;
  }
};

export const getPostById = async (id) => {
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