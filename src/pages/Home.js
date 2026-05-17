// src/pages/Home.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import logoImage from "../image/logo.png";
import backgroundImage from "../image/background.jpg";
import recycleIcon from "../image/recycle.png";
import trashIcon from "../image/trash.png";
import askIcon from "../image/ask.png";
import arrowIcon from "../image/arrow.png";

function Home() {
  const { setUsername } = useContext(UserContext);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setUsername(input.trim());
      alert(`환영합니다, ${input.trim()}님!`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-6 font-sans"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* 로고 */}
      <img src={logoImage} alt="Greentopia 로고" className="w-[40rem] mt-8 mb-4 drop-shadow-lg" />

      <p className="text-2xl text-green-800 font-semibold mb-8 drop-shadow">
        Greentopia: 그린토피아
      </p>

      {/* 아이디 입력 */}
      <form onSubmit={handleSubmit} className="mb-6 w-full max-w-xs">
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          시작하기
        </button>
      </form>

      {/* 기능 버튼 */}
      <div className="grid grid-cols-2 gap-10 mt-10">
        <FeatureButton to="/detect" icon={recycleIcon} label="쓰레기 인식하기" color="bg-green-800 text-white" />
        <FeatureButton to="/map" icon={trashIcon} label="쓰레기통 위치 확인" color="bg-green-600 text-white" />
        <FeatureButton to="/quiz" icon={askIcon} label="환경 퀴즈 도전" color="bg-green-400 text-white" />

        <div className="flex flex-col items-center">
          <img src={arrowIcon} alt="포인트 랭킹 보기" className="w-24 h-24 mb-2 drop-shadow-md" />
          <Link to="/ranking">
            <button className="py-2 px-4 bg-green-200 text-black rounded-lg hover:brightness-110 transition">
              포인트 랭킹 보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureButton({ to, icon, label, color }) {
  return (
    <div className="flex flex-col items-center">
      <img src={icon} alt={label} className="w-24 h-24 mb-2 drop-shadow-md" />
      <Link to={to}>
        <button
          className={`py-2 px-4 ${color} rounded-lg hover:brightness-110 transition`}
        >
          {label}
        </button>
      </Link>
    </div>
  );
}

export default Home;