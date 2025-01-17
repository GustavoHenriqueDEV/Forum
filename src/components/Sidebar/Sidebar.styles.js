import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const StyledSidebar = styled(Box)(({ theme }) => ({
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
}));
