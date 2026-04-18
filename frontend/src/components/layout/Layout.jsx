import Navbar from './Navbar'
import Footer from './Footer'
import SupportChat from '../SupportChat'
import { useAuth } from '../../context/AuthContext'

const Layout = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAuthenticated && (user?.role === 'admin' || user?.role === 'staff');
    
    return (
        <div className="min-h-screen flex flex-col bg-vintage-cream dark:bg-dark-bg transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            {/* Only show SupportChat for customers, not for admin/staff */}
            {!isAdmin && <SupportChat />}
        </div>
    )
}

export default Layout


