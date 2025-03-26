import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainApp from "./MainApp";
import SharedPlaylist from "./components/SharedPlaylist";
import { PlaylistProvider } from "./PlaylistContext"; // Thêm import này

function App() {
  return (
    <PlaylistProvider>
      {" "}
      {/* Thêm Provider ở đây */}
      <Router>
        <Routes>
          <Route path="/playlist/:id" element={<SharedPlaylist />} />
          <Route path="/" element={<MainApp />} />
        </Routes>
      </Router>
    </PlaylistProvider>
  );
}

export default App;
