// src/data/firebaseFunctions.js
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// 유저 점수 업데이트
export async function updateUserScore(username, delta) {
  const userRef = doc(db, "users", username);
  const userSnap = await getDoc(userRef);
  const currentScore = userSnap.exists() ? userSnap.data().score : 0;
  await setDoc(userRef, { score: currentScore + delta });
}

// 현재 유저 점수 조회 함수 추가
export async function fetchUserScore(username) {
  const userRef = doc(db, "users", username);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().score : 0;
}

export async function getUserScore(username) {
  const userRef = doc(db, "users", username);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().score : 0;
}

// 상위 10명 점수 가져오기
export async function getTopScores() {
  const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ username: doc.id, score: doc.data().score });
  });
  return result;
}