import api from "./api";

/**
 * Lấy danh sách Trending (Top 50, phân trang)
 * GET /api/trending?page=1&limit=5
 */
export async function fetchTrending(page = 1, limit = 5) {
  try {
    const res = await api.get("/trending", {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    console.error("fetchTrending error:", error);
    throw error;
  }
}

/**
 * Lấy dữ liệu chart 7 ngày
 * GET /api/trending/chart
 */
export async function fetchTrendingChart() {
  try {
    const res = await api.get("/trending/chart");
    return res.data;
  } catch (error) {
    console.error("fetchTrendingChart error:", error);
    throw error;
  }
}
