import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";

import { AuthProvider, useAuth } from "./AuthContext";
import { PlaylistProvider } from "./PlaylistContext";
import { PlayerProvider } from "./context/PlayerContext";

import PlayerPage from "./components/PlayerPage";
import StickyPlayer from "./components/player/StickyPlayer";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/home" element={user ? <HomePage /> : <LandingPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PlaylistProvider>
          <PlayerProvider>
            {/* ROUTES */}
            <AppRoutes />

            {/* ENGINE – ẨN */}
            <PlayerPage />

            {/* STICKY PLAYER */}
            <StickyPlayer />
          </PlayerProvider>
        </PlaylistProvider>
      </AuthProvider>
    </Router>
  );
}
