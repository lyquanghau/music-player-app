// src/PlaylistContext.js
import React, { createContext, useState, useContext } from "react";

const PlaylistContext = createContext(null);

export const PlaylistProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerPlaylistRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <PlaylistContext.Provider
      value={{ refreshTrigger, triggerPlaylistRefresh }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const ctx = useContext(PlaylistContext);
  if (!ctx) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }
  return ctx;
};
