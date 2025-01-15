import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  getComentariosByPost,
  createComentario,
  createResposta,
  getRespostasByComentario,
} from "../service/service";
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
  Collapse,
} from "@mui/material";

export default function PostContent() {
  const { idpost } = useParams();
  const navigate = useNavigate();

  // Estado do post
  const [post, setPost] = useState(null);

  // Estado dos comentários
  const [comments, setComments] = useState([]);

  // Estado de loading e error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para novo comentário
  const [newComment, setNewComment] = useState("");

  // Controle de exibição dos comentários
  const [openComments, setOpenComments] = useState(false);

  // ---------------- NOVOS ESTADOS PARA RESPOSTAS ----------------
  const [respostasPorComentario, setRespostasPorComentario] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(idpost);
        setPost(postData);

        const commentsData = await getComentariosByPost(idpost);
        setComments(commentsData);

        // Inicializando o objeto de respostas
        const inicial = {};
        commentsData.forEach((comment) => {
          inicial[comment.idcomentario] = {
            respostas: [],
            aberto: false,
            novaResposta: "",
          };
        });
        setRespostasPorComentario(inicial);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        setError("Não foi possível carregar os dados do post e comentários.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idpost]);

  // Toggle para abrir/fechar a lista de comentários
  const handleToggleComments = () => {
    setOpenComments(!openComments);
  };

  // Cria um comentário
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
  
      // Cria o comentário no back-end
      await createComentario(idpost, comentario);
  
      // Agora, em vez de só inserir no estado, REFAZ a busca de todos os comentários
      const updatedComments = await getComentariosByPost(idpost);
      setComments(updatedComments);
  
      // Também atualiza o objeto de respostasPorComentario
      const inicial = {};
      updatedComments.forEach((comment) => {
        inicial[comment.idcomentario] = {
          respostas: [],
          aberto: false,
          novaResposta: "",
        };
      });
      setRespostasPorComentario(inicial);
  
      // Limpa o campo
      setNewComment("");
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      alert("Erro ao publicar comentário.");
    }
  };

  // ---------------- MANIPULAÇÃO DE RESPOSTAS ----------------

  // Handle para exibir/ocultar respostas de um comentário
  const handleToggleRespostas = async (idcomentario) => {
    const jaAberto = respostasPorComentario[idcomentario]?.aberto;

    // Se não estiver aberto, ao abrir, buscamos as respostas no servidor
    if (!jaAberto) {
      try {
        const respostas = await getRespostasByComentario(idcomentario);
        setRespostasPorComentario((prev) => ({
          ...prev,
          [idcomentario]: {
            ...prev[idcomentario],
            respostas: respostas,
            aberto: true,
          },
        }));
      } catch (error) {
        console.error("Erro ao buscar respostas:", error);
      }
    } else {
      // Se já estiver aberto, apenas ocultamos
      setRespostasPorComentario((prev) => ({
        ...prev,
        [idcomentario]: {
          ...prev[idcomentario],
          aberto: false,
        },
      }));
    }
  };

  // Atualiza o campo de nova resposta
  const handleChangeNovaResposta = (idcomentario, valor) => {
    setRespostasPorComentario((prev) => ({
      ...prev,
      [idcomentario]: {
        ...prev[idcomentario],
        novaResposta: valor,
      },
    }));
  };

  // Cria uma nova resposta para um comentário
  // ...
