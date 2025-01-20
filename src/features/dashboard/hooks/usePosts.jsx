import { useState, useEffect } from "react";
import {
  getPosts,
  createPostApi,
  deletePost,
  incrementLikes,
} from "../../dashboard/api/postsCrd";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const postsData = await getPosts();
      const formattedPosts = postsData.map((p) => ({
        ...p,
        data_criacao: p.data_criacao ? formatToISO(p.data_criacao) : null,
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      setFeedbackMessage("Erro ao buscar posts.");
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (newPostData) => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      throw new Error("Usuário não autenticado!");
    }
    try {
      const createdPost = await createPostApi({
        ...newPostData,
        usuario: { idusuario: parseInt(idusuarioLocal) },
      });

      // Adicionar o novo post ao estado local
      setPosts((prev) => [createdPost, ...prev]); // O novo post aparece no topo
      setFeedbackMessage("Post criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar post:", error);
      throw new Error("Ocorreu um erro ao criar o post.");
    }
  };

  const removePost = async (idpost) => {
    try {
      await deletePost(idpost);
      setPosts((prev) => prev.filter((p) => p.idpost !== idpost));
      setFeedbackMessage("Post deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar o post:", error);
      setFeedbackMessage("Erro ao deletar o post.");
    }
  };

  const likePost = async (idpost) => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      throw new Error("Usuário não autenticado!");
    }
    try {
      const updatedLikes = await incrementLikes(
        idpost,
        parseInt(idusuarioLocal)
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.idpost === idpost ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (error) {
      console.error("Erro ao dar like:", error);
      throw new Error("Erro ao incrementar likes.");
    }
  };

  const formatToISO = (dateString) => {
    if (!dateString) return null;
    return dateString.replace(" ", "T") + "Z";
  };

  return {
    posts,
    feedbackMessage,
    isLoading,
    fetchPosts,
    createPost,
    removePost,
    likePost,
    setFeedbackMessage,
  };
};
