import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../utils/firebaseConfig.js";
import { useAuth } from "../../context/AuthContext"; // Import useAuth đã cập nhật
import { toast } from "react-hot-toast";

// Import icons (giả sử bạn đã cài react-icons)
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const SocialLogin = () => {
  // Lấy hàm loginWithSocial MỚI từ context
  const { loginWithSocial } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);

  // Hoàn tất flow sau khi redirect (fallback)
  useEffect(() => {
    let mounted = true;

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result || !mounted) return;

        const idToken = await result.user.getIdToken();
        await loginWithSocial(idToken);

        toast.success("Đăng nhập thành công!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } catch (err) {
        // Bỏ qua các lỗi khi không có phiên redirect pending
        if (
          err?.code &&
          (String(err.code).includes("no-auth-event") ||
            String(err.code).includes("redirect-cancelled-by-user"))
        ) {
          return;
        }
        if (err?.code === "auth/popup-closed-by-user") return;

        console.error("Lỗi xác thực (redirect):", err);
        toast.error(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    };

    handleRedirectResult();
    return () => {
      mounted = false;
    };
  }, [location.state, loginWithSocial, navigate]);

  // Hàm xử lý chung cho cả Google và Facebook (ưu tiên popup, fallback redirect)
  const handleLogin = async (provider, setLoading) => {
    setLoading(true);

    try {
      // 1. Mở popup đăng nhập của Firebase
      const result = await signInWithPopup(auth, provider);

      // 2. Lấy Firebase ID Token
      const idToken = await result.user.getIdToken();

      // 3. Gọi hàm loginWithSocial từ AuthContext (đã được sửa)
      await loginWithSocial(idToken);

      toast.success("Đăng nhập thành công!");

      // 4. Đăng nhập thành công, chuyển hướng
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Lỗi xác thực Firebase:", err);
      
      // Xử lý các loại lỗi cụ thể
      if (err.code === "auth/popup-closed-by-user") {
        // Người dùng đóng popup - không hiển thị lỗi
        return;
      } else if (
        err.code === "auth/popup-blocked" ||
        String(err?.message || "").toLowerCase().includes("blocked")
      ) {
        // Popup bị chặn → fallback redirect
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr) {
          console.error("Lỗi khi fallback redirect:", redirectErr);
          toast.error(
            redirectErr?.message || "Không thể mở popup. Vui lòng thử lại."
          );
          return;
        }
      } else if (err.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "Tài khoản này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng phương thức ban đầu."
        );
      } else if (err.code === "auth/popup-blocked") {
        toast.error(
          "Popup đã bị chặn. Vui lòng cho phép popup trong trình duyệt và thử lại."
        );
      } else if (err.code === "auth/unauthorized-domain") {
        toast.error(
          "Domain chưa được cấu hình trong Firebase. Vui lòng liên hệ quản trị viên."
        );
      } else if (err.message?.includes("Facebook") || err.code?.includes("facebook")) {
        // Lỗi liên quan đến cấu hình Facebook
        toast.error(
          "Lỗi cấu hình Facebook Login. Vui lòng kiểm tra:\n" +
          "1. OAuth Redirect URI trong Facebook App\n" +
          "2. App ID và App Secret trong Firebase Console\n" +
          "3. Chế độ App (Development/Live) và danh sách Testers",
          { duration: 6000 }
        );
      } else {
        // Lỗi khác
        toast.error(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-vintage-gold/30 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className="px-3 bg-white dark:bg-gray-800 text-vintage-darkwood/60 dark:text-gray-400"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Hoặc đăng nhập bằng
          </span>
        </div>
      </div>

      {/* Nút đăng nhập Google */}
      <button
        type="button"
        disabled={loadingGoogle || loadingFacebook}
        onClick={() => handleLogin(googleProvider, setLoadingGoogle)}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-vintage-gold/30 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-vintage-cream/50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
      >
        <FaGoogle className="w-5 h-5 text-red-500" />
        <span
          className="text-vintage-darkwood dark:text-vintage-cream font-medium"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {loadingGoogle ? "Đang xử lý..." : "Đăng nhập với Google"}
        </span>
      </button>

      {/* Nút đăng nhập Facebook */}
      <button
        type="button"
        disabled={loadingGoogle || loadingFacebook}
        onClick={() => handleLogin(facebookProvider, setLoadingFacebook)}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-vintage-gold/30 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-vintage-cream/50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
      >
        <FaFacebookF className="w-5 h-5 text-blue-600" />
        <span
          className="text-vintage-darkwood dark:text-vintage-cream font-medium"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {loadingFacebook ? "Đang xử lý..." : "Đăng nhập với Facebook"}
        </span>
      </button>
    </div>
  );
};

export default SocialLogin;
