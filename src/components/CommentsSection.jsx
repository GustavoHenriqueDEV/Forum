import React, { useState, useEffect } from "react";
import { Box, Typography, Card, TextField, Button } from "@mui/material";
import { createComentario, getComentariosByPost } from "../service/service"; // Ajuste os imports conforme necessário

export default function CommentsSection({ postId }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // Busca os comentários ao carregar
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComentariosByPost(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    };
    fetchComments();
  }, [postId]);

  // Cria um novo comentário
  const handleCreateComment = async () => {
    if (!newComment) return;

    const commentData = {
      conteudo: newComment,
      tipo: determineCommentType(newComment), // Define tipo do comentário
      usuario: { idusuario: localStorage.getItem("idusuario") }, // Adapte conforme necessário
    };

    try {
      const createdComment = await createComentario(postId, commentData);
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  // Define o tipo do comentário com base no conteúdo
  const determineCommentType = (content) => {
    if (content.includes("?")) return "Open Question";
    if (content.includes("!")) return "Crazy Idea";
    return "Insight";
  };

  return (
    <Box
      sx={{
        position: "relative",
        padding: 3,
        backgroundColor: "#FAF3E0",
        borderRadius: 2,
      }}
    >
      {/* Efeito de desfoque no fundo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
          Comments:
        </Typography>

        {/* Lista de Comentários */}
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Card
              key={index}
              sx={{
                marginTop: 2,
                padding: 2,
                backgroundColor:
                  comment.tipo === "Open Question"
                    ? "#1E3A4C"
                    : comment.tipo === "Crazy Idea"
                    ? "#3E1E4C"
                    : "#4C3A1E",
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#FFF",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: "0.9rem",
                }}
              >
                {comment.tipo}
              </Typography>
              <Typography sx={{ color: "#FFF", marginTop: 1 }}>
                {comment.conteudo}
              </Typography>
            </Card>
          ))
        ) : (
          <Typography sx={{ color: "#AAA", marginTop: 1 }}>
            Nenhum comentário ainda.
          </Typography>
        )}

        {/* Caixa de texto para adicionar novo comentário */}
        <TextField
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            marginTop: 2,
            backgroundColor: "#333",
            borderRadius: 2,
            input: { color: "#FFF" },
          }}
          placeholder="Escreva um comentário..."
          fullWidth
          variant="outlined"
        />
        <Button
          onClick={handleCreateComment}
          variant="contained"
          sx={{
            backgroundColor: "#FF6F00",
            marginTop: 2,
            "&:hover": { backgroundColor: "#FF8F33" },
          }}
        >
          Publicar
        </Button>
      </Box>
    </Box>
  );
}
