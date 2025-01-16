import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
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
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AuthPage from "./AuthPage";
import { useNavigate } from "react-router-dom";

const CustomAppBar = forwardRef(({ onSearch }, ref) => {
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const username = localStorage.getItem("username");

  const searchInputRef = useRef(null);

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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  const navigate = useNavigate();
  return (
    <AppBar
      position="fixed"
      sx={{
        borderBottom: "1px solid #3e4142",
        backgroundColor: "#262D34",
        padding: "0 16px",
        height: 70,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <img
          style={{ height: "90px", width: "90px" }}
          src="..\src\assets\medical (1).png"
          alt="Logo"
          aria-label="Logo do site"
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#f4b842" }}
          aria-label="Título do site"
        >
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
              <Avatar
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
              >
                {getInitials(username)}
              </Avatar>
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
