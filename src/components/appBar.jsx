import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DialogTitle from "@mui/material/DialogTitle";
import AuthPage from "./AuthPage"; // Importe o componente de login aqui

export default function CustomAppBar() {
  const [open, setOpen] = useState(false); // Controle para abrir/fechar o modal
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.reload(); // Recarrega a página
  };

  const handleLoginOpen = () => {
    setOpen(true); // Abre o modal
  };

  const handleLoginClose = () => {
    setOpen(false); // Fecha o modal
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#262D34", padding: "0 16px", height: 70 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FF6F00" }}>
          UP THE FORUM!
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            gap: 2,
          }}
        >
          {/* Barra de Pesquisa */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#3A3F47",
              borderRadius: 2,
              padding: "4px 8px",
              width: "30%",
            }}
          >
            <SearchIcon sx={{ color: "#FFF" }} />
            <InputBase
              placeholder="Type here to search..."
              sx={{
                color: "#FFF",
                marginLeft: 1,
                flex: 1,
                fontSize: "0.875rem",
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {username ? (
            <>
              <Typography sx={{ color: "#FFF" }}>{username}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginOpen}
            >
              Logar
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Modal (Dialog) para login */}
      <Dialog open={open} onClose={handleLoginClose}>
        <DialogTitle>{username ? "Você está logado!" : "Login"}</DialogTitle>
        <DialogContent>
          <AuthPage onClose={handleLoginClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
