import { useState } from "react";
import { getComentariosByPost, createComentario } from "../api/postService";
import { getRespostasByComentario, createResposta } from "../api/responseService";

export const useComments = (idpost, user) => {
  const [comments, setComments] = useState([]);
  const [respostasPorComentario, setRespostasPorComentario] = useState({});
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const commentsData = await getComentariosByPost(idpost);
    setComments(commentsData);

    const inicial = {};
    commentsData.forEach((comment) => {
      inicial[comment.idcomentario] = {
        respostas: [],
        aberto: false,
        novaResposta: "",
      };
    });
    setRespostasPorComentario(inicial);
  };

  const handleCreateComment = async () => {
    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    const comentario = {
      conteudo: newComment,
      usuario: { idusuario: user.idusuario },
    };

    await createComentario(idpost, comentario);
    await fetchComments();
    setNewComment("");
  };

  const handleToggleRespostas = async (idcomentario) => {
    const jaAberto = respostasPorComentario[idcomentario]?.aberto;

    if (!jaAberto) {
      const respostas = await getRespostasByComentario(idcomentario);
      setRespostasPorComentario((prev) => ({
        ...prev,
        [idcomentario]: {
          ...prev[idcomentario],
          respostas: respostas,
          aberto: true,
        },
      }));
    } else {
      setRespostasPorComentario((prev) => ({
        ...prev,
        [idcomentario]: {
          ...prev[idcomentario],
          aberto: false,
        },
      }));
    }
  };

  const handleChangeNovaResposta = (idcomentario, valor) => {
    setRespostasPorComentario((prev) => ({
      ...prev,
      [idcomentario]: {
        ...prev[idcomentario],
        novaResposta: valor,
      },
    }));
  };

  const handleCreateResposta = async (idcomentario) => {
    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    const respostaBody = {
      conteudo: respostasPorComentario[idcomentario].novaResposta,
      idUsuario: user.idusuario,
    };

    const createdResposta = await createResposta(idcomentario, respostaBody);
    setRespostasPorComentario((prev) => ({
      ...prev,
      [idcomentario]: {
        ...prev[idcomentario],
        respostas: [...prev[idcomentario].respostas, createdResposta],
        novaResposta: "",
      },
    }));
  };

  return {
    comments,
    respostasPorComentario,
    newComment,
    setNewComment,
    fetchComments,
    handleCreateComment,
    handleToggleRespostas,
    handleChangeNovaResposta,
    handleCreateResposta,
  };
};
