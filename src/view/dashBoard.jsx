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
  Link,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageIcon from "@mui/icons-material/Image";

import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

import CommentIcon from "@mui/icons-material/Comment";
import {
  getPosts,
  createPosts,
  getComentariosByPost,
  createComentario,
  incrementLikes,
} from "../service/service";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard({ searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  const [filter, setFilter] = useState("all");
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
    imagembase64: "",
    imagem: "",
    data_criacao:"",
  });

  const navigate = useNavigate();
  const handlePostClick = (idpost) => {
    navigate(`/post/${idpost}`);
  };
  // Filtra os posts com base no termo de pesquisa
  const filteredPosts = posts.filter((post) => {
    const hasTitulo = post.titulo && post.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const hasTipo = post.tipo && post.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    return hasTitulo || hasTipo;
  })
  .filter((post) => {
    console.log("Filtro aplicado:", filter);
    if (filter === "popular") {
      return post.likes >= 10; // Posts com 10 ou mais likes são considerados populares
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
      }));
    } catch (error) {
      console.error(`Erro ao buscar comentários para o post ${idpost}:`, error);
    }
  };

  function formatToISO(dateString) {
    if (!dateString) return null;
    // Substitui o espaço entre a data e a hora por "T" e adiciona "Z" ao final.
    return dateString.replace(' ', 'T') + 'Z';
  }
  

  useEffect(() => { 
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        console.log("Dados dos posts recebidos:", postsData);
        // Formata a data para ISO
        const formattedPosts = postsData.map(post => ({
          ...post,
          data_criacao: post.data_criacao ? formatToISO(post.data_criacao) : null,
        }));

        setPosts(formattedPosts); // Atualiza o estado com os posts formatados
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };
    fetchPosts();
}, []);
  const handleCreatePost = async () => {
    const idusuarioLocal = localStorage.getItem("idusuario");
    if (!idusuarioLocal) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const createdPost = await createPosts({
        ...newPost,
        tipo: value.title,
        imagem: base64Image,
        usuario: { idusuario: parseInt(idusuarioLocal) },
      });

      setPosts((prevPosts) => [...prevPosts, createdPost]);
      setNewPost({
        titulo: "",
        tipo: "",
        conteudo: "",
        usuario: { idusuario: "" },
        likes: 0,
        imagembase64: "",
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
  const options = [
    { title: "Notícias", },
    { title: "Artigos", },
    { title: "Tutoriais"},
    { title: "Opinião"},
    { title: "Revisão/Review" },
    { title: "Análise" },
    { title: "Lista/Ranking"},
    { title: "Guia rápido"},
    { title: "Dicas"},  
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result.split(",")[1];
        setBase64Image(base64Image);
        console.log(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{marginTop:"70px"}}>
      <Sidebar setFilter={setFilter}/>


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
                <Typography
                  sx={{ fontFamily: "Rubik, sans-serif", color: "#FFF" }}
                >
                  Compartilhe oque está pensando...
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
                    fontFamily: "Rubik, sans-serif",

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
                    fontFamily: "Rubik, sans-serif",

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
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    variant="contained"
                    component="label"
                  >
                <ImageIcon sx={{ mr: "8px" }} /> {/* Ícone de imagem com margem direita */}
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
                  options={options}
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
          {(filteredPosts.length > 0 ? filteredPosts : posts).map((post) => (
            <Card
              onClick={() => handlePostClick(post.idpost)}
              key={post.idpost}
              sx={{
                fontFamily: "Rubik, sans-serif",
                backgroundColor: "#262D34",
                borderRadius: 4,
                marginBottom: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    fontFamily: "Rubik, sans-serif",
                    justifyContent: "",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontFamily: "Rubik, sans-serif",
                      color: "#FFF",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    <Avatar
                      sx={{ width: "23px", height: "23px", marginRight: 1 }}
                    />
                    {post.nome} • 
                    
                    <Typography sx={{ color:"#8ba2ad", mt:"2px", ml:"3px", fontSize:"11px"}}  >
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
                      fontFamily: "Rubik, sans-serif",
                      color: "#8ba2ad",
                      fontSize: "15px",
                      mt:"6px",
                      fontWeight: "bold",
                      mb: "10px",
                    }}
                  >
                    {post.titulo}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    borderBottom: "3px solid #444", // Estilo da linha
                  }}
                />
                <Box
                  sx={{
                    fontFamily: "Rubik, sans-serif",
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: 2,
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      fontFamily: "Rubik, sans-serif",
                      display: "flex",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#444",
                      ml: "60px",
                      width: "500px", // Largura fixa da imagem
                      height: "400px", // Altura fixa da imagem
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${post.imagembase64}`}
                      alt="Ilustração do Post"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Fab
                    sx={{
                      fontFamily: "Rubik, sans-serif",
                      fontSize: "12px",
                      mt: "3px",
                      mr: "5px",
                      height: "35px",
                    }}
                    variant="extended"
                  >
                    {post.tipo}
                  </Fab>
                </Box>

                <Box
                  sx={{
                    fontFamily: "Rubik, sans-serif",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  {/* Botões de interação */}
                  <Box
                    sx={{
                      fontFamily: "Rubik, sans-serif",
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.idpost);
                        }}
                      >
                        <IconButton>
                          <Badge badgeContent={post.likes} color="error">
                            <FavoriteIcon sx={{ color: "white" }} />
                          </Badge>
                        </IconButton>
                      </Button>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComments(post.idpost);
                      }}
                    >
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
                          >z 
                            {comentario.usuario?.nome || "Usuário desconhecido"}
                            : {comentario.conteudo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: "Rubik, sans-serif",
                          color: "#AAA",
                        }}
                      >
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
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      onClick={(e) => {
                      e.stopPropagation();
                      handleCreateComment(post.idpost)}}
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
    
    </div>
  );
}
