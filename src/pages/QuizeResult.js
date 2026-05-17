// src/pages/QuizResult.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function QuizResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { username, totalScore, correctCount, wrongCount } = state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-6">🎉 퀴즈 결과 요약</h1>

      <p className="text-2xl text-gray-800 mb-2">{username}님의 총점은</p>
      <p className="text-5xl font-extrabold text-green-600 mb-6">{totalScore}점</p>

      <div className="text-xl text-gray-700 mb-8">
        <p>✅ 맞힌 문제 수: <span className="font-bold text-green-700">{correctCount}</span></p>
        <p>❌ 틀린 문제 수: <span className="font-bold text-red-600">{wrongCount}</span></p>
      </div>

      <button
        onClick={() => navigate("/ranking")}
        className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
      >
        랭킹 페이지로 이동 →
      </button>
    </div>
  );
}

export default QuizResult;