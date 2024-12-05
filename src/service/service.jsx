import axios from 'axios';

const API_URL = 'http://localhost:8080/posts';

// Função GET para buscar os posts
export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;  // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    throw error;  // Você pode lançar o erro para tratamento no componente
  }
};

// Função POST para criar um novo post
export const createPosts = async (post) => {
  try {
    const response = await axios.post(`${API_URL}`, post, {
      headers: {
        'Content-Type': 'application/json',  // Define o tipo de conteúdo
        // 'Authorization': 'Bearer seu_token_aqui', // Caso precise de autenticação
      }
    });
    return response.data;  // Retorna os dados do novo post criado
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error;  // Lança erro para que o componente possa tratar
  }
};
