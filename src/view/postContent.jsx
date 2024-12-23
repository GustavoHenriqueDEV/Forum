import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../service/service"; // Supondo que você tenha esse endpoint

export default function PostContent() {
  const { idpost } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(idpost);
        setPost(postData);
      } catch (error) {
        console.error("Erro ao carregar o post:", error);
      }
    };
    fetchPost();
  }, [idpost]);

  if (!post) {
    return <div>Carregando...</div>;
  }
  return (
    <div style={{ padding: "20px", backgroundColor: "#1E252B", color: "#FFF" }}>
      <h1>{post.titulo}</h1>
      <p>{post.conteudo}</p>
      <img
        src={`data:image/png;base64,${post.imagembase64}`}
        alt={post.titulo}
        style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
      />
      <p>{`Likes: ${post.likes}`}</p>
    </div>
  );
}
