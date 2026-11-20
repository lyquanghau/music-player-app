import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

export default function useSearchHistory(token) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load history
  const fetchHistory = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await api.get("/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Fetch history error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]); // ✅ dependency CHUẨN

  // Save search
  const saveHistory = useCallback(async (query, type = "youtube") => {
    if (!token || !query) return;

    try {
      await api.post(
        "/history",
        { query, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchHistory();
    } catch (err) {
      console.error("Save history error:", err);
    }
  }, [token, fetchHistory]);

  // Delete one
  const deleteHistory = async (id) => {
    if (!token) return;

    try {
      await api.delete(`/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete history error:", err);
    }
  };

  // Clear all
  const clearHistory = async () => {
    if (!token) return;

    try {
      await api.delete("/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory([]);
    } catch (err) {
      console.error("Clear history error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // ✅ ESLint PASS

  return {
    history,
    loading,
    saveHistory,
    deleteHistory,
    clearHistory,
    refreshHistory: fetchHistory,
  };
}
