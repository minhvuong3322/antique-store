import Navbar from './Navbar'
import Footer from './Footer'
import SupportChat from '../SupportChat'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-vintage-cream dark:bg-dark-bg transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <SupportChat />
        </div>
    )
}

export default Layout


