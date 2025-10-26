import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import {
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Support = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [showRespondModal, setShowRespondModal] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, [statusFilter, priorityFilter]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter !== 'all') params.priority = priorityFilter;

            const response = await adminService.getAllSupportMessages(params);
            
            console.log('📨 Full Response:', response);
            console.log('📨 Response structure:', Object.keys(response));
            console.log('📨 Response.data:', response.data);
            
            // Extract messages array from response
            // Response structure: {success: true, data: {messages: [...], pagination: {...}}}
            const messages = response.data?.messages || [];
            
            console.log('📬 Extracted messages:', messages);
            console.log('📊 Count:', messages.length);
            
            setMessages(messages);
        } catch (error) {
            console.error('❌ Error fetching messages:', error);
            console.error('❌ Error response:', error.response?.data);
            toast.error('Không thể tải tin nhắn hỗ trợ');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async () => {
        if (!responseText.trim()) {
            toast.error('Vui lòng nhập phản hồi');
            return;
        }

        try {
            await adminService.respondToMessage(selectedMessage.id, {
                admin_response: responseText,
                status: 'resolved'
            });

            toast.success('Đã phản hồi tin nhắn');
            setShowRespondModal(false);
            setResponseText('');
            setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            console.error('Error responding to message:', error);
            toast.error('Không thể gửi phản hồi');
        }
    };

    const handleStatusChange = async (messageId, newStatus) => {
        try {
            await adminService.updateMessageStatus(messageId, { status: newStatus });
            toast.success('Đã cập nhật trạng thái');
            fetchMessages();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, text: 'Chờ xử lý' },
            in_progress: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, text: 'Đang xử lý' },
            resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, text: 'Đã giải quyết' },
            closed: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, text: 'Đã đóng' }
        };
        return badges[status] || badges.pending;
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            low: { color: 'bg-gray-100 text-gray-800', text: 'Thấp' },
            normal: { color: 'bg-blue-100 text-blue-800', text: 'Bình thường' },
            high: { color: 'bg-orange-100 text-orange-800', text: 'Cao' },
            urgent: { color: 'bg-red-100 text-red-800', text: 'Khẩn cấp' }
        };
        return badges[priority] || badges.normal;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3" />
                        Tin nhắn hỗ trợ
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Quản lý và phản hồi tin nhắn từ khách hàng
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Trạng thái
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">Tất cả</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="in_progress">Đang xử lý</option>
                            <option value="resolved">Đã giải quyết</option>
                            <option value="closed">Đã đóng</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Độ ưu tiên
                        </label>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">Tất cả</option>
                            <option value="low">Thấp</option>
                            <option value="normal">Bình thường</option>
                            <option value="high">Cao</option>
                            <option value="urgent">Khẩn cấp</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {messages.map((message) => {
                        const statusBadge = getStatusBadge(message.status);
                        const priorityBadge = getPriorityBadge(message.priority);
                        const StatusIcon = statusBadge.icon;

                        return (
                            <div
                                key={message.id}
                                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                onClick={() => {
                                    setSelectedMessage(message);
                                    setShowRespondModal(true);
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {message.subject}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                                {statusBadge.text}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityBadge.color}`}>
                                                {priorityBadge.text}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {message.message}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            {message.user ? (
                                                <div className="flex items-center">
                                                    <EnvelopeIcon className="w-4 h-4 mr-1" />
                                                    {message.user.email}
                                                </div>
                                            ) : (
                                                <>
                                                    {message.guest_email && (
                                                        <div className="flex items-center">
                                                            <EnvelopeIcon className="w-4 h-4 mr-1" />
                                                            {message.guest_email}
                                                        </div>
                                                    )}
                                                    {message.guest_name && (
                                                        <div className="flex items-center">
                                                            👤 {message.guest_name}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            <div className="flex items-center">
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

                                        {message.admin_response && (
                                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                                    <strong>Phản hồi:</strong> {message.admin_response}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4 flex items-center space-x-2">
                                        {message.status === 'pending' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRespond();
                                                    setSelectedMessage(message);
                                                }}
                                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                                Phản hồi
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            Không có tin nhắn
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Chưa có tin nhắn hỗ trợ nào
                        </p>
                    </div>
                )}
            </div>

            {/* Respond Modal */}
            {showRespondModal && selectedMessage && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowRespondModal(false)} />

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                    Phản hồi tin nhắn
                                </h3>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>Từ:</strong> {selectedMessage.user?.email || selectedMessage.guest_email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <strong>Chủ đề:</strong> {selectedMessage.subject}
                                    </p>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-2">
                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Nhập phản hồi của bạn..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
                                    rows="6"
                                />

                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                                        onClick={handleRespond}
                                    >
                                        Gửi phản hồi
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                        onClick={() => setShowRespondModal(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Support;

