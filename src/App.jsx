import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import CustomAppBar from "./components/AppBar/CustomAppBar";
import Dashboard from "./pages/Dashboard/Dashboard";
import PostContent from "./pages/Post/PostContent";
import ProfilePage from "./pages/Profile/ProfilePage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <CustomAppBar onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<Dashboard searchTerm={searchTerm} />} />
            <Route path="/post/:idpost" element={<PostContent />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Adicione outras rotas conforme necessário */}
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
