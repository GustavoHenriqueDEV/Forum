import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AuthPage from "../Auth/AuthPage";
import { getInitials } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";
import AvatarWithInitials from "../common/AvatarWithInitials";


const CustomAppBar = forwardRef(({ onSearch }, ref) => {
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const username = localStorage.getItem("username");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useImperativeHandle(ref, () => ({
    focusSearch() {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
  }));
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleLoginOpen = () => {
    setOpen(true);
  };

  const handleLoginClose = () => {
    setOpen(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{  height:"80px", borderBottom:"1px solid #3e4142 ",  backgroundColor: "#1E252B", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Título */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#f4b842" }}
          aria-label="Título do site"
        >
          UP THE FORUM!
        </Typography>

        {/* Campo de Busca */}
        <Box sx={{ mt:"10px", display: "flex", alignItems: "center", flex: 1, justifyContent: "center", gap: 2 }}>
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
              inputRef={searchInputRef}
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Digite aqui para buscar..."
              aria-label="Campo de busca"
              sx={{ color: "#FFF", marginLeft: 1, flex: 1, fontSize: "0.875rem" }}
            />
          </Box>
        </Box>

        {/* Autenticação */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {username ? (
            <>
              <AvatarWithInitials
                name={username}
                sx={{
                    bgcolor: "#FF6F00",
                    color: "#FFF",
                    width: 36,
                    height: 36,
                    fontSize: "1rem",
                    cursor: "pointer",
                }}
                onClick={handleAvatarClick}
                aria-label="Abrir menu do usuário"
                />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                aria-label="Menu do usuário"
              >
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    navigate("/profile");
                  }}
                >
                  Perfil
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #FF6F00, #FFA733)",
                color: "#FFF",
                padding: "8px 16px",
                fontWeight: "bold",
                borderRadius: "20px",
                textTransform: "none",
                boxShadow: "0 3px 5px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #FFA733, #FF6F00)",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.4)",
                },
              }}
              onClick={handleLoginOpen}
              aria-label="Botão de login"
            >
              Logar
            </Button>
          )}
        </Box>
      </Toolbar>

      <Dialog open={open} onClose={handleLoginClose}>
        <DialogTitle>{username ? "Você está logado!" : "Login"}</DialogTitle>
        <DialogContent>
          {username ? (
            <Typography variant="body1">Bem-vindo, {username}!</Typography>
          ) : (
            <AuthPage onClose={handleLoginClose} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
});

CustomAppBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default CustomAppBar;
