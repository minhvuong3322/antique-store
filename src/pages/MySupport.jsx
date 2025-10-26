import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supportService from '../services/supportService';
import { toast } from 'react-hot-toast';
import {
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
const MySupport = () => {
    const { user, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchMessages();
            // Auto-refresh every 10 seconds to get new responses
            const interval = setInterval(fetchMessages, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchMessages = async () => {
        try {
            const response = await supportService.getMyMessages();
            
            console.log('📨 Full Response:', response);
            console.log('📨 Response structure:', Object.keys(response));
            
            // Handle response structure
            // Response from supportService.getMyMessages() is already unwrapped by api interceptor
            // So response = {success: true, data: {messages: [...], pagination: {...}}}
            let messages = [];
            
            if (response.data && response.data.messages) {
                // Response structure: {success: true, data: {messages: [...], pagination: {...}}}
                messages = response.data.messages;
            } else if (response.messages) {
                // Direct response: {messages: [...], pagination: {...}}
                messages = response.messages;
            }
            
            console.log('📬 Extracted messages:', messages);
            console.log('📊 Count:', messages.length);
            
            setMessages(messages);
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.subject || !formData.message) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            await supportService.createMessage(formData);
            toast.success('Tin nhắn đã được gửi!');
            
            // Reset form
            setFormData({ subject: '', message: '' });
            
            // Refresh messages
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Chờ phản hồi' },
            in_progress: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, text: 'Đang xử lý' },
            resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Đã giải quyết' },
            closed: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, text: 'Đã đóng' }
        };
        return badges[status] || badges.pending;
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                        <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            Vui lòng đăng nhập
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Bạn cần đăng nhập để xem tin nhắn hỗ trợ
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                            <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3" />
                            Tin Nhắn Hỗ Trợ Của Tôi
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Quản lý các tin nhắn hỗ trợ và phản hồi từ admin
                        </p>
                    </div>

                    {/* Send New Message Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Gửi tin nhắn hỗ trợ mới
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Chủ đề *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ví dụ: Tôi cần hỗ trợ về đơn hàng..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nội dung tin nhắn *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Nội dung tin nhắn của bạn..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>

                    {/* Messages List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Lịch sử tin nhắn ({messages.length})
                        </h2>
                        
                        {messages.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                    Chưa có tin nhắn nào
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Hãy gửi tin nhắn hỗ trợ ở trên
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => {
                                const statusBadge = getStatusBadge(message.status);
                                const StatusIcon = statusBadge.icon;

                                return (
                                    <div
                                        key={message.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                                    >
                                        {/* Message Header */}
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {message.subject}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                                                    <StatusIcon className="w-4 h-4 inline mr-1" />
                                                    {statusBadge.text}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <ClockIcon className="w-4 h-4 mr-1" />
                                                {new Date(message.created_at).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>

                                        {/* Your Message */}
                                        <div className="p-6 bg-gray-50 dark:bg-gray-900">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <strong>Tin nhắn của bạn:</strong>
                                            </p>
                                            <p className="mt-2 text-gray-900 dark:text-white whitespace-pre-wrap">
                                                {message.message}
                                            </p>
                                        </div>

                                        {/* Admin Response */}
                                        {message.admin_response ? (
                                            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                                    ✅ Phản hồi từ Admin:
                                                </p>
                                                <p className="text-blue-800 dark:text-blue-100 whitespace-pre-wrap">
                                                    {message.admin_response}
                                                </p>
                                                {message.responded_at && (
                                                    <p className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                                                        {new Date(message.responded_at).toLocaleString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/10">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                    ⏳ Đang chờ phản hồi từ admin...
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
    );
};

export default MySupport;

