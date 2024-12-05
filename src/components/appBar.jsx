import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";

export default function CustomAppBar() {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#262D34", padding: "0 16px", height: 70 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Esquerda: Logo e Nome */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            style={{ borderRadius: "50%", marginRight: 8 }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#FF6F00" }}
          >
            UP THE FORUM!
          </Typography>
        </Box>

        {/* Centro: Ícones e Campo de Busca */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            gap: 2,
          }}
        >
          <IconButton sx={{ color: "#FFF" }}>
            <HomeIcon />
          </IconButton>
          <IconButton sx={{ color: "#FFF" }}>
            <GroupIcon />
          </IconButton>
          <IconButton sx={{ color: "#FFF" }}>
            <ChatIcon />
          </IconButton>

          {/* Campo de busca */}
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

        {/* Direita: Notificações, Chat e Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton sx={{ color: "#FFF" }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton sx={{ color: "#FFF" }}>
            <Badge badgeContent={2} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src="https://via.placeholder.com/40"
              alt="User"
              sx={{ width: 40, height: 40 }}
            />
            <Typography sx={{ color: "#FFF", fontWeight: "500" }}>
              GUGA
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
