// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainApp from "./MainApp";
import SharedPlaylist from "./components/SharedPlaylist";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import PlayerPage from "./components/PlayerPage";
import { AuthProvider, useAuth } from "./AuthContext";
import { PlaylistProvider } from "./PlaylistContext"; // Thêm PlaylistProvider

// Tách logic kiểm tra user vào một component riêng
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <MainApp /> : <LandingPage />} />
      <Route path="/signup" element={user ? <MainApp /> : <SignUpPage />} />
      <Route path="/playlist/:id" element={<SharedPlaylist />} />
      <Route path="/play/:videoId" element={<PlayerPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <PlaylistProvider>
        {" "}
        {/* Thêm PlaylistProvider */}
        <Router>
          <AppRoutes />
        </Router>
      </PlaylistProvider>
    </AuthProvider>
  );
}

export default App;
