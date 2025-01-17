// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Button,
  Badge,
  Fab,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageIcon from "@mui/icons-material/Image";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { deletePost, getPosts, createPost, incrementLikes } from "../../services/postService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import AvatarWithInitials from "../../components/common/AvatarWithInitials";

const autocompleteFilter = createFilterOptions();

export default function Dashboard({ searchTerm }) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    titulo: "",
    tipo: "",
    usuario: { idusuario: "" },
    conteudo: "",
    likes: 0,
    imagembase64: "",
    imagem: "",
    data_criacao: "",
  });
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleDelete = async (idpost) => {
    try {
      await deletePost(idpost);
      setPosts((prev) => prev.filter((p) => p.idpost !== idpost));
      setFeedbackMessage("Post deletado com sucesso!");
      setTimeout(() => setFeedbackMessage(""), 3000);
    } catch (error) {
      setFeedbackMessage("Erro ao deletar o post.");
      setTimeout(() => setFeedbackMessage(""), 3000);
      console.error(error);
    }
  };

  const handlePostClick = (idpost) => {
    navigate(`/post/${idpost}`);
  };

  const filteredPosts = posts
    .filter((post) => {
      const hasTitulo =
        post.titulo &&
        post.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const hasTipo =
        post.tipo && post.tipo.toLowerCase().includes(searchTerm.toLowerCase());
      return hasTitulo || hasTipo;
    })
    .filter((post) => {
      if (filterType === "popular") {
        return post.likes >= 10;
      }
      return true;
    });

  const handleLike = async (idpost) => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }
    try {
      const updatedLikes = await incrementLikes(
        idpost,
        parseInt(idusuarioLocal)
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.idpost === idpost ? { ...post, likes: updatedLikes } : post
        )
      );
    } catch (error) {
      alert("Erro ao incrementar likes. Tente novamente mais tarde.");
      console.error("Erro ao dar like:", error);
    }
  };

  function formatToISO(dateString) {
    if (!dateString) return null;
    return dateString.replace(" ", "T") + "Z";
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        const formattedPosts = postsData.map((p) => ({
          ...p,
          data_criacao: p.data_criacao ? formatToISO(p.data_criacao) : null,
        }));
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        setBase64Image(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }
    try {
      const createdPost = await createPost({
        ...newPost,
        tipo: value.title,
        imagem: base64Image,
        usuario: { idusuario: parseInt(idusuarioLocal) },
      });
      setPosts((prev) => [...prev, createdPost]);
      setNewPost({
        titulo: "",
        tipo: "",
        conteudo: "",
        usuario: { idusuario: "" },
        likes: 0,
        imagembase64: "",
      });
      setOpen(false);
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Ocorreu um erro ao criar o post.");
    }
  };

  if (isLoadingFilter) {
    return (
      <Box
        sx={{
          marginTop: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 70px)",
          backgroundColor: "#1E252B",
        }}
      >
        <Typography sx={{ color: "#fff" }}>Carregando...</Typography>
      </Box>
    );
  }

  const options = [
    { title: "Notícias" },
    { title: "Artigos" },
    { title: "Tutoriais" },
    { title: "Opinião" },
    { title: "Revisão/Review" },
    { title: "Análise" },
    { title: "Lista/Ranking" },
    { title: "Guia rápido" },
    { title: "Dicas" },
  ];

  return (
    <div style={{ marginTop: "70px" }}>
      <Sidebar
        setFilter={(newFilter) => {
          setIsLoadingFilter(true);
          setTimeout(() => {
            setFilterType(newFilter);
            setIsLoadingFilter(false);
          }, 2000);
        }}
      />
      <Box sx={{ backgroundColor: "#1E252B", minHeight: "100vh", padding: 2, marginLeft: "240px" }}>
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <Box sx={{ ml:"300px", width:"1000px", display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Box
                sx={{
                  height: 86,
                  width: "60px",
                  mt:"20px",
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
                    width: "auto",
                    mt: 1.3,
                    ml: 2,
                    backgroundColor: "#2C353D",
                    padding: 1,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontFamily: "Rubik, sans-serif", color: "#FFF" }}>
                    Compartilhe o que está pensando...
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
                    color:"white",
                    fontSize: 15,
                    fontWeight: "bold",
                    fontFamily: "Rubik, sans-serif",
                    textTransform: "none",
                  }}
                >
                  Criar post
                </Button>
              </Box>
              {/* Diálogo de Criação de Post */}
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
                    InputLabelProps={{ style: { color: "white" } }}
                    InputProps={{
                      style: { color: "white", borderColor: "white" },
                    }}
                    sx={{
                      fontFamily: "Rubik, sans-serif",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "#ff8c00" },
                        "&.Mui-focused fieldset": { borderColor: "#ff8c00" },
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
                    InputLabelProps={{ style: { color: "white" } }}
                    InputProps={{
                      style: { color: "white", borderColor: "white" },
                    }}
                    sx={{
                      fontFamily: "Rubik, sans-serif",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "white" },
                        "&:hover fieldset": { borderColor: "#ff8c00" },
                        "&.Mui-focused fieldset": { borderColor: "#ff8c00" },
                      },
                    }}
                    value={newPost.conteudo}
                    onChange={(e) =>
                      setNewPost({ ...newPost, conteudo: e.target.value })
                    }
                    variant="outlined"
                  />
                  <Button
                    sx={{
                      mt: "10px",
                      mb: "20px",
                      textTransform: "none",
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#1976d2",
                      color: "#ffffff",
                      "&:hover": { backgroundColor: "#1565c0" },
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    variant="contained"
                    component="label"
                  >
                    <ImageIcon sx={{ mr: "8px" }} />
                    Escolher Imagem
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                      if (typeof newValue === "string") {
                        setValue({ title: newValue });
                      } else if (newValue && newValue.inputValue) {
                        setValue({ title: newValue.inputValue });
                      } else {
                        setValue(newValue);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = autocompleteFilter(options, params);
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
                    options={options}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      if (option.inputValue) return option.inputValue;
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
                        InputLabelProps={{ style: { color: "white" } }}
                        InputProps={{
                          ...params.InputProps,
                          style: { color: "white" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "white" },
                            "&:hover fieldset": { borderColor: "#ff8c00" },
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
            {feedbackMessage && (
              <Box
                sx={{
                  backgroundColor: feedbackMessage.includes("Erro")
                    ? "red"
                    : "green",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {feedbackMessage}
              </Box>
            )}
            {(filteredPosts.length > 0 ? filteredPosts : posts).map((post) => (
              <Card
                key={post.idpost}
                onClick={() => handlePostClick(post.idpost)}
                sx={{
                  fontFamily: "Rubik, sans-serif",
                  backgroundColor: "#262D34",
                  minHeight:"400px",
                  width:"1000px",
                  ml:"300px",
                  borderRadius: 4,
                  marginBottom: 2,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {role === "admin" && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.idpost);
                    }}
                    variant="contained"
                    color="error"
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    Deletar
                  </Button>
                )}
                <CardContent>
                  <Box sx={{ fontFamily: "Rubik, sans-serif" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#FFF",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <AvatarWithInitials name={post.nome} sx={{ width: "23px", height: "23px", marginRight: 1 }} />
                      {post.nome} •
                      <Typography
                        sx={{
                          color: "#8ba2ad",
                          mt: "2px",
                          ml: "3px",
                          fontSize: "11px",
                        }}
                      >
                        {post.data_criacao
                          ? new Date(post.data_criacao).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Data inválida"}
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        color: "#8ba2ad",
                        fontSize: "15px",
                        mt: "6px",
                        fontWeight: "bold",
                        mb: "10px",
                      }}
                    >
                      {post.titulo}
                    </Typography>
                  </Box>
                  <Box sx={{ borderBottom: "3px solid #444" }} />
                  {/* Imagem do Post */}
                  {post.imagembase64 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${post.imagembase64}`}
                        alt="Ilustração do Post"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "400px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                  {/* Tipo de Post */}
                  <Box sx={{ marginTop: 2 }}>
                    <Fab variant="extended" sx={{ fontSize: "12px", height: "35px" }}>
                      {post.tipo}
                    </Fab>
                  </Box>
                  {/* Botões de Interação */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.idpost);
                        }}
                        sx={{ color: "#FFF" }}
                      >
                        <Badge badgeContent={post.likes} color="error">
                          <FavoriteIcon />
                        </Badge>
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>

      {/* Diálogo de Criação de Post já incluído acima */}
    </div>
  );
}
