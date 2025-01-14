import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, getComentariosByPost, createComentario } from "../service/service";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";

export default function PostContent() {
  const { idpost } = useParams();
  const navigate = useNavigate();
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
    <div
      style={{
        display: "flex",
        paddingTop: "64px",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#17202a",
      }}
    >
    <div style={{ zIndex: 1000, overflow: "hidden", backgroundColor: "#17202a" }}>
  <Sidebar />
</div>

      <Box
        p={3}
        maxWidth={800}
        mx="auto"
        bgcolor="#2A2F38"
        boxShadow={3}
        borderRadius={2}
        color="#FFF"
        
        sx={{ width: "80%" }} // Estilo para o MainContent
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <IconButton sx={{ mr: "4px", color: "#FFF" }} onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{ width: "23px", height: "23px", marginRight: 1 }} />
          {post.usuario.nome || "erro"}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Rubik, sans-serif",
          }}
          variant="body1"
          gutterBottom
          fontSize={20}
          style={{ color: "#F2F4F5", textAlign: "justify" }}
        >
          {post.titulo || "Conteúdo indisponível"}
        </Typography>

        <Typography
          letterSpacing={1}
          fontSize={14}
          variant="body1"
          gutterBottom
          style={{ color: "#B8C5C9", textAlign: "justify" }}
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
        <Box sx={{ borderBottom: "3px solid #444" }} />

        <Button onClick={(e) => e.stopPropagation()}>
          <IconButton>
            <Badge badgeContent={post.likes} color="error">
              <FavoriteIcon sx={{ color: "white" }} />
            </Badge>
          </IconButton>
        </Button>

        <Button
          variant="contained"
          style={{
            backgroundColor: "#00D1B2",
            color: "#FFF",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={handleToggleComments}
        >
          <CommentIcon sx={{ color: "#FFF" }} />
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
    </div>
  );
}
