import React, { useState } from "react";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
    nome: "",
    email: "", // Campo de email
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
        localStorage.setItem("idusuario", response.data);
        alert("Login realizado com sucesso!");
        // Aqui você pode salvar o ID do usuário ou outras informações do login
      } else {
        alert("Usuário registrado com sucesso!");
        setIsLogin(true); // Alterar para tela de login após registro
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao autenticar!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{isLogin ? "Login" : "Registrar"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="login"
          placeholder="Login"
          value={formData.login}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </>
        )}
        <button type="submit">{isLogin ? "Login" : "Registrar"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Registrar" : "Já tenho conta"}
      </button>
    </div>
  );
}
