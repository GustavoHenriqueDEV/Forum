import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./view/dashBoard";
import PostContent from "./view/postContent";
import CustomAppBar from "./components/appBar";

export default function App() {
  return (
    <Router>
      <CustomAppBar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/post/:idpost" element={<PostContent />} />
      </Routes>
    </Router>
  );
}
