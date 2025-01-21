import { getPosts } from "../api/mostViewed"; // Função para buscar posts
import { useQuery } from "@tanstack/react-query";

export const useMostViwedPosts = () => {
  const fetchPosts = async () => {
    const postsData = await getPosts();

    // Ordena os posts por curtidas (likes) em ordem decrescente
    return postsData
      .map((p) => ({
        ...p,
        data_criacao: p.data_criacao
          ? new Date(p.data_criacao).toISOString()
          : null,
      }))
      .sort((a, b) => b.likes - a.likes); // Ordenação decrescente
  };

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mostViewedPosts"],
    queryFn: fetchPosts,
  });

  return {
    posts,
    isLoading,
    error,
  };
};
