import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#3A3F47",
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
  backdropFilter: "blur(10px)",
}));
