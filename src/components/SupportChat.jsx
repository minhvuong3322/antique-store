import { useState } from 'react';
import { MessageCircle, X, Send, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supportService from '../services/supportService';
import { toast } from 'react-hot-toast';

const SupportChat = () => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        guest_name: '',
        guest_email: '',
        guest_phone: ''
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
                guest_name: '',
                guest_email: '',
                guest_phone: ''
            });
            
            setIsOpen(false);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-vintage-gold hover:bg-vintage-bronze text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group"
                    aria-label="Hỗ trợ"
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    
                    {/* Tooltip */}
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-vintage-darkwood text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Cần hỗ trợ? Chat ngay!
                    </span>
                </button>
            )}

            {/* Chat Widget */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-vintage-gold p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-vintage-gold" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Hỗ trợ khách hàng</h3>
                                <p className="text-xs text-white/90">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full p-1 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                        {!isAuthenticated && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Tên của bạn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="guest_name"
                                        value={formData.guest_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vintage-gold dark:bg-gray-700 dark:text-white"
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="guest_email"
                                        value={formData.guest_email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vintage-gold dark:bg-gray-700 dark:text-white"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="guest_phone"
                                        value={formData.guest_phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vintage-gold dark:bg-gray-700 dark:text-white"
                                        placeholder="0928 172 081"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Chủ đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vintage-gold dark:bg-gray-700 dark:text-white"
                                placeholder="Tôi cần hỗ trợ về..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tin nhắn <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vintage-gold dark:bg-gray-700 dark:text-white resize-none"
                                placeholder="Mô tả chi tiết vấn đề của bạn..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-vintage-gold hover:bg-vintage-bronze text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                                    <span>Gửi tin nhắn</span>
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Chúng tôi sẽ phản hồi trong vòng 24 giờ
                        </p>
                    </form>
                </div>
            )}
        </>
    );
};

export default SupportChat;

