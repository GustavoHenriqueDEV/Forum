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

export const createPostApi = async (post) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/posts`, post, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
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
        "Authorization": `Bearer ${token}`,
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
    const response = await axios.delete(`${API_URL}/posts/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    throw error;
  }
};

export const incrementLikes = async (idpost, idusuario) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/posts/${idpost}/likes?idusuario=${idusuario}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro no serviço de likes:", error);
    throw error;
  }
};