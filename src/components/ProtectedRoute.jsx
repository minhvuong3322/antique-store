import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    // Hiển thị thông báo khi cần đăng nhập nhưng chưa đăng nhập
    useEffect(() => {
        if (!isLoading && requireAuth && !isAuthenticated) {
            toast.error('Vui lòng đăng nhập để tiếp tục')
        }
    }, [isLoading, requireAuth, isAuthenticated])

    // Hiển thị loading khi đang kiểm tra authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-gold mx-auto mb-4"></div>
                    <p className="text-vintage-darkwood dark:text-vintage-cream font-serif">
                        Đang kiểm tra quyền truy cập...
                    </p>
                </div>
            </div>
        )
    }

    // Nếu cần đăng nhập nhưng chưa đăng nhập
    if (requireAuth && !isAuthenticated) {
        // Redirect về trang login với returnUrl
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Nếu đã đăng nhập và đang ở trang login/register, redirect về trang chủ
    if (!requireAuth && isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
