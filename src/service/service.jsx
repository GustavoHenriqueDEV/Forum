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
    console.error("Erro ao buscar o post especifico", error);
    throw error;
  }
};

export const getComentariosByPost = async (idpost) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${idpost}/comentarios`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários do post ${idpost}:`, error);
    throw error;
  }
};


export const getRespostasByComentario = async (idComentario) => {
  try {
    const response = await axios.get(`${API_URL}/respostas/${idComentario}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar respostas do comentário ${idComentario}:`, error);
    throw error;
  }
};


export const createPosts = async (post) => {
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

export const getUserById = async (idusuario) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/users/${idusuario}`, {
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

export const createComentario = async (idpost, comentario) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/posts/${idpost}/comentarios`,
      comentario,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar comentário no post ${idpost}:`, error);
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

export const createResposta = async (idComentario, resposta) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/respostas/${idComentario}`, resposta, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar resposta para o comentário ${idComentario}:`, error);
    throw error;
  }
};

export const deletePost = async (idPost) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/posts/${idPost}`, {
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
