import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainApp from "./MainApp";
import SharedPlaylist from "./components/SharedPlaylist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/playlist/:id" element={<SharedPlaylist />} />
        <Route path="/" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
