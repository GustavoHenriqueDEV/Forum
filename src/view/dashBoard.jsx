import { useEffect, useState } from "react";
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
  Fab,
  Autocomplete,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

import CommentIcon from "@mui/icons-material/Comment";
import {
  getPosts,
  createPosts,
  getComentariosByPost,
  createComentario,
  incrementLikes,
} from "../service/service"; // Ajuste o

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState(null);
  const [coments, setComents] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [openComments, setOpenComments] = useState({});
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
        tipo: value.title,
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

  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    {
      title: "The Lord of the Rings: The Return of the King",
      year: 2003,
    },
  ];

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        backgroundColor: "#1E252B",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Grid sx={{ justifyContent: "center" }} container spacing={10}>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <Box
              sx={{
                height: 86,
                width: 785,
                flex: 1,
                backgroundColor: "#262D34",
                padding: 1,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 46,
                  width: 553,
                  mt: 1.3,
                  ml: 2,
                  backgroundColor: "#2C353D",
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
                sx={{
                  backgroundColor: "#FF6934",
                  marginLeft: 2,
                  mt: 1.2,
                  borderRadius: 4,
                  height: 61,
                  width: 142,
                  fontSize: 15,
                  fontWeight: "bold",
                  fontFamily: "Rubik, sans-serif",
                  textTransform: "none",
                }}
              >
                Create Post
              </Button>
            </Box>

            <Dialog
              sx={{
                "& .MuiDialog-paper": {
                  width: "80%",
                  backgroundColor: "#262D34",
                  color: "white",
                  height: "70%",
                  borderRadius: "16px",
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
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      setValue({
                        title: newValue,
                      });
                    } else if (newValue && newValue.inputValue) {
                      setValue({
                        title: newValue.inputValue,
                      });
                    } else {
                      setValue(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => inputValue === option.title
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="free-solo-with-text-demo"
                  options={top100Films}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.title;
                  }}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option.title}
                      </li>
                    );
                  }}
                  sx={{ color: "white", width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Qual o conteúdo do post?"
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "white" },
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
                    />
                  )}
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
          {posts.map((post) => (
            <Card
              key={post.idpost}
              sx={{
                backgroundColor: "#262D34",
                borderRadius: 4,
                marginBottom: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: " space-between" }}>
                  <Typography sx={{ color: "#FFF", fontWeight: "bold" }}>
                    {post.titulo}
                  </Typography>
                  <Button onClick={() => handleLike(post.idpost)}>
                    <IconButton>
                      <Badge badgeContent={post.likes} color="error">
                        <FavoriteIcon sx={{ color: "white" }} />
                      </Badge>
                    </IconButton>
                  </Button>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 1 }}
                >
                  <Avatar sx={{ marginRight: 1 }} />
                  <Typography sx={{ color: "#AAA" }}>
                    {post.nome ? post.nome : "Usuário desconhecido"} •
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", marginTop: 2, gap: 2 }}>
                  <Box>
                    <Typography sx={{ color: "#FFF", flex: 1 }}>
                      {post.conteudo}
                    </Typography>

                    <Fab
                      sx={{
                        fontSize: "12px",
                        mt: "3px",
                        mr: "5px",
                        width: "80px",
                      }}
                      variant="extended"
                    >
                      {post.tipo}
                    </Fab>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#444",
                      ml: "40px",
                      width: "550px", // Largura fixa da imagem
                      height: "250px", // Altura fixa da imagem
                    }}
                  >
                    <img
                      src="https://via.placeholder.com/250"
                      alt="Ilustração do Post"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  {/* Botões de interação */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <IconButton onClick={() => toggleComments(post.idpost)}>
                      <CommentIcon sx={{ color: "#FFF" }} />
                    </IconButton>
                  </Box>
                </Box>

                {openComments[post.idpost] && (
                  <Box
                    sx={{
                      marginTop: 2,
                      backgroundColor: "#333",
                      borderRadius: 2,
                      padding: 2,
                    }}
                  >
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
                      placeholder="Escreva um comentário..."
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
