import { getPosts } from "../api/mostViewed";
import { useQuery } from "@tanstack/react-query";

export const useMostViwedPosts = () => {
  const fetchPosts = async () => {
    const postsData = await getPosts();
    return postsData.map((p) => ({
      ...p,
      data_criacao: p.data_criacao ? formatToISO(p.data_criacao) : null,
    }));
  };

  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return {
    posts,
  };
};
