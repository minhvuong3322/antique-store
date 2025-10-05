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

    // Initialize auth state
    useEffect(() => {
        const initAuth = () => {
            try {
                const currentUser = authService.getCurrentUser()
                const authenticated = authService.isAuthenticated()

                // Kiểm tra token có hợp lệ không
                if (authenticated && currentUser) {
                    // Có thể thêm logic kiểm tra token expiry ở đây
                    setUser(currentUser)
                    setIsAuthenticated(true)
                } else {
                    // Clear invalid auth data
                    authService.logout()
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                // Clear invalid auth data
                authService.logout()
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    // Login function
    const login = async (credentials) => {
        try {
            setIsLoading(true)
            const response = await authService.login(credentials)

            if (response.success) {
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

    // Logout function
    const logout = async () => {
        try {
            setIsLoading(true)
            await authService.logout()

            // Clear state
            setUser(null)
            setIsAuthenticated(false)

            return { success: true, message: 'Đăng xuất thành công' }
        } catch (error) {
            console.error('Logout error:', error)
            return { success: false, message: 'Đăng xuất thất bại' }
        } finally {
            setIsLoading(false)
        }
    }

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
