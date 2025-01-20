// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sideBar/sideBar";
import CreatePostForm from "../../dashboard/components/createPostForm"; import { usePosts } from "../../dashboard/hooks/usePosts";

export default function Dashboard() { // Removido 'searchTerm' das props
  const [filterType, setFilterType] = useState("all");
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [open, setOpen] = useState(false);
  
  const {
    posts,
    feedbackMessage,
    isLoading,
    createPost,
    removePost,
    likePost,
    setFeedbackMessage
  } = usePosts();
  
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log("handleClose chamado"); // Log para depuração
    setOpen(false);
  };

  const handlePostClick = (idpost) => {
    navigate(`/post/${idpost}`);
  };

  const filteredPosts = posts
    .filter((post) => {
      if (filterType === "popular") {
        return post.likes >= 10;
      }
      return true;
    });

  const handleCreatePost = async (newPostData) => {
    try {
      await createPost(newPostData);
      setFeedbackMessage("Post criado com sucesso!");
      setOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (idpost) => {
    await removePost(idpost);
  };

  const handleLike = async (idpost) => {
    try {
      await likePost(idpost);
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading || isLoadingFilter) {
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
      <Box sx={{ ml:"70px", backgroundColor: "#1E252B", minHeight: "260vh", padding: 2 }}>
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
                    fontSize: 15,
                    fontWeight: "bold",
                    fontFamily: "Rubik, sans-serif",
                    textTransform: "none",
                  }}
                >
                  Create Post
                </Button>
              </Box>
            </Box>

            <CreatePostForm open={open} handleClose={handleClose} onCreate={handleCreatePost} />

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

            {filteredPosts.map((post) => (
              <Card
                key={post.idpost}
                onClick={() => handlePostClick(post.idpost)}
                sx={{
                  fontFamily: "Rubik, sans-serif",
                  backgroundColor: "#262D34",
                  borderRadius: 4,
                  marginBottom: 2,
                  position: "relative", // Para posicionar o botão de deletar
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
                      <Typography
                        sx={{
                          color: "#8ba2ad",
                          mt: "2px",
                          ml: "3px",
                          fontSize: "11px",
                        }}
                      >
                        {post.data_criacao
                          ? new Date(post.data_criacao).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "Data inválida"}
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Rubik, sans-serif",
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: 2,
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor: "#444",
                        ml: "60px",
                        width: "500px",
                        height: "400px",
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
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
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
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}