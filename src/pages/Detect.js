import React, { useRef, useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const URL = "https://teachablemachine.withgoogle.com/models/YiViwWg91/";

const labelMap = {
  glass: "유리",
  paper: "종이",
  st: "스티로폼",
  plastic: "플라스틱",
  v: "비닐",
  general: "일반쓰레기",
  can: "캔",
};

const upcyclingLinks = {
  플라스틱: ["https://youtube.com/shorts/h3P3JPTPbnE?si=5NGRtmbYgsrZe3qd"],
  비닐: ["https://youtube.com/watch?v=KzYitLbPedw&feature=shared"],
  종이: ["https://youtu.be/h5b-olaVRSs?feature=shared"],
  유리: ["https://youtube.com/shorts/WEa8buofDms?si=ZIHXT0fevwyWJVLm"],
  캔: ["https://youtu.be/mL-QFsL5Nmc?si=O9Xybx3DVoA36k-f"],
};

function Detect() {
  const webcamRef = useRef(null);
  const webcamInstance = useRef(null);
  const modelRef = useRef(null);
  const animationId = useRef(null);

  const [prediction, setPrediction] = useState("");
  const [confirmedClass, setConfirmedClass] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [finalResult, setFinalResult] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(true);

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId.current);
      safeStopWebcam();
    };
  }, []);

  const init = async () => {
    try {
      modelRef.current = await tmImage.load(URL + "model.json", URL + "metadata.json");

      webcamInstance.current = new tmImage.Webcam(200, 200, true);
      await webcamInstance.current.setup();
      await webcamInstance.current.play();

      if (webcamRef.current && !webcamRef.current.hasChildNodes()) {
        webcamRef.current.appendChild(webcamInstance.current.canvas);
      }

      setIsRecognizing(true);
      startLoop();
    } catch (error) {
      console.error("웹캠 초기화 실패:", error);
    }
  };

  const safeStopWebcam = async () => {
    try {
      if (webcamInstance.current?.stream) {
        webcamInstance.current.stop();
      }
    } catch (error) {
      console.warn("웹캠 중지 중 오류:", error);
    }
  };

  const startLoop = () => {
    let currentLabel = null;
    let labelStartTime = null;

    const loop = async () => {
      if (!isRecognizing || !webcamInstance.current?.canvas) {
        animationId.current = requestAnimationFrame(loop);
        return;
      }

      webcamInstance.current.update();
      const predictions = await modelRef.current.predict(webcamInstance.current.canvas);

      const top = predictions.reduce((prev, curr) =>
        prev.probability > curr.probability ? prev : curr
      );

      const prob = top.probability;
      const label = top.className;
      const korLabel = labelMap[label] || label;
      setPrediction(`${korLabel} (${(prob * 100).toFixed(1)}%)`);

      const now = Date.now();

      if (prob >= 0.7) {
        if (label === currentLabel) {
          if (now - labelStartTime >= 1500 && !confirmedClass) {
            setConfirmedClass(label);
            setShowButtons(true);
            setIsRecognizing(false);
            await safeStopWebcam();  // 웹캠 멈추기
          }
        } else {
          currentLabel = label;
          labelStartTime = now;
        }
      } else {
        currentLabel = null;
        labelStartTime = null;
      }

      animationId.current = requestAnimationFrame(loop);
    };

    animationId.current = requestAnimationFrame(loop);
  };

  const handleFoodWaste = (answer) => {
    const korClassName = labelMap[confirmedClass] || confirmedClass;

    if (answer === "예") {
      setFinalResult("음식물이 묻어있으므로 일반쓰레기로 버려야 합니다.");
    } else {
      const links = upcyclingLinks[korClassName] || [];
      if (links.length > 0) {
        const selected = links[Math.floor(Math.random() * links.length)];
        setFinalResult(`재활용 가능! 추천 업사이클링 링크:\n${selected}`);
      } else {
        setFinalResult("재활용이 가능합니다!");
      }
    }
  };

  const handleRestart = async () => {
    setConfirmedClass(null);
    setShowButtons(false);
    setFinalResult("");
    setPrediction("");
    setIsRecognizing(true);

    try {
      await webcamInstance.current.play();
      startLoop();
    } catch (error) {
      console.error("웹캠 재시작 실패:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700">쓰레기 인식</h1>

      <div
        ref={webcamRef}
        className="mx-auto mb-6 w-[200px] h-[200px] rounded-lg overflow-hidden border-4 border-green-300 shadow-inner"
      />

      <div className="text-center text-xl font-semibold text-green-800 mb-4">{prediction}</div>

      {confirmedClass && (
        <div className="text-center text-2xl font-bold text-green-600 mb-4">
          {labelMap[confirmedClass]}입니다.
        </div>
      )}

      {showButtons && (
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          <span className="self-center font-medium text-gray-700 whitespace-nowrap">
            음식물이 묻었나요?
          </span>
          <button
            onClick={() => handleFoodWaste("예")}
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-md shadow"
          >
            예
          </button>
          <button
            onClick={() => handleFoodWaste("아니오")}
            className="bg-blue-500 hover:bg-blue-600 transition text-white px-5 py-2 rounded-md shadow"
          >
            아니오
          </button>
        </div>
      )}

      {finalResult && (
        <div className="bg-green-50 border border-green-300 p-4 rounded-md text-sm whitespace-pre-line text-center text-green-900 font-medium select-text">
          {finalResult}
        </div>
      )}

      {confirmedClass && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRestart}
            className="bg-gray-200 hover:bg-gray-300 transition px-5 py-2 rounded-md shadow text-gray-800 font-medium"
          >
            다음 쓰레기 재인식
          </button>
        </div>
      )}
    </div>
  );
}

export default Detect;