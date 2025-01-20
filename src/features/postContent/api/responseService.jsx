import axios from "axios";

const API_URL = "http://localhost:8080";

export const getRespostasByComentario = async (idComentario) => {
  try {
    const response = await axios.get(`${API_URL}/respostas/${idComentario}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar respostas do comentário ${idComentario}:`, error);
    throw error;
  }
};
export const createResposta = async (idComentario, resposta) => {
  try {
    const token = localStorage.getItem("token"); 
    const idusuario = localStorage.getItem("idusuario"); 

    if (!idusuario) {
      throw new Error("Usuário não autenticado. ID não encontrado.");
    }

    const response = await axios.post(
      `${API_URL}/respostas/${idComentario}`,
      {
        idUsuario: parseInt(idusuario),
        conteudo: resposta.conteudo,  
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error(`Erro ao criar resposta para o comentário ${idComentario}:`, error);

    throw error;
  }
};