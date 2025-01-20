import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Dashboard from "./src/features/dashboard/pages/dashBoard";
import { AppBar } from "@mui/material";
import CustomAppBar from "./src/components/appBar/pages/appBar";
//import PostContent from "./pages/Post/PostContent";
//import ProfilePage from "./pages/Profile/ProfilePage";
//import { ThemeProvider } from "@mui/material/styles";
//import theme from "./theme";
function App() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  return (
    <AuthProvider>
        <Router>
         <CustomAppBar onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<Dashboard  />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
