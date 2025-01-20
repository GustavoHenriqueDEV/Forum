import axios from "axios";

const API_URL = "http://localhost:8080";

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