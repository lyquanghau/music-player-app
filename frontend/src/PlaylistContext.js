import React, { createContext, useContext, useState, useCallback } from "react";

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Hàm này sẽ được gọi khi cần làm mới danh sách playlist
  const triggerPlaylistRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    console.log("[PlaylistContext] Triggering playlist refresh");
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        refreshTrigger,
        triggerPlaylistRefresh,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
};
