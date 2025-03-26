// PlaylistContext.js
import React, { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

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
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
