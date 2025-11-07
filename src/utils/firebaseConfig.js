// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Dán firebaseConfig 
const firebaseConfig = {
  apiKey: "AIzaSyCtC6k6bJVJa80BHPtDiAY1OkVw90_H9Is",
  authDomain: "antique-store-c37b4.firebaseapp.com",
  projectId: "antique-store-c37b4",
  storageBucket: "antique-store-c37b4.firebasestorage.app",
  messagingSenderId: "216242573161",
  appId: "1:216242573161:web:10d439c715d9b83a57b7f8",
  measurementId: "G-4FC8LNG8C7"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo dịch vụ Authentication và các nhà cung cấp
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Cải thiện UX và giảm việc tự động chọn account trước đó
googleProvider.setCustomParameters({ prompt: "select_account" });

export const facebookProvider = new FacebookAuthProvider();
// Đảm bảo có quyền email/profile khi đăng nhập Facebook
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");
facebookProvider.setCustomParameters({ display: "popup" });