import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../../postContent/api/postService";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../../../components/sideBar/sideBar";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "../../../../AuthProvider";
import { useComments } from "../hooks/useComments";

export default function PostContent() {
  const { idpost } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    comments,
    respostasPorComentario,
    newComment,
    setNewComment,
    fetchComments,
    handleCreateComment,
    handleToggleRespostas,
    handleChangeNovaResposta,
    handleCreateResposta,
  } = useComments(idpost, user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postData = await getPostById(idpost);
        setPost(postData);
        await fetchComments();
      } catch (error) {
        console.error("Erro ao carregar o post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idpost]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#17202a",
        }}
      >
        <Typography sx={{ color: "#FFF" }}>Carregando...</Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#17202a",
        }}
      >
        <Typography sx={{ color: "#FFF" }}>Nenhum post encontrado.</Typography>
      </Box>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        paddingTop: "64px",
        backgroundColor: "#17202a",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#FFF",
        }}
      >
        {/* Botão de Voltar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: "#FFF",
              backgroundColor: "#2A2F38",
              marginRight: "10px",
              ":hover": { backgroundColor: "#1E252B" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: "#FFF" }}>
            Voltar para Dashboard
          </Typography>
        </Box>

        {/* Conteúdo do Post */}
        <Box
          sx={{
            width: "80%",
            maxWidth: "900px",
            backgroundColor: "#2A2F38",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#00D1B2",
            }}
          >
            {post.titulo}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "20px",
              color: "#B8C5C9",
              lineHeight: 1.8,
              textAlign: "justify",
            }}
          >
            {post.conteudo}
          </Typography>
          {post.imagembase64 && (
            <Box
              component="img"
              src={`data:image/png;base64,${post.imagembase64}`}
              alt="Imagem do Post"
              sx={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "2px solid #444",
              }}
            />
          )}
          <Box sx={{ borderBottom: "2px solid #444", marginBottom: "20px" }} />
          <CommentsSection
            comments={comments}
            user={user}
            respostasPorComentario={respostasPorComentario}
            handleToggleRespostas={handleToggleRespostas}
            handleChangeNovaResposta={handleChangeNovaResposta}
            handleCreateResposta={handleCreateResposta}
            handleCreateComment={handleCreateComment}
            newComment={newComment}
            setNewComment={setNewComment}
          />
        </Box>
      </Box>
    </div>
  );
}
