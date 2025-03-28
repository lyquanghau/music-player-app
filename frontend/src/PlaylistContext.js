// src/PlaylistContext.js
import React, { createContext, useState, useContext } from "react";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerPlaylistRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <PlaylistContext.Provider
      value={{ triggerPlaylistRefresh, refreshTrigger }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
