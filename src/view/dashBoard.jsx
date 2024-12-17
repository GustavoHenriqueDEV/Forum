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
import {
  getPosts,
  createPosts,
  getComentariosByPost,
  createComentario,
  incrementLikes,
} from "../service/service"; // Ajuste o
import { color } from "@mui/system";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [coments, setComents] = useState([]);
  const [likes, setLikes] = useState(posts.likes);
  const [newComment, setNewComment] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [userName, setUserName] = useState("");
  const [newPost, setNewPost] = useState({
    titulo: "",
    tipo: "",
    usuario: {
      idusuario: "",
    },
    conteudo: "",
    likes: 0,
  });

  const handleLike = async (idpost) => {
    const idusuarioLocal = localStorage.getItem("idusuario"); // Obtém o ID do usuário autenticado
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const updatedLikes = await incrementLikes(
        idpost,
        parseInt(idusuarioLocal)
      ); // Passa o ID do usuário
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.idpost === idpost ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (error) {
      alert("Erro ao incrementar likes. Tente novamente mais tarde.");
      console.error("Erro ao dar like:", error);
    }
  };

  const toggleComments = (id) => {
    const isOpen = openComments[id] || false;
    setOpenComments((prevState) => ({
      ...prevState,
      [id]: !isOpen,
    }));

    // Apenas busca comentários se ainda não foi aberto
    if (!isOpen && !coments[id]) {
      fetchComent(id);
    }
  };

  const fetchComent = async (idpost) => {
    try {
      const comentData = await getComentariosByPost(idpost);
      setComents((prevState) => ({
        ...prevState,
        [idpost]: comentData,
      })); // Armazena comentários por ID do post
    } catch (error) {
      console.error(`Erro ao buscar comentários para o post ${idpost}:`, error);
    }
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

      setPosts((prevPosts) => [...prevPosts, createdPost]);
      // Limpa o formulário
      setNewPost({
        titulo: "",
        tipo: "",
        conteudo: "",
        usuario: { idusuario: "" },
        likes: 0,
      });
      setOpen(false);
      const fetchPosts = async () => {
        try {
          const postsData = await getPosts();
          setPosts(postsData);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
      // Fecha o modal
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Ocorreu um erro ao criar o post.");
    }
  };
  const handleCreateComment = async (idpost) => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const comentario = {
        conteudo: newComment[idpost],
        usuario: { idusuario: parseInt(idusuarioLocal) },
      };

      const createdComment = await createComentario(idpost, comentario);
      setComents((prevState) => ({
        ...prevState,
        [idpost]: [...(prevState[idpost] || []), createdComment],
      }));
      setNewComment((prevState) => ({
        ...prevState,
        [idpost]: "",
      }));

      // Atualiza o post na lista
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.idpost === idpost
            ? {
                ...post,
                comentarios: [...(post.comentarios || []), createdComment],
              }
            : post
        )
      );
      fetchComent(idpost);
    } catch (error) {
      console.error(`Erro ao criar comentário no post ${idpost}:`, error);
      alert("Erro ao publicar comentário.");
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      try {
        const localName = localStorage.username;
        setUserName(localName);
      } catch (error) {
        console.error("Erro ao buscar o nome", error);
      }
    };
    fetchName;
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        backgroundColor: "#1E1E2F",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Grid sx={{ justifyContent: "center" }} container spacing={10}>
        {/* Coluna Central */}
        <Grid item xs={6}>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              color: "white",
              alignContent: "center",
            }}
          >
            Lista de Posts
          </h1>

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
                  <Avatar sx={{ marginRight: 1 }}></Avatar>
                  <Typography sx={{ color: "#AAA" }}>
                    {post.nome ? post.nome : "Usuário desconhecido"} •
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
                    <Button onClick={() => handleLike(post.idpost)}>
                      <IconButton>
                        <Badge badgeContent={post.likes} color="error">
                          <FavoriteIcon sx={{ color: "#FF6F00" }} />
                        </Badge>
                      </IconButton>
                    </Button>
                    <IconButton onClick={() => toggleComments(post.idpost)}>
                      <CommentIcon sx={{ color: "#FFF" }} />
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
                    <Typography
                      sx={{ color: "#FFF", marginBottom: 1 }}
                    ></Typography>
                    {coments[post.idpost]?.length > 0 ? (
                      <ul style={{ padding: "0px" }}>
                        {coments[post.idpost].map((comentario) => (
                          <li
                            style={{
                              marginBottom: "15px",
                              listStyle: "none",
                              color: "white",
                            }}
                            key={comentario.idcomentario}
                          >
                            {" "}
                            {comentario.usuario?.nome || "Usuário desconhecido"}
                            : {comentario.conteudo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography sx={{ color: "#AAA" }}>
                        Nenhum comentário.
                      </Typography>
                    )}
                    <TextField
                      placeholder="Write a comment..."
                      variant="outlined"
                      fullWidth
                      value={newComment[post.idpost] || ""}
                      onChange={(e) =>
                        setNewComment((prevState) => ({
                          ...prevState,
                          [post.idpost]: e.target.value,
                        }))
                      }
                      sx={{
                        marginTop: 1,
                        backgroundColor: "#555",
                        borderRadius: 1,
                        input: { color: "#FFF" },
                      }}
                    />
                    <Button
                      onClick={() => handleCreateComment(post.idpost)}
                      variant="contained"
                      sx={{ backgroundColor: "#FF6F00", marginTop: 1 }}
                    >
                      Publicar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
