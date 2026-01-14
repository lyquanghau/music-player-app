import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchTrending, fetchTrendingChart } from "../../api/trending";
import "./TrendingSection.css";

const PER_PAGE = 5;

export default function TrendingSection() {
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [chartData, setChartData] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  /* ===== FETCH LIST ===== */
  useEffect(() => {
    setLoadingList(true);
    fetchTrending(page, PER_PAGE)
      .then((data) => {
        setSongs(data.items || []);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoadingList(false));
  }, [page]);

  /* ===== FETCH CHART ===== */
  useEffect(() => {
    setLoadingChart(true);
    fetchTrendingChart()
      .then((data) => setChartData(data || []))
      .finally(() => setLoadingChart(false));
  }, []);

  return (
    <section id="trending" className="trending-wrapper">
      <div className="trending-card">
        <div className="trending-header">
          <h2>🔥 Trending 7 ngày gần nhất</h2>
          <span className="sub">
            Top 50 bài • Trang {page}/{totalPages}
          </span>
        </div>

        <div className="trending-body">
          {/* ===== LEFT: LIST ===== */}
          <div className="trending-list">
            {loadingList && <div className="loading">Đang tải...</div>}

            {!loadingList &&
              songs.map((song, index) => {
                const change = Number(song.change) || 0;

                return (
                  <div key={song.videoId} className="list-item">
                    <span className="rank">
                      #{(page - 1) * PER_PAGE + index + 1}
                    </span>

                    <div className="info">
                      <strong>{song.title}</strong>
                      <small>{song.artist}</small>

                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${Math.min(
                              song.trendScore / 1_000_000,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <span className={`change ${change >= 0 ? "up" : "down"}`}>
                      {change >= 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`}
                    </span>
                  </div>
                );
              })}

            {!loadingList && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹
                </button>
                <span className="page-info">
                  {page}/{totalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* ===== RIGHT: CHART ===== */}
          <div className="trending-chart">
            <div className="chart-header">
              <span>📈 Xu hướng tổng</span>
              <span className="range">7 days</span>
            </div>

            <div className="chart-box">
              {loadingChart ? (
                <div className="loading">Đang tải biểu đồ...</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="day"
                        tickFormatter={(d) => d.slice(5)} // MM-DD
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <YAxis
                        hide
                        domain={[
                          (min) => Math.floor(min * 0.98),
                          (max) => Math.ceil(max * 1.02),
                        ]}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* NOTE NHỎ */}
                  {chartData.length < 7 && (
                    <div className="chart-note">
                      Đang thu thập dữ liệu xu hướng ({chartData.length}/7 ngày)
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
