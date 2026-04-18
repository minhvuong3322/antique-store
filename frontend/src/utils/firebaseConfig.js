// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Dán firebaseConfig 
const firebaseConfig = {
  apiKey: "AIzaSyAZo5DC9OOTR1u8asIQQDx_l-pCUgu1jtQ",
  authDomain: "dvt2-2a5bb.firebaseapp.com",
  projectId: "dvt2-2a5bb",
  storageBucket: "dvt2-2a5bb.firebasestorage.app",
  messagingSenderId: "633190741023",
  appId: "1:633190741023:web:a2d62bc5579e7369fa512a",
  measurementId: "G-6M9YRYLREJ"
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