import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  getPostsByUser,
  updateUser,
  deletePost,
  updatePost,
} from "../service/service";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    nome: "",
    login: "",
    senha: "",
    email: "",
    idade: 0,
    role: "",
  });
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const idusuario = localStorage.getItem("idusuario");

  useEffect(() => {
    if (!idusuario) {
      return;
    }
    fetchUserData();
    fetchUserPosts();
  }, [idusuario]);

  async function fetchUserData() {
    try {
      const user = await getUserById(idusuario);
      setUserData({
        nome: user.nome || "",
        login: user.login || "",
        senha: "",
        email: user.email || "",
        idade: user.idade || 0,
        role: user.role || "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  }

  async function fetchUserPosts() {
    try {
      const posts = await getPostsByUser(idusuario);
      setUserPosts(posts);
    } catch (error) {
      console.error("Erro ao buscar posts do usuário:", error);
    }
  }

  async function handleUpdateUser() {
    try {
      await updateUser(idusuario, userData);
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar usuário");
      console.error(error);
    }
  }

  async function handleDeletePost(idpost) {
    try {
      await deletePost(idpost);
      setUserPosts((prev) => prev.filter((post) => post.idpost !== idpost));
    } catch (error) {
      alert("Erro ao deletar post");
      console.error(error);
    }
  }

  async function handleUpdatePost(post) {
    try {
      await updatePost(post.idpost, post);
      alert("Post atualizado!");
      setEditingPost(null);
      fetchUserPosts();
    } catch (error) {
      alert("Erro ao atualizar post");
      console.error(error);
    }
  }
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        backgroundColor: "#17202a",
        paddingTop: "70px",
        boxSizing: "border-box",
      }}
    >
      <IconButton
        sx={{ ml: "10px", color: "#FFF" }}
        onClick={() => navigate("/")}
      >
        <ArrowBackIcon />
        Home
      </IconButton>
      <Grid container sx={{ height: "100%", padding: 2 }} spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#2A2F38",
              padding: 3,
              borderRadius: 2,
              color: "#FFF",
              height: "100%",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Editar Usuário
            </Typography>

            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              value={userData.nome}
              onChange={(e) =>
                setUserData({ ...userData, nome: e.target.value })
              }
              sx={{ marginBottom: 2 }}
              InputProps={{ style: { color: "#FFF" } }}
              InputLabelProps={{ style: { color: "#FFF" } }}
            />

            <TextField
              label="Login"
              variant="outlined"
              fullWidth
              value={userData.login}
              onChange={(e) =>
                setUserData({ ...userData, login: e.target.value })
              }
              sx={{ marginBottom: 2 }}
              InputProps={{ style: { color: "#FFF" } }}
              InputLabelProps={{ style: { color: "#FFF" } }}
            />

            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              value={userData.senha}
              onChange={(e) =>
                setUserData({ ...userData, senha: e.target.value })
              }
              sx={{ marginBottom: 2 }}
              InputProps={{ style: { color: "#FFF" } }}
              InputLabelProps={{ style: { color: "#FFF" } }}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              sx={{ marginBottom: 2 }}
              InputProps={{ style: { color: "#FFF" } }}
              InputLabelProps={{ style: { color: "#FFF" } }}
            />

            <TextField
              label="Idade"
              type="number"
              variant="outlined"
              fullWidth
              value={userData.idade}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  idade: parseInt(e.target.value) || 0,
                })
              }
              sx={{ marginBottom: 2 }}
              InputProps={{ style: { color: "#FFF" } }}
              InputLabelProps={{ style: { color: "#FFF" } }}
            />

            <Button variant="contained" onClick={handleUpdateUser}>
              SALVAR ALTERAÇÕES
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#2A2F38",
              padding: 3,
              borderRadius: 2,
              color: "#FFF",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Meus Posts
            </Typography>
            {userPosts.map((post) => (
              <Paper
                key={post.idpost}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  backgroundColor: "#1E252B",
                  color: "#FFF",
                }}
              >
                {editingPost === post.idpost ? (
                  <>
                    <TextField
                      fullWidth
                      sx={{ marginBottom: 1 }}
                      label="Título"
                      value={post.titulo}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        setUserPosts((prev) =>
                          prev.map((p) =>
                            p.idpost === post.idpost
                              ? { ...p, titulo: newVal }
                              : p
                          )
                        );
                      }}
                      InputProps={{ style: { color: "#FFF" } }}
                      InputLabelProps={{ style: { color: "#FFF" } }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ marginBottom: 1 }}
                      label="Conteúdo"
                      value={post.conteudo}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        setUserPosts((prev) =>
                          prev.map((p) =>
                            p.idpost === post.idpost
                              ? { ...p, conteudo: newVal }
                              : p
                          )
                        );
                      }}
                      InputProps={{ style: { color: "#FFF" } }}
                      InputLabelProps={{ style: { color: "#FFF" } }}
                    />
                    <Button
                      onClick={() => handleUpdatePost(post)}
                      variant="contained"
                      sx={{ marginRight: 2 }}
                    >
                      Salvar
                    </Button>
                    <Button onClick={() => setEditingPost(null)}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{post.titulo}</Typography>
                    <Typography sx={{ marginBottom: 1 }}>
                      {post.conteudo}
                    </Typography>
                    <Button
                      onClick={() => setEditingPost(post.idpost)}
                      variant="outlined"
                      sx={{ marginRight: 2 }}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeletePost(post.idpost)}
                      color="error"
                      variant="outlined"
                    >
                      Deletar
                    </Button>
                  </>
                )}
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
