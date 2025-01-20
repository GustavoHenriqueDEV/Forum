import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  createPostApi,
  deletePost,
  incrementLikes,
} from "../../dashboard/api/postsCrd";

const formatToISO = (dateString) => {
  if (!dateString) return null;
  return dateString.replace(" ", "T") + "Z";
};

export const usePosts = () => {
  const queryClient = useQueryClient();

  const fetchPosts = async () => {
    const postsData = await getPosts();
    return postsData.map((p) => ({
      ...p,
      data_criacao: p.data_criacao ? formatToISO(p.data_criacao) : null,
    }));
  };

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  const createPostMutation = useMutation({
    mutationFn: createPostApi,
    onSuccess: (newPost) => {
      console.log("Post criado com sucesso:", newPost);
      // Opção 1: Atualizar o cache manualmente
      queryClient.setQueryData(["posts"], (old) => [newPost, ...(old || [])]);

      // Opção 2: Invalidate e refetch
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      console.error("Erro ao criar post:", error);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (_, idpost) => {
      queryClient.setQueryData(["posts"], (old) =>
        old.filter((post) => post.idpost !== idpost)
      );
    },
    onError: (error) => {
      console.error("Erro ao deletar o post:", error);
    },
  });

  const likePostMutation = useMutation({
    mutationFn: ({ idpost, idusuario }) => incrementLikes(idpost, idusuario),
    onSuccess: (updatedLikes, variables) => {
      const { idpost } = variables;
      console.log(`Likes atualizados para o post ${idpost}: ${updatedLikes}`);
      queryClient.setQueryData(["posts"], (old) =>
        old.map((post) =>
          post.idpost === idpost ? { ...post, likes: updatedLikes } : post
        )
      );
      // Invalidando query para dar certo
      queryClient.invalidateQueries(["posts"]);
      console.log(
        "Dados no cache após dar like:",
        queryClient.getQueryData(["posts"])
      );
    },
    onError: (error) => {
      console.error("Erro ao dar like:", error);
    },
  });
  return {
    posts,
    isLoading,
    isError,
    error,
    refetch,
    createPost: createPostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    likePost: likePostMutation.mutateAsync,
  };
};