const handleCreateResposta = async (idcomentario) => {
  const idusuarioLocal = localStorage.getItem("idusuario");
  if (!idusuarioLocal) {
    alert("Usuário não autenticado!");
    return;
  }

  try {
    // Mude aqui:
    const respostaBody = {
      conteudo: respostasPorComentario[idcomentario].novaResposta,
      idUsuario: parseInt(idusuarioLocal),
    };

    const createdResposta = await createResposta(idcomentario, respostaBody);

    // Atualiza o estado para incluir a nova resposta
    setRespostasPorComentario((prev) => ({
      ...prev,
      [idcomentario]: {
        ...prev[idcomentario],
        respostas: [...prev[idcomentario].respostas, createdResposta],
        novaResposta: "", // limpa o campo
      },
    }));
  } catch (error) {
    console.error("Erro ao criar resposta:", error);
    alert("Erro ao publicar resposta.");
  }
};


  // ---------------- RENDERIZAÇÃO PRINCIPAL ----------------

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
        marginTop:"20px",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#17202a",
      }}
    >
      {/* SIDEBAR */}
      <div style={{ zIndex: 1000, overflow: "hidden", backgroundColor: "#17202a" }}>
        <Sidebar />
      </div>

      {/* CONTEÚDO PRINCIPAL DO POST */}
      <Box
        p={3}
        maxWidth={800}
        mx="auto"
        bgcolor="#2A2F38"
        boxShadow={3}
        borderRadius={2}
        color="#FFF"
        sx={{ height:"90%", width: "70%" }}
      >
        {/* TÍTULO E AVATAR */}
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

        {/* TÍTULO DO POST */}
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

        {/* CONTEÚDO DO POST */}
        <Typography
          letterSpacing={1}
          fontSize={14}
          variant="body1"
          gutterBottom
          style={{ color: "#B8C5C9", textAlign: "justify" }}
        >
          {post.conteudo || "Conteúdo indisponível"}
        </Typography>

        {/* IMAGEM DO POST */}
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

       

        {/* BOTÃO MOSTRAR/OCULTAR COMENTÁRIOS */}
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

        {/* SEÇÃO DE COMENTÁRIOS */}
        <Collapse in={openComments} timeout="auto" unmountOnExit>
          <Box mt={4} bgcolor="#1E252B" p={3} borderRadius={2}>
            <Typography variant="h5" style={{ color: "#00D1B2" }} gutterBottom>
              Comentários
            </Typography>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Paper
                  key={comment.idcomentario}
                  elevation={2}
                  style={{
                    backgroundColor: "#2A2F38",
                    padding: "15px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                  }}
                >
                  {/* Nome do usuário */}
                  <Typography style={{ color: "#FFF", fontWeight: "bold" }}>
                    {comment.usuario?.nome || "Anônimo"}:
                  </Typography>

                  {/* Conteúdo do comentário */}
                  <Typography style={{ color: "#D4D4D4", marginBottom: 8 }}>
                    {comment.conteudo || "Sem conteúdo"}
                  </Typography>

                  {/* BOTÃO DE VER RESPOSTAS */}
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: "#00D1B2", color: "#00D1B2", mb: 1 }}
                    onClick={() => handleToggleRespostas(comment.idcomentario)}
                  >
                    {respostasPorComentario[comment.idcomentario]?.aberto
                      ? "Ocultar Respostas"
                      : "Ver Respostas"}
                  </Button>

                  {/* SEÇÃO DE RESPOSTAS (EXIBIDA SE ABERTO) */}
                  <Collapse
                    in={respostasPorComentario[comment.idcomentario]?.aberto}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box mt={1} sx={{ pl: 2, borderLeft: "2px solid #444" }}>
                      {respostasPorComentario[comment.idcomentario]?.respostas?.length > 0 ? (
                        respostasPorComentario[comment.idcomentario].respostas.map((resposta) => (
                          <Paper
                            key={resposta.id}
                            elevation={1}
                            sx={{
                              p: 1,
                              my: 1,
                              backgroundColor: "#1E252B",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              style={{ color: "#FFF", fontWeight: "bold" }}
                              variant="body2"
                            >
                              {resposta.usuario?.nome || "Anônimo"}:
                            </Typography>
                            <Typography style={{ color: "#D4D4D4" }} variant="body2">
                              {resposta.conteudo}
                            </Typography>
                          </Paper>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          style={{ color: "#D4D4D4", fontStyle: "italic", marginTop: 8 }}
                        >
                          Não há respostas ainda.
                        </Typography>
                      )}

                      {/* CAMPO PARA NOVA RESPOSTA */}
                      <Box mt={2} display="flex" gap={2}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Escreva uma resposta..."
                          value={
                            respostasPorComentario[comment.idcomentario]?.novaResposta || ""
                          }
                          onChange={(e) =>
                            handleChangeNovaResposta(comment.idcomentario, e.target.value)
                          }
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
                          onClick={() => handleCreateResposta(comment.idcomentario)}
                        >
                          Responder
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </Paper>
              ))
            ) : (
              <Typography style={{ color: "#D4D4D4", fontStyle: "italic" }}>
                Nenhum comentário ainda.
              </Typography>
            )}

            {/* CAMPO PARA NOVO COMENTÁRIO GERAL */}
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
        </Collapse>
      </Box>
    </div>
  );
}
