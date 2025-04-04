import React from "react";

const Effects = () => {
  return (
    <>
      <style>
        {`
          /* Đám mây với các hình dạng khác nhau */
          .cloud1 {
            position: absolute;
            width: 120px;
            height: 50px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 60px;
            animation: floatLeftToRight 8s infinite linear;
          }
          .cloud1::before {
            content: '';
            position: absolute;
            width: 70px;
            height: 70px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            top: -35px;
            left: 25px;
          }
          .cloud1::after {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            top: -25px;
            right: 20px;
          }

          .cloud2 {
            position: absolute;
            width: 150px;
            height: 40px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50px;
            animation: floatRightToLeft 10s infinite linear;
          }
          .cloud2::before {
            content: '';
            position: absolute;
            width: 80px;
            height: 60px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            top: -30px;
            left: 30px;
          }

          .cloud3 {
            position: absolute;
            width: 90px;
            height: 30px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 40px;
            animation: floatLeftToRight 9s infinite linear;
          }
          .cloud3::after {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            top: -25px;
            left: 20px;
          }

          /* Nốt nhạc, tai nghe, và sóng âm thanh */
          .note, .headphone, .soundwave {
            position: absolute;
            font-size: 4rem;
            color: #fff;
            animation: floatUpDown 3s infinite linear;
          }
          .headphone {
            font-size: 2.5rem;
            animation: floatUpDown 3s infinite linear;
          }
          .soundwave {
            font-size: 2rem;
            animation: floatUpDown 2s infinite linear;
          }

          /* Hạt lấp lánh */
          .particle {
            position: absolute;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            animation: sparkle 10s infinite linear;
          }

          /* Hoạt ảnh cho các đám mây di chuyển từ trái qua phải */
          @keyframes floatLeftToRight {
            0% { transform: translateX(-150%) translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(150vw) translateY(20px); opacity: 0; }
          }

          /* Hoạt ảnh cho các đám mây di chuyển từ phải qua trái */
          @keyframes floatRightToLeft {
            0% { transform: translateX(150vw) translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(-150%) translateY(-20px); opacity: 0; }
          }

          /* Hoạt ảnh cho các nốt nhạc, tai nghe, sóng âm thanh */
          @keyframes floatUpDown {
            0% { transform: translateY(100vh); opacity: 1; }
            20% { opacity: 1; }
            40% { opacity: 0.9; }
            60% { opacity: 0.6; }
            80% { opacity: 0.3; }
            100% { transform: translateY(-50%); opacity: 0; }
          }

          /* Hoạt ảnh cho hạt lấp lánh */
          @keyframes sparkle {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            25% { opacity: 0.5; }
            50% { opacity: 1; }
            75% { opacity: 1.5; }
            100% { transform: translateY(-50vh) scale(1); opacity: 0; }
          }
        `}
      </style>

      <div className="cloud1" style={{ top: "10%", left: "0" }}></div>
      <div
        className="cloud1"
        style={{ top: "40%", left: "-20%", animationDelay: "2s" }}
      ></div>
      <div className="cloud2" style={{ top: "25%", right: "0" }}></div>
      <div
        className="cloud2"
        style={{ top: "70%", right: "-10%", animationDelay: "1.5s" }}
      ></div>
      <div
        className="cloud3"
        style={{ top: "50%", left: "0", animationDelay: "3s" }}
      ></div>
      <div
        className="cloud3"
        style={{ top: "80%", left: "-15%", animationDelay: "0.5s" }}
      ></div>

      <div
        className="note"
        style={{ bottom: "0", left: "10%", animationDelay: "0s" }}
      >
        ♪
      </div>
      <div
        className="note"
        style={{ bottom: "0", left: "30%", animationDelay: "1s" }}
      >
        ♫
      </div>
      <div
        className="note"
        style={{ bottom: "0", left: "60%", animationDelay: "2s" }}
      >
        ♬
      </div>
      <div
        className="note"
        style={{ bottom: "0", left: "80%", animationDelay: "0.5s" }}
      >
        ♪
      </div>
      <div
        className="note"
        style={{ bottom: "0", left: "40%", animationDelay: "1.5s" }}
      >
        ♫
      </div>
      <div
        className="note"
        style={{ bottom: "0", left: "20%", animationDelay: "2.5s" }}
      >
        ♬
      </div>

      <div
        className="headphone"
        style={{ bottom: "0", left: "20%", animationDelay: "1.5s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>
      <div
        className="headphone"
        style={{ bottom: "0", left: "50%", animationDelay: "2.5s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>
      <div
        className="headphone"
        style={{ bottom: "0", left: "70%", animationDelay: "0.8s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>
      <div
        className="headphone"
        style={{ bottom: "0", left: "35%", animationDelay: "1.2s" }}
      >
        <i className="fas fa-headphones"></i>
      </div>

      <div
        className="soundwave"
        style={{ bottom: "0", left: "40%", animationDelay: "1.2s" }}
      >
        <i
          className="fas fa-waveform"
          style={{ fontSize: "2rem", color: "#fff" }}
        ></i>
      </div>
      <div
        className="soundwave"
        style={{ bottom: "0", left: "65%", animationDelay: "2.2s" }}
      >
        <i
          className="fas fa-waveform"
          style={{ fontSize: "2rem", color: "#fff" }}
        ></i>
      </div>

      <div
        className="particle"
        style={{ left: "15%", animationDelay: "0s" }}
      ></div>
      <div
        className="particle"
        style={{ left: "35%", animationDelay: "1s" }}
      ></div>
      <div
        className="particle"
        style={{ left: "55%", animationDelay: "2s" }}
      ></div>
      <div
        className="particle"
        style={{ left: "75%", animationDelay: "3s" }}
      ></div>
      <div
        className="particle"
        style={{ left: "25%", animationDelay: "1s" }}
      ></div>
      <div
        className="particle"
        style={{ left: "50%", animationDelay: "2s" }}
      ></div>
    </>
  );
};

export default Effects;
