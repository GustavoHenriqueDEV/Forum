import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

export const StyledCard = styled(Card)(({ theme }) => ({
  fontFamily: "Rubik, sans-serif",
  backgroundColor: "#262D34",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: "pointer",
  position: "relative",
}));
