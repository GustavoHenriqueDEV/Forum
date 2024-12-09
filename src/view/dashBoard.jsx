import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Grid,
  Button,
  Badge,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getPosts, createPosts, adicionarComentario } from "../service/service"; // Ajuste o

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [newPost, setNewPost] = useState({
    titulo: "",
    tipo: "",
    usuario: {
      idusuario: "",
    },
    conteudo: "",
    likes: 0,
    comentario: "",
  });

  const toggleComments = (id) => {
    setOpenComments((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Alterna entre aberto e fechado
    }));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    const idusuarioLocal = localStorage.getItem("idusuario"); // Recupera o ID do usuário
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const createdPost = await createPosts({
        ...newPost,
        usuario: { idusuario: parseInt(idusuarioLocal) }, // Garante que o ID seja um número
      });

      // Atualiza a lista de posts com o novo post
      setPosts((prevPosts) => [...prevPosts, createdPost]);
      // Limpa o formulário
      setNewPost({
        titulo: "",
        tipo: "",
        conteudo: "",
        usuario: { idusuario: "" },
        likes: 0,
        comentario: "",
      });

      setOpen(false); // Fecha o modal
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Ocorreu um erro ao criar o post.");
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDoComent = async (idpost) => {
    const comentario = newPost.comentario; // O texto do novo comentário
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }

    if (!comentario) {
      alert("Digite um comentário antes de publicar.");
      return;
    }

    try {
      const comentarioData = { texto: comentario }; // Se o comentário for um simples texto
      // Você deve criar a função `adicionarComentario` para enviar esse dado
      await adicionarComentario(idpost, comentarioData);
      // Aqui você pode atualizar a lista de comentários do post ou fazer outra ação
      alert("Comentário publicado com sucesso!");
      setNewPost({ ...newPost, comentario: "" }); // Limpar o campo de comentário após enviar
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
      alert("Ocorreu um erro ao adicionar o comentário.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#1E1E2F", minHeight: "100vh", padding: 2 }}>
      <Grid container spacing={2}>
        {/* Coluna Esquerda */}
        <Grid item xs={3}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography
              sx={{ color: "#FFF", fontWeight: "bold", marginBottom: 1 }}
            >
              Newest and Recent
            </Typography>
            <Card sx={{ backgroundColor: "#2C2C3A", padding: 2 }}>
              <Typography sx={{ color: "#FFF" }}>
                Find the latest update
              </Typography>
            </Card>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography
              sx={{ color: "#FFF", fontWeight: "bold", marginBottom: 1 }}
            >
              Popular Tags
            </Typography>
            <Card sx={{ backgroundColor: "#2C2C3A", padding: 2 }}>
              <Typography sx={{ color: "#FFF" }}>#javascript</Typography>
              <Typography sx={{ color: "#FFF" }}>#design</Typography>
            </Card>
          </Box>
        </Grid>

        {/* Coluna Central */}
        <Grid item xs={6}>
          <h1>Lista de Posts</h1>

          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#2C2C3A",
                padding: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ color: "#FFF" }}>
                Share what's on your mind...
              </Typography>
            </Box>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{ backgroundColor: "#FF6F00", marginLeft: 2 }}
            >
              Create Post
            </Button>
            <Dialog
              sx={{
                "& .MuiDialog-paper": {
                  width: "80%",
                  backgroundColor: "#262D34", // Fundo do modal na cor do site
                  color: "white", // Personaliza largura (80% da tela)
                  height: "70%", // Personaliza altura (70% da tela)
                  borderRadius: "16px", // Arredonda as bordas
                },
              }}
              open={open}
              onClose={handleClose}
            >
              <DialogTitle>Create a New Post</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Post Title"
                  type="text"
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                  InputProps={{
                    style: { color: "white", borderColor: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ff8c00",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff8c00",
                      },
                    },
                  }}
                  fullWidth
                  variant="outlined"
                  value={newPost.titulo}
                  onChange={(e) =>
                    setNewPost({ ...newPost, titulo: e.target.value })
                  }
                />
                <TextField
                  margin="dense"
                  label="Post Content"
                  type="text"
                  fullWidth
                  multiline
                  rows={4}
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                  InputProps={{
                    style: { color: "white", borderColor: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ff8c00",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff8c00",
                      },
                    },
                  }}
                  value={newPost.conteudo}
                  onChange={(e) =>
                    setNewPost({ ...newPost, conteudo: e.target.value })
                  }
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} color="primary">
                  Post
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Posts */}

          {posts.map((post) => (
            <Card
              key={post.idpost}
              sx={{ backgroundColor: "#2C2C3A", marginBottom: 2 }}
            >
              <CardContent>
                <Typography sx={{ color: "#FFF", fontWeight: "bold" }}>
                  {post.titulo}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 1 }}
                >
                  <Avatar sx={{ marginRight: 1 }}>P</Avatar>
                  <Typography sx={{ color: "#AAA" }}>
                    {post.nome} • 3 days ago
                  </Typography>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <Typography sx={{ color: "#FFF" }}>
                    {post.conteudo}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <IconButton>
                      <Badge badgeContent={post.likes} color="error">
                        <FavoriteIcon sx={{ color: "#FF6F00" }} />
                      </Badge>
                    </IconButton>
                    <IconButton onClick={() => toggleComments(post.idpost)}>
                      <CommentIcon sx={{ color: "#FFF" }} />
                    </IconButton>
                    <IconButton>
                      <VisibilityIcon sx={{ color: "#FFF" }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Comentários - Renderização Condicional */}
                {openComments[post.idpost] && (
                  <Box
                    sx={{
                      marginTop: 2,
                      backgroundColor: "#333",
                      borderRadius: 2,
                      padding: 2,
                    }}
                  >
                    <Typography sx={{ color: "#FFF", marginBottom: 1 }}>
                      Comments:
                    </Typography>
                    {Array.isArray(post.comentarios) &&
                    post.comentarios.length > 0 ? (
                      post.comentarios.map((comentario, index) => (
                        <Typography
                          key={index}
                          sx={{
                            color: "#AAA",
                            backgroundColor: "#444",
                            padding: 1,
                            borderRadius: 1,
                            marginBottom: 1,
                          }}
                        >
                          {comentario.texto}{" "}
                          {/* Supondo que o comentário tenha a chave 'texto' */}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ color: "#AAA" }}>
                        No comments yet.
                      </Typography>
                    )}
                    {/* Campo para adicionar novo comentário */}
                    <TextField
                      placeholder="Write a comment..."
                      variant="outlined"
                      fullWidth
                      value={newPost.comentario}
                      onChange={(e) =>
                        setNewPost({ ...newPost, comentario: e.target.value })
                      }
                      sx={{
                        marginTop: 1,
                        backgroundColor: "#555",
                        borderRadius: 1,
                        input: { color: "#FFF" },
                      }}
                    />
                    <Button
                      onClick={() => handleDoComent(post.idpost)}
                      variant="contained"
                      sx={{ backgroundColor: "#FF6F00", marginLeft: 0 }}
                    >
                      Publicar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Fim da coluna do meio */}
        {/* Coluna Direita */}
        <Grid item xs={3}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography
              sx={{ color: "#FFF", fontWeight: "bold", marginBottom: 1 }}
            >
              Meetups
            </Typography>
            <Card sx={{ backgroundColor: "#2C2C3A", padding: 2 }}>
              <Typography sx={{ color: "#FFF" }}>
                UIHUT - Crunchbase Company Profile
              </Typography>
            </Card>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <Typography
              sx={{ color: "#FFF", fontWeight: "bold", marginBottom: 1 }}
            >
              Podcasts
            </Typography>
            <Card sx={{ backgroundColor: "#2C2C3A", padding: 2 }}>
              <Typography sx={{ color: "#FFF" }}>Selling a Business</Typography>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
