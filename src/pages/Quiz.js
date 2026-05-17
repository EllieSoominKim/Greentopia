// src/pages/Quiz.js
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import quizList from "../data/quizData";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const { username, updateScore, getScore } = useContext(UserContext);
  const [quiz, setQuiz] = useState(null);
  const [message, setMessage] = useState("");
  const [disableButtons, setDisableButtons] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadNewQuiz();
  }, []);

  const loadNewQuiz = () => {
    const random = quizList[Math.floor(Math.random() * quizList.length)];
    setQuiz(random);
    setMessage("");
    setDisableButtons(false);
  };

  const handleAnswer = async (answer) => {
    if (!quiz || disableButtons) return;

    setDisableButtons(true);

    const isCorrect = answer === quiz.answer;
    const delta = isCorrect ? 10 : -5;

    setMessage(isCorrect ? "정답입니다! +10점" : "틀렸습니다... -5점");
    await updateScore(username, delta);

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setTimeout(async () => {
      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      if (nextCount >= 10) {
        const totalScore = await getScore(username);
        navigate("/quiz-result", {
          state: {
            username,
            totalScore,
            correctCount: correctCount + (isCorrect ? 1 : 0),
            wrongCount: wrongCount + (isCorrect ? 0 : 1),
          },
        });
      } else {
        loadNewQuiz();
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-6 bg-gray-50">
      <h1 className="text-5xl font-extrabold mb-10 text-green-700">OX 퀴즈</h1>
      <p className="mb-4 text-2xl text-gray-700 font-medium">
        문제 {questionCount + 1} / 10
      </p>
      {quiz && (
        <>
          <p className="text-3xl font-semibold mb-10">{quiz.question}</p>
          <div className="flex space-x-12 mb-6">
            <button
              onClick={() => handleAnswer("O")}
              disabled={disableButtons}
              className="bg-green-500 px-10 py-4 text-white rounded text-3xl hover:bg-green-600 transition"
            >
              O
            </button>
            <button
              onClick={() => handleAnswer("X")}
              disabled={disableButtons}
              className="bg-red-500 px-10 py-4 text-white rounded text-3xl hover:bg-red-600 transition"
            >
              X
            </button>
          </div>
          {message && (
            <p className="text-2xl font-bold text-gray-800">{message}</p>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;