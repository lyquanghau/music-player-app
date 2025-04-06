import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import MainApp from "./MainApp"; // Trang nghe nhạc chính
import HomePage from "./components/HomePage";
import SharedPlaylist from "./components/SharedPlaylist";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import PlayerPage from "./components/PlayerPage"; // Thêm PlayerPage
import { AuthProvider, useAuth } from "./AuthContext";
import { PlaylistProvider } from "./PlaylistContext";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* Trang đăng nhập */}
      <Route path="/register" element={<SignUpPage />} />
      <Route
        path="/home"
        element={user ? <HomePage /> : <LandingPage />}
      />{" "}
      {/* Sau đăng nhập vào HomePage */}
      <Route
        path="/play/:videoId"
        element={user ? <PlayerPage /> : <LandingPage />}
      />{" "}
      {/* Thêm route */}
      <Route path="/playlist/:id" element={<SharedPlaylist />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <PlaylistProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PlaylistProvider>
    </AuthProvider>
  );
}

export default App;
