import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { Send, Clock, CheckCircle, XCircle, MessageCircle, User } from 'lucide-react';

const Support = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchConversations();
        // Auto-refresh conversations every 10 seconds
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [statusFilter]);

    useEffect(() => {
        if (selectedConversation) {
            fetchConversationMessages(selectedConversation.id);
            // Auto-refresh messages every 5 seconds
            const interval = setInterval(() => {
                fetchConversationMessages(selectedConversation.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    useEffect(() => {
        // Only auto-scroll if user is near the bottom
        if (!isUserScrolling) {
            scrollToBottom();
        }
    }, [conversationMessages]);

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        setIsUserScrolling(!isNearBottom);
    };

    const scrollToBottom = () => {
        if (messagesContainerRef.current && !isUserScrolling) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await adminService.getAllSupportMessages(params);
            const messages = response.data?.messages || [];
            
            // Filter root messages (where conversation_id = id or conversation_id is null and it's the first message)
            const rootMessages = messages.filter(msg => {
                const convId = msg.conversation_id || msg.id;
                return convId === msg.id || (!msg.conversation_id && !msg.parent_id);
            });
            
            // Group by conversation_id to get unique conversations
            const conversationMap = new Map();
            rootMessages.forEach(msg => {
                const convId = msg.conversation_id || msg.id;
                if (!conversationMap.has(convId)) {
                    conversationMap.set(convId, msg);
                }
            });
            
            const convs = Array.from(conversationMap.values())
                .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
            
            setConversations(convs);
            
            // Auto-select first conversation if none selected
            if (!selectedConversation && convs.length > 0) {
                setSelectedConversation(convs[0]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast.error('Không thể tải danh sách hội thoại');
        } finally {
            setLoading(false);
        }
    };

    const fetchConversationMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await adminService.getAllSupportMessages({ conversation_id: conversationId });
            const messages = response.data?.messages || [];
            
            setConversationMessages(messages.sort((a, b) => 
                new Date(a.created_at) - new Date(b.created_at)
            ));
        } catch (error) {
            console.error('Error fetching conversation messages:', error);
            toast.error('Không thể tải tin nhắn');
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        
        if (!replyText.trim() || !selectedConversation) {
            toast.error('Vui lòng nhập tin nhắn');
            return;
        }

        setSending(true);
        setIsUserScrolling(false); // Reset scroll state when sending

        try {
            await adminService.respondToMessage(selectedConversation.id, {
                message: replyText,
                status: 'in_progress'
            });

            toast.success('Đã gửi tin nhắn');
            setReplyText('');
            
            // Refresh messages
            await fetchConversationMessages(selectedConversation.id);
            await fetchConversations();
        } catch (error) {
            console.error('Error sending reply:', error);
            toast.error('Không thể gửi tin nhắn');
        } finally {
            setSending(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200', icon: Clock, text: 'Chờ xử lý' },
            in_progress: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200', icon: CheckCircle, text: 'Đang xử lý' },
            resolved: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200', icon: CheckCircle, text: 'Đã giải quyết' },
            closed: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200', icon: XCircle, text: 'Đã đóng' }
        };
        return badges[status] || badges.pending;
    };

    const getCustomerName = (conversation) => {
        if (conversation.user) {
            return conversation.user.full_name || conversation.user.email;
        }
        return conversation.guest_name || conversation.guest_email || 'Khách hàng';
    };

    const getCustomerEmail = (conversation) => {
        return conversation.user?.email || conversation.guest_email || '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <MessageCircle className="w-8 h-8 mr-3" />
                    Chat với khách hàng
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Quản lý và phản hồi tin nhắn từ khách hàng
                </p>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="all">Tất cả</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="resolved">Đã giải quyết</option>
                    <option value="closed">Đã đóng</option>
                </select>
            </div>

            {/* Main Chat Interface */}
            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden min-w-0">
                {/* Sidebar - Customer List */}
                <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col min-w-0 max-w-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            Khách hàng ({conversations.length})
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                        {conversations.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Chưa có hội thoại nào
                                </p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const statusBadge = getStatusBadge(conv.status);
                                const StatusIcon = statusBadge.icon;
                                const isSelected = selectedConversation?.id === conv.id;
                                
                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                                            isSelected 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                                    {getCustomerName(conv)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {getCustomerEmail(conv)}
                                                </p>
                                            </div>
                                            <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusBadge.color.split(' ')[1]}`} />
                                        </div>
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 line-clamp-1">
                                            {conv.subject}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {conv.message}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                            {new Date(conv.updated_at || conv.created_at).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="col-span-9 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col min-w-0 max-w-full overflow-hidden">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {getCustomerName(selectedConversation)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {getCustomerEmail(selectedConversation)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedConversation.status).color}`}>
                                            {getStatusBadge(selectedConversation.status).text}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Chủ đề: {selectedConversation.subject}
                                </p>
                            </div>

                            {/* Messages */}
                            <div 
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                <div className="space-y-4">
                                    {loadingMessages ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                        </div>
                                    ) : conversationMessages.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Chưa có tin nhắn nào
                                            </p>
                                        </div>
                                    ) : (
                                        conversationMessages.map((msg) => {
                                            const isAdmin = msg.sender_type === 'admin' || msg.sender_type === 'staff';
                                            
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} px-1`}
                                                >
                                                    <div className={`max-w-[75%] sm:max-w-[70%] md:max-w-[65%] min-w-[120px] rounded-lg p-3 sm:p-4 break-words shadow-sm ${
                                                        isAdmin
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                    }`}>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            {isAdmin ? (
                                                                <span className="text-xs font-semibold">Admin</span>
                                                            ) : (
                                                                <span className="text-xs font-semibold">
                                                                    {getCustomerName(selectedConversation)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                                                        <p className={`text-xs mt-2 ${
                                                            isAdmin ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                                        }`}>
                                                            {new Date(msg.created_at).toLocaleString('vi-VN', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <form onSubmit={handleSendReply} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !replyText.trim()}
                                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {sending ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span>Gửi</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Chọn khách hàng để bắt đầu chat
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;
