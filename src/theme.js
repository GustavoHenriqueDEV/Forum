import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6F00",
    },
    secondary: {
      main: "#00D1B2",
    },
    background: {
      default: "#17202a",
      paper: "#2A2F38",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#D7DADC",
    },
  },
  typography: {
    fontFamily: "Rubik, sans-serif",
    h6: {
      fontWeight: "bold",
      color: "#f4b842",
    },
  },
});

export default theme;
