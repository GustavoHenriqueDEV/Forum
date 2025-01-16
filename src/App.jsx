import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./view/dashBoard";
import PostContent from "./view/postContent";
import CustomAppBar from "./components/appBar";
import Sidebar from "./components/Sidebar";
import ProfilePage from "./view/profilePage";

export default function App() {
  const [searchTerm, setSearchTerm] = useState(""); // Estado global para o termo de pesquisa
  const appBarRef = useRef(null); // Crie um ref para o CustomAppBar

  return (
    <Router>
      {/* Passa o callback onSearch para CustomAppBar */}
      <CustomAppBar ref={appBarRef} onSearch={(term) => setSearchTerm(term)} />

      {/* Passa focusSearch corretamente para Sidebar */}
      <Sidebar focusSearch={() => appBarRef.current?.focusSearch()} />

      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/"element={<Dashboard searchTerm={searchTerm} />}/>
        <Route path="/post/:idpost" element={<PostContent />} />
      </Routes>
    </Router>
  );
}
