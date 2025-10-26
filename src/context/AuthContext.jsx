import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Khởi tạo trạng thái xác thực
    useEffect(() => {
        const initAuth = () => {
            try {
                const currentUser = authService.getCurrentUser()
                const authenticated = authService.isAuthenticated()

                // Kiểm tra token có hợp lệ không
                if (authenticated && currentUser) {
                    // Có thể thêm logic kiểm tra token hết hạn ở đây
                    setUser(currentUser)
                    setIsAuthenticated(true)
                } else {
                    // Xóa dữ liệu xác thực không hợp lệ
                    authService.logout()
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                // Xóa dữ liệu xác thực không hợp lệ
                authService.logout()
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    // Hàm đăng nhập
    const login = async (credentials) => {
        try {
            setIsLoading(true)
            const response = await authService.login(credentials)

            if (response.success) {
                // Clear guest cart when logging in
                localStorage.removeItem('cart_guest');
                
                setUser(response.data.user)
                setIsAuthenticated(true)
                
                return { success: true, message: response.message }
            } else {
                return { success: false, message: response.message }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, message: 'Đăng nhập thất bại' }
        } finally {
            setIsLoading(false)
        }
    }

    // Hàm đăng xuất
    const logout = async () => {
        try {
            setIsLoading(true)
            await authService.logout()

            // Xóa trạng thái user TRƯỚC khi clear localStorage
            // Để CartContext và WishlistContext tự động clear UI qua useEffect dependency [user]
            setUser(null)
            setIsAuthenticated(false)

            // Clear only session data, KEEP user-specific carts for next login
            localStorage.removeItem('cart'); // Old generic cart
            localStorage.removeItem('wishlist'); // Not used
            localStorage.removeItem('user'); // Session info
            
            // ✅ KHÔNG xóa cart_${userId} để giữ cart khi login lại

            return { success: true, message: 'Đăng xuất thành công' }
        } catch (error) {
            console.error('Logout error:', error)
            return { success: false, message: 'Đăng xuất thất bại' }
        } finally {
            setIsLoading(false)
        }
    }

    // Hàm đăng nhập Google
    const loginWithGoogle = async (idToken) => {
        try {
            setIsLoading(true)
            const response = await authService.loginWithGoogle(idToken)

            if (response.success) {
                // Clear guest cart when logging in
                localStorage.removeItem('cart_guest');
                
                setUser(response.data.user)
                setIsAuthenticated(true)
                
                return { success: true, message: response.message }
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error('Google login error:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Hàm đăng nhập Facebook
    const loginWithFacebook = async (accessToken, userID) => {
        try {
            setIsLoading(true)
            const response = await authService.loginWithFacebook(accessToken, userID)

            if (response.success) {
                // Clear guest cart when logging in
                localStorage.removeItem('cart_guest');
                
                setUser(response.data.user)
                setIsAuthenticated(true)
                
                return { success: true, message: response.message }
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error('Facebook login error:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        loginWithGoogle,
        loginWithFacebook
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
