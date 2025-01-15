import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Link,
} from "@mui/material";

export default function AuthPage({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
    nome: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:8080/usuarios/login"
        : "http://localhost:8080/usuarios/register";
      const response = await axios.post(url, formData);
      if (isLogin) {
        console.log("Resposta da API:", response.data);
        localStorage.clear();
        localStorage.setItem("idusuario", response.data.idusuario);
        localStorage.setItem("username", response.data.nome); 
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role)
        console.log(response.data.token);
        console.log(response.data.role);

        alert("Login realizado com sucesso!");
        onClose();
      } else {
        alert("Usuário registrado com sucesso!");
        setIsLogin(true); 
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao autenticar!");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        padding: 3,
        backgroundColor: "#3A3F47", 
        borderRadius: 2,
        boxShadow: 3,
        backdropFilter: "blur(10px)", 
      }}
    >
      <Box>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#FF6F00", fontWeight: "bold" }}
        >
          {isLogin ? "Login" : "Registrar"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Login"
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{
              backgroundColor: "#2A2F36", 
              borderRadius: "4px",
              color: "#FFF",
            }}
          />
          <TextField
            label="Senha"
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{
              backgroundColor: "#2A2F36", 
              borderRadius: "4px",
              color: "#FFF",
            }}
          />

          {!isLogin && (
            <>
              <TextField
                label="Nome"
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{
                  backgroundColor: "#2A2F36", 
                  borderRadius: "4px",
                  color: "#FFF",
                }}
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                sx={{
                  backgroundColor: "#2A2F36", 
                  borderRadius: "4px",
                  color: "#FFF",
                }}
              />
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#FF6F00", 
              "&:hover": {
                backgroundColor: "#E65100", 
              },
            }}
          >
            {isLogin ? "Login" : "Registrar"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Link
            href="#"
            onClick={() => setIsLogin(!isLogin)}
            variant="body2"
            sx={{ color: "#FF6F00" }}
          >
            {isLogin
              ? "Não tem uma conta? Registrar"
              : "Já tem uma conta? Login"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
