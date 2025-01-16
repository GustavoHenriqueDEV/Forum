import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useLocation } from "react-router-dom";




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
      }}
    >
      <List>
        <ListItem
          button
          onClick={() => setFilter("popular")}
          sx={{
            transition: "transform 0.3s, background-color 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "#333", 
            },
          }}
        >
          <ListItemIcon sx={{ color: "#d7dadc" }}>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Popular" />
        </ListItem>
        <Divider sx={{ marginY: "20px", borderColor: "#2a2a2c" }} />
        <ListItem
          button
          onClick={() => setFilter("all")}
          sx={{
            transition: "transform 0.3s, background-color 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor: "#333", 
            },
          }}
        >
          <ListItemIcon sx={{ color: "#d7dadc" }}>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Tudo" />
        </ListItem>
      </List>
      <Divider sx={{ marginY: "20px", borderColor: "#2a2a2c" }} />
    </Box>
  );
}
