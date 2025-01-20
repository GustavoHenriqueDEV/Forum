// src/dashboard/api/postsCrd.js
import axios from "axios";

const API_URL = "http://localhost:8080";

export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
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

// src/dashboard/api/postsCrd.js
export const createPostApi = async (post) => {
  try {
    console.log("Dados enviados para criação de post:", post); // Log para depuração
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/posts`, post, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Certifique-se de que o backend retorna o post criado com todos os campos necessários
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    throw error;
  }
};

export const incrementLikes = async (idpost, idusuario) => {
  try {
    console.log(
      `Enviando like para o post ${idpost} pelo usuário ${idusuario}`
    );
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/posts/${idpost}/likes?idusuario=${idusuario}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Resposta do servidor após dar like:", response.data);
    return response.data.likes; // Certifique-se de que o backend retorna o número atualizado de likes
  } catch (error) {
    console.error("Erro no serviço de likes:", error);
    throw error;
  }
};
