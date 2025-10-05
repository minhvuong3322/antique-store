import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorHandler';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const message = location.state?.message;

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData);

            if (result.success) {
                // Redirect to home or previous page
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-card flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-vintage border border-vintage-gold/20 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block">
                            <div className="text-5xl mb-2">🏛️</div>
                            <h2 className="text-3xl font-bold text-vintage-darkwood dark:text-vintage-cream mb-2" style={{ fontFamily: 'Arial, sans-serif', fontWeight: '700' }}>
                                Đăng Nhập
                            </h2>
                            <p className="text-vintage-gold dark:text-vintage-gold" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                                Antique Store
                            </p>
                        </Link>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-vintage-gold/30 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold focus:border-transparent transition disabled:opacity-50"
                                placeholder="your@email.com"
                                style={{ fontFamily: 'Arial, sans-serif' }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-vintage-darkwood dark:text-vintage-cream mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 pr-10 border border-vintage-gold/30 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-vintage-darkwood dark:text-white focus:ring-2 focus:ring-vintage-gold focus:border-transparent transition disabled:opacity-50"
                                    placeholder="••••••••"
                                    style={{ fontFamily: 'Arial, sans-serif' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded text-vintage-gold focus:ring-vintage-gold" />
                                <span className="ml-2 text-sm text-vintage-darkwood dark:text-vintage-cream" style={{ fontFamily: 'Arial, sans-serif' }}>Ghi nhớ đăng nhập</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-vintage-gold hover:text-vintage-bronze dark:hover:text-vintage-bronze" style={{ fontFamily: 'Arial, sans-serif' }}>
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg shadow-vintage text-white bg-gradient-to-r from-vintage-bronze to-vintage-gold hover:from-vintage-darkwood hover:to-vintage-bronze focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vintage-gold disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                            style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600' }}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-vintage-darkwood dark:text-vintage-cream" style={{ fontFamily: 'Arial, sans-serif' }}>
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="text-vintage-gold hover:text-vintage-bronze font-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-vintage-darkwood/70 dark:text-vintage-cream/70 hover:text-vintage-gold dark:hover:text-vintage-gold" style={{ fontFamily: 'Arial, sans-serif' }}>
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

