import React, { useEffect, useState } from "react";
import { getTopScores } from "../data/firebaseFunctions";

function Ranking() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const topScores = await getTopScores();
      setRankings(topScores);
    }
    fetchData();
  }, []);

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-200 border-yellow-500";
      case 1:
        return "bg-gray-200 border-gray-400";
      case 2:
        return "bg-orange-200 border-orange-400";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-black-700">
        🔥 포인트 랭킹 🔥
      </h1>
      <ul className="space-y-4">
        {rankings.map((user, idx) => (
          <li
            key={user.username}
            className={`p-4 rounded-2xl shadow-md border-l-8 ${getRankColor(
              idx
            )} flex items-center justify-between`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-gray-700 w-6">{idx + 1}</span>
              <span className="text-lg font-semibold">{user.username}</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">{user.score}점</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ranking;

