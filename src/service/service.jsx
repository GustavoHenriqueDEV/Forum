import axios from "axios";

const API_URL = "http://localhost:8080";

// Função GET para buscar os posts
export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    throw error; // Você pode lançar o erro para tratamento no componente
  }
};

// Função POST para criar um novo post
export const createPosts = async (post) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, post, {
      headers: {
        "Content-Type": "application/json", // Define o tipo de conteúdo
        // 'Authorization': 'Bearer seu_token_aqui', // Caso precise de autenticação
      },
    });
    return response.data; // Retorna os dados do novo post criado
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error; // Lança erro para que o componente possa tratar
  }
};

export const getUserById = async (idusuario) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/users/${idusuario}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${idusuario}:`, error);
    return { nome: "Usuário desconhecido" };
  }
};
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_URL}/usuarios/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna o ID do usuário logado
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error; // Lança erro para tratamento no frontend
  }
};

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/usuarios/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna o novo usuário criado
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error; // Lança erro para tratamento no frontend
  }
};
// Buscar comentários de um post específico
export const getComentariosByPost = async (idpost) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${idpost}/comentarios`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários do post ${idpost}:`, error);
    throw error;
  }
};

// Função POST para adicionar um comentário a um post
export const createComentario = async (idpost, comentario) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${idpost}/comentarios`,
      comentario,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Retorna o comentário criado
  } catch (error) {
    console.error(`Erro ao criar comentário no post ${idpost}:`, error);
    throw error;
  }
};
