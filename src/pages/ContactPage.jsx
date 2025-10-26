import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supportService from '../services/supportService';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        guest_name: user?.full_name || '',
        guest_email: user?.email || '',
        guest_phone: user?.phone || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.subject || !formData.message) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (!isAuthenticated && (!formData.guest_name || !formData.guest_email)) {
            toast.error('Vui lòng nhập tên và email');
            return;
        }

        setLoading(true);

        try {
            await supportService.createMessage(formData);
            toast.success('Tin nhắn của bạn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.');
            
            // Reset form
            setFormData({
                subject: '',
                message: '',
                guest_name: user?.full_name || '',
                guest_email: user?.email || '',
                guest_phone: user?.phone || ''
            });
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
        } finally {
            setLoading(false);
        }
    };

    const handleZaloContact = () => {
        // Replace with your actual Zalo number/link
        window.open('https://zalo.me/0987654321', '_blank');
    };

    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="font-elegant text-5xl text-vintage-darkwood dark:text-vintage-gold mb-4">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-vintage-wood dark:text-vintage-lightwood font-serif text-lg">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                    </p>
                </div>

                {/* Quick Contact Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    <button
                        onClick={handleZaloContact}
                        className="flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors shadow-md"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <div className="text-left">
                            <p className="font-semibold">Chat qua Zalo</p>
                            <p className="text-sm opacity-90">Phản hồi nhanh trong 5 phút</p>
                        </div>
                    </button>

                    <a
                        href="tel:+84987654321"
                        className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors shadow-md"
                    >
                        <Phone className="w-6 h-6" />
                        <div className="text-left">
                            <p className="font-semibold">Gọi điện ngay</p>
                            <p className="text-sm opacity-90">Hotline: +84 987 654 321</p>
                        </div>
                    </a>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card-vintage p-8">
                        <h2 className="font-serif text-2xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-6">
                            Gửi Tin Nhắn Hỗ Trợ
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {!isAuthenticated && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="guest_name"
                                            value={formData.guest_name}
                                            onChange={handleChange}
                                            className="input-vintage"
                                            placeholder="Nguyễn Văn A"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="guest_email"
                                            value={formData.guest_email}
                                            onChange={handleChange}
                                            className="input-vintage"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="guest_phone"
                                            value={formData.guest_phone}
                                            onChange={handleChange}
                                            className="input-vintage"
                                            placeholder="0123 456 789"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    Chủ đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="input-vintage"
                                    placeholder="Tôi cần hỗ trợ về..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    Tin nhắn <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="input-vintage"
                                    rows={5}
                                    placeholder="Nội dung tin nhắn của bạn..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-vintage w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang gửi...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Gửi Tin Nhắn</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="card-vintage p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-vintage-gold/10 rounded-lg">
                                    <MapPin className="w-6 h-6 text-vintage-gold" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                        Địa chỉ
                                    </h3>
                                    <p className="text-vintage-wood dark:text-vintage-lightwood">
                                        123 Phố Cổ, Quận Hoàn Kiếm<br />
                                        Hà Nội, Việt Nam
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-vintage p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-vintage-gold/10 rounded-lg">
                                    <Phone className="w-6 h-6 text-vintage-gold" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                        Điện thoại
                                    </h3>
                                    <p className="text-vintage-wood dark:text-vintage-lightwood">
                                        Hotline: +84 24 1234 5678<br />
                                        Mobile: +84 912 345 678
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-vintage p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-vintage-gold/10 rounded-lg">
                                    <Mail className="w-6 h-6 text-vintage-gold" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                        Email
                                    </h3>
                                    <p className="text-vintage-wood dark:text-vintage-lightwood">
                                        contact@shopdoco.vn<br />
                                        support@shopdoco.vn
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-vintage p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-vintage-gold/10 rounded-lg">
                                    <Clock className="w-6 h-6 text-vintage-gold" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                        Giờ làm việc
                                    </h3>
                                    <p className="text-vintage-wood dark:text-vintage-lightwood">
                                        Thứ 2 - Thứ 6: 9:00 - 18:00<br />
                                        Thứ 7 - CN: 10:00 - 17:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage


