import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, getComentariosByPost, createComentario } from "../service/service";
import FavoriteIcon from "@mui/icons-material/Favorite";

import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  IconButton,
  Badge, 
} from "@mui/material";

export default function PostContent() {
  const { idpost } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [openComments, setOpenComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(idpost);
        setPost(postData);

        const commentsData = await getComentariosByPost(idpost);
        setComments(commentsData);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        setError("Não foi possível carregar os dados do post e comentários.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idpost]);

  const handleToggleComments = () => {
    setOpenComments(!openComments);
  };

  const handleCreateComment = async () => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const comentario = {
        conteudo: newComment,
        usuario: { idusuario: parseInt(idusuarioLocal) },
      };

      const createdComment = await createComentario(idpost, comentario);
      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      alert("Erro ao publicar comentário.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor="#2A2F38"
      >
        <CircularProgress style={{ color: "#00D1B2" }} />
        <Typography mt={2} style={{ color: "#FFF" }}>
          Carregando...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={3} bgcolor="#2A2F38" borderRadius={2}>
        <Typography style={{ color: "#FF6B6B" }}>{error}</Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box textAlign="center" p={3} bgcolor="#2A2F38" borderRadius={2}>
        <Typography style={{ color: "#FFF" }}>Nenhum post encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Box
      p={3}
      maxWidth={800}
      mx="auto"
      bgcolor="#2A2F38"
      boxShadow={3}
      borderRadius={2}
      color="#FFF"
    >
      <Typography
        sx={{
          fontFamily: "Rubik, sans-serif",

        }}
        variant="h4"
        gutterBottom
        textAlign="center"
        style={{ color: "#00D1B2" }}
      >
        {post.titulo || "Sem título"}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Rubik, sans-serif",

        }}
        variant="body1"
        gutterBottom
        style={{ color: "#D4D4D4", textAlign: "justify" }}
      >
        {post.conteudo || "Conteúdo indisponível"}
      </Typography>
      {post.imagembase64 && (
        <Box
          component="img"
          src={`data:image/png;base64,${post.imagembase64}`}
          alt={post.titulo || "Imagem do post"}
          width="100%"
          maxHeight={400}
          borderRadius={2}
          mb={2}
          sx={{ objectFit: "cover", border: "2px solid #444" }}
        />
      )}

<Button onClick={(e) => { 
                    e.stopPropagation();
                    handleLike(post.idpost)
                    }}>
                    <IconButton   >
                      <Badge badgeContent={post.likes} color="error">
                        <FavoriteIcon sx={{  color: "white" }} />
                      </Badge>
                    </IconButton>
                  </Button>   
      <Typography variant="subtitle1" style={{ color: "#00D1B2" }}>
      </Typography>
      <Button
        variant="contained"
        style={{
          backgroundColor: "#00D1B2",
          color: "#FFF",
          marginTop: "20px",
        }}
        onClick={handleToggleComments}
      >
        {openComments ? "Ocultar Comentários" : "Mostrar Comentários"}
      </Button>

      {openComments && (
        <Box mt={4} bgcolor="#1E252B" p={3} borderRadius={2}>
          <Typography variant="h5" style={{ color: "#00D1B2" }} gutterBottom>
            Comentários
          </Typography>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Paper
                key={comment.id}
                elevation={2}
                style={{
                  backgroundColor: "#2A2F38",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >
                <Typography style={{ color: "#FFF", fontWeight: "bold" }}>
                  {comment.usuario?.nome || "Anônimo"}:
                </Typography>
                <Typography style={{ color: "#D4D4D4" }}>
                  {comment.conteudo || "Sem conteúdo"}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography style={{ color: "#D4D4D4", fontStyle: "italic" }}>
              Nenhum comentário ainda.
            </Typography>
          )}
          <Box mt={2} display="flex" gap={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                backgroundColor: "#2A2F38",
                color: "#FFF",
                borderRadius: "8px",
              }}
              InputProps={{
                style: { color: "#FFF" },
              }}
            />
            <Button
              variant="contained"
              style={{
                backgroundColor: "#00D1B2",
                color: "#FFF",
              }}
              onClick={handleCreateComment}
            >
              Publicar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
