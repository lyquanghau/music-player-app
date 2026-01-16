import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function useSearchHistory(token) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load history
  const fetchHistory = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history`, {
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
  const saveHistory = async (query, type = "youtube") => {
    if (!token || !query) return;

    try {
      await axios.post(
        `${API_URL}/history`,
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
  };

  // Delete one
  const deleteHistory = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/history/${id}`, {
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
      await axios.delete(`${API_URL}/history`, {
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
