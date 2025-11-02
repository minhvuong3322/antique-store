// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Dán firebaseConfig 
const firebaseConfig = {
  apiKey: "AIzaSyCvylDpThDyvtg13-J_cUWi-NJv7yKYpVE",
  authDomain: "webshopdoco.firebaseapp.com",
  projectId: "webshopdoco",
  storageBucket: "webshopdoco.firebasestorage.app",
  messagingSenderId: "812799503173",
  appId: "1:812799503173:web:de6fd83d86df72a10dec2c",
  measurementId: "G-8G6KKWR7S0"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo dịch vụ Authentication và các nhà cung cấp
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();