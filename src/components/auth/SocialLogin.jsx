import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const SocialLogin = () => {
    const { loginWithGoogle, loginWithFacebook } = useAuth();
    const [fbLoaded, setFbLoaded] = useState(false);
    const googleButtonRef = useRef(null);

    // Load Facebook SDK
    useEffect(() => {
        // Kiểm tra nếu SDK đã được load
        if (window.FB) {
            setFbLoaded(true);
            return;
        }

        window.fbAsyncInit = function () {
            window.FB.init({
                appId: import.meta.env.VITE_FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            setFbLoaded(true);
        };

        // Load SDK
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/vi_VN/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await loginWithGoogle(credentialResponse.credential);
            toast.success('Đăng nhập Google thành công!');
        } catch (error) {
            console.error('Google login error:', error);
            toast.error(error.message || 'Đăng nhập Google thất bại');
        }
    };

    // Handle Google Login Error
    const handleGoogleError = () => {
        toast.error('Đăng nhập Google thất bại');
    };

    // Trigger hidden Google button
    const handleCustomGoogleLogin = () => {
        const hiddenButton = googleButtonRef.current?.querySelector('div[role="button"]');
        if (hiddenButton) {
            hiddenButton.click();
        }
    };

    // Handle Facebook Login
    const handleFacebookLogin = () => {
        if (!window.FB) {
            toast.error('Facebook SDK chưa được tải');
            return;
        }

        window.FB.login(async (response) => {
            if (response.authResponse) {
                try {
                    const { accessToken, userID } = response.authResponse;
                    await loginWithFacebook(accessToken, userID);
                    toast.success('Đăng nhập Facebook thành công!');
                } catch (error) {
                    console.error('Facebook login error:', error);
                    toast.error(error.message || 'Đăng nhập Facebook thất bại');
                }
            } else {
                toast.error('Đăng nhập Facebook bị hủy');
            }
        }, { scope: 'public_profile,email' });
    };

    return (
        <div className="space-y-4">
            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-vintage-gold/30 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white dark:bg-gray-800 text-vintage-darkwood/60 dark:text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                        Hoặc đăng nhập bằng
                    </span>
                </div>
            </div>

            {/* Custom Google Login Button */}
            <button
                type="button"
                onClick={handleCustomGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-vintage-gold/30 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-vintage-cream/50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-vintage-darkwood dark:text-vintage-cream font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Đăng nhập bằng Google
                </span>
            </button>

            {/* Hidden GoogleLogin Component */}
            <div ref={googleButtonRef} className="hidden">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    ux_mode="popup"
                    auto_select={false}
                />
            </div>

            {/* Facebook Login Button */}
            <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={!fbLoaded}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-vintage-gold/30 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-vintage-cream/50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-vintage-darkwood dark:text-vintage-cream font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Đăng nhập với Facebook
                </span>
            </button>
        </div>
    );
};

export default SocialLogin;


