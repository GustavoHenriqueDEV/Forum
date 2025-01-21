import React from "react";
import { Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";

const options = [
  { title: "all" },

  { title: "Notícias" },
  { title: "Artigos" },
  { title: "Tutoriais" },
  { title: "Opinião" },
  { title: "Revisão/Review" },
  { title: "Análise" },
  { title: "Lista/Ranking" },
  { title: "Guia rápido" },
  { title: "Dicas" },
];

export default function Sidebar({ setFilter }) {
  const location = useLocation();

  if (location.pathname === "/profile") {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: "70px",
        width: "240px",
        height: "calc(100vh - 64px)",
        borderRight: "1px solid #3e4142",
        backgroundColor: "#1e252b",
        color: "#d7dadc",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <List>
        {options.map((option) => (
          <ListItem
            button
            key={option.title}
            onClick={() => setFilter(option.title)}
            sx={{
              transition: "transform 0.3s, background-color 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#333",
              },
            }}
          >
            <ListItemText primary={option.title} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginY: "20px", borderColor: "#2a2a2c" }} />
    </Box>
  );
}
