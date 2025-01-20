import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Collapse,
  Paper,
} from "@mui/material";

export default function CommentsSection({
  comments,
  user,
  respostasPorComentario,
  handleToggleRespostas,
  handleChangeNovaResposta,
  handleCreateResposta,
  handleCreateComment,
  newComment,
  setNewComment,
}) {
  return (
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
            <Typography style={{ color: "#FFF", fontWeight: "bold" }}>
              {comment.usuario?.nome || "Anônimo"}:
            </Typography>

            <Typography style={{ color: "#D4D4D4", marginBottom: 8 }}>
              {comment.conteudo || "Sem conteúdo"}
            </Typography>

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
            <Collapse
              in={respostasPorComentario[comment.idcomentario]?.aberto}
              timeout="auto"
              unmountOnExit
            >
              <Box mt={1} sx={{ pl: 2, borderLeft: "2px solid #444" }}>
                {respostasPorComentario[comment.idcomentario]?.respostas
                  ?.length > 0 ? (
                  respostasPorComentario[comment.idcomentario].respostas.map(
                    (resposta) => (
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
                        <Typography
                          style={{ color: "#D4D4D4" }}
                          variant="body2"
                        >
                          {resposta.conteudo}
                        </Typography>
                      </Paper>
                    )
                  )
                ) : (
                  <Typography
                    variant="body2"
                    style={{
                      color: "#D4D4D4",
                      fontStyle: "italic",
                      marginTop: 8,
                    }}
                  >
                    Não há respostas ainda.
                  </Typography>
                )}
                {user && (
                  <Box mt={2} display="flex" gap={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Escreva uma resposta..."
                      value={
                        respostasPorComentario[comment.idcomentario]
                          ?.novaResposta || ""
                      }
                      onChange={(e) =>
                        handleChangeNovaResposta(
                          comment.idcomentario,
                          e.target.value
                        )
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
                      onClick={() =>
                        handleCreateResposta(comment.idcomentario)
                      }
                    >
                      Responder
                    </Button>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        ))
      ) : (
        <Typography style={{ color: "#D4D4D4", fontStyle: "italic" }}>
          Nenhum comentário ainda.
        </Typography>
      )}
      {user && (
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
      )}
    </Box>
  );
}
