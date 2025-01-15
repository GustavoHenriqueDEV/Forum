import axios from "axios";

const API_URL = "http://localhost:8080";

/*  
  =============================
  = Rotas que NÃO exigem token =
  =============================

  - getPosts            (ver todos os posts)
  - getPostById         (ver um post específico)
  - getComentariosByPost (ver comentários de um post)
  - getRespostasByComentario (ver respostas de um comentário)
*/

/**
 * Função GET para buscar todos os posts (rota pública, NÃO precisa token).
 */
export const getPosts = async () => {
  try {
    // Faz a requisição diretamente, sem headers de Authorization
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    throw error;
  }
};

/**
 * Função GET para buscar um post específico (rota pública, NÃO precisa token).
 */
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

/**
 * Função GET para buscar comentários de um post (rota pública, NÃO precisa token).
 */
export const getComentariosByPost = async (idpost) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${idpost}/comentarios`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários do post ${idpost}:`, error);
    throw error;
  }
};

/**
 * Função GET para buscar respostas de um comentário específico (rota pública, NÃO precisa token).
 * (Se no back-end você tiver configurado /respostas/{idComentario} como pública)
 */
export const getRespostasByComentario = async (idComentario) => {
  try {
    const response = await axios.get(`${API_URL}/respostas/${idComentario}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar respostas do comentário ${idComentario}:`, error);
    throw error;
  }
};

/*  
  ================================
  = Rotas que EXIGEM autenticação =
  ================================

  - createPosts         (criar post)
  - createComentario    (comentar post)
  - incrementLikes      (dar like em post)
  - createResposta      (criar resposta a comentário)
  - deletePost          (deletar post)
  - getUserById         (dependendo do back, pode ou não precisar de token)
*/

// Função POST para criar um novo post (rota protegida)
export const createPosts = async (post) => {
  try {
    const token = localStorage.getItem("token");
    // Exige token
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

// Função GET para buscar usuário por ID (depende se rota é protegida no back)
export const getUserById = async (idusuario) => {
  try {
    const token = localStorage.getItem("token");
    // Se no back-end esse endpoint for protegido, mantenha o Authorization
    // Caso não seja, remova esta parte
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

// Função POST para login (rota pública, não precisa token)
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

// Função para registrar um novo usuário (rota pública, não precisa token)
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

// Função POST para adicionar um comentário a um post (rota protegida)
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

// Função POST para incrementar likes em um post (rota protegida)
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

// Função POST para adicionar uma resposta a um comentário (rota protegida)
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

// Função DELETE para deletar um post (rota protegida)
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
