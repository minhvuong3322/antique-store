import { Link } from 'react-router-dom'
import { LogIn, ShoppingCart, CreditCard } from 'lucide-react'

const AuthRequiredMessage = ({ type = 'cart' }) => {
    const getContent = () => {
        switch (type) {
            case 'cart':
                return {
                    icon: <ShoppingCart className="w-16 h-16 text-vintage-wood dark:text-vintage-lightwood" />,
                    title: 'Cần Đăng Nhập',
                    message: 'Bạn cần đăng nhập để xem giỏ hàng và đặt hàng',
                    actionText: 'Đăng Nhập Ngay'
                }
            case 'checkout':
                return {
                    icon: <CreditCard className="w-16 h-16 text-vintage-wood dark:text-vintage-lightwood" />,
                    title: 'Cần Đăng Nhập',
                    message: 'Bạn cần đăng nhập để tiến hành thanh toán',
                    actionText: 'Đăng Nhập Ngay'
                }
            default:
                return {
                    icon: <LogIn className="w-16 h-16 text-vintage-wood dark:text-vintage-lightwood" />,
                    title: 'Cần Đăng Nhập',
                    message: 'Bạn cần đăng nhập để tiếp tục',
                    actionText: 'Đăng Nhập Ngay'
                }
        }
    }

    const content = getContent()

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center py-16">
                    <div className="inline-block p-8 bg-vintage-ivory dark:bg-dark-card rounded-full mb-6">
                        {content.icon}
                    </div>
                    <h2 className="font-elegant text-3xl text-vintage-darkwood dark:text-vintage-cream mb-4">
                        {content.title}
                    </h2>
                    <p className="text-vintage-wood dark:text-vintage-lightwood mb-8 max-w-md mx-auto">
                        {content.message}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="btn-vintage inline-flex items-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            {content.actionText}
                        </Link>
                        <Link
                            to="/register"
                            className="btn-outline-vintage inline-flex items-center gap-2"
                        >
                            Tạo Tài Khoản
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthRequiredMessage
