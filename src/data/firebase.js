import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf8_cEG7YXwY2zcAyPilnbpjUAAAxr4SM",
  authDomain: "greentopia-f5453.firebaseapp.com",
  projectId: "greentopia-f5453",
  storageBucket: "greentopia-f5453.firebasestorage.app",
  messagingSenderId: "67859181738",
  appId: "1:67859181738:web:9d0df13a365fd86ebba0d3",
  measurementId: "G-MG4PMT2Q1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };