import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import supportService from '../services/supportService';
import { adminService } from '../services/adminService';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const { user, isAuthenticated } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'staff';
    
    // Admin/Staff: Chat with customers
    if (isAdmin && isAuthenticated) {
        return <AdminChatInterface />;
    }
    
    // Customer: Chat with admin
    return <CustomerChatInterface />;
};

// Admin Chat Interface
const AdminChatInterface = () => {
    const { user } = useAuth();
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
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [statusFilter]);

    useEffect(() => {
        if (selectedConversation) {
            fetchConversationMessages(selectedConversation.id);
            const interval = setInterval(() => {
                fetchConversationMessages(selectedConversation.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    useEffect(() => {
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
            
            const rootMessages = messages.filter(msg => {
                const convId = msg.conversation_id || msg.id;
                return convId === msg.id || (!msg.conversation_id && !msg.parent_id);
            });
            
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
        setIsUserScrolling(false);

        try {
            await adminService.respondToMessage(selectedConversation.id, {
                message: replyText,
                status: 'in_progress'
            });

            toast.success('Đã gửi tin nhắn');
            setReplyText('');
            
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-12rem)] bg-vintage-cream dark:bg-dark-bg py-3 sm:py-4 overflow-x-hidden">
            <div className="w-full mx-auto px-3 sm:px-4 lg:px-6">
                <div className="mb-3 sm:mb-4">
                    <h1 className="font-elegant text-2xl sm:text-3xl md:text-4xl text-vintage-darkwood dark:text-vintage-gold mb-1 sm:mb-2 break-words">
                        Chat với khách hàng
                    </h1>
                    <p className="text-vintage-wood dark:text-vintage-lightwood font-serif text-xs sm:text-sm md:text-base break-words">
                        Quản lý và phản hồi tin nhắn từ khách hàng
                    </p>
                </div>

                <div className="mb-2 sm:mb-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-vintage-gold/30 dark:border-vintage-gold/50 rounded-lg focus:ring-2 focus:ring-vintage-gold bg-white dark:bg-dark-card text-vintage-darkwood dark:text-vintage-cream w-full max-w-xs text-sm"
                    >
                        <option value="all">Tất cả</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="in_progress">Đang xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                        <option value="closed">Đã đóng</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-4" style={{ height: 'calc(100vh - 16rem)', minHeight: '400px', maxHeight: 'calc(100vh - 16rem)' }}>
                    {/* Sidebar - Customer List */}
                    <div className="lg:col-span-3 col-span-1 card-vintage overflow-hidden flex flex-col min-w-0 h-full max-w-full">
                        <div className="p-2 sm:p-3 border-b border-vintage-gold/20 flex-shrink-0">
                            <h2 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                Khách hàng ({conversations.length})
                            </h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                            {conversations.length === 0 ? (
                                <div className="text-center py-8 px-4">
                                    <MessageCircle className="w-12 h-12 mx-auto text-vintage-gold/50 mb-3" />
                                    <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
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
                                            className={`p-4 border-b border-vintage-gold/20 cursor-pointer transition-colors ${
                                                isSelected 
                                                    ? 'bg-vintage-gold/20 border-l-4 border-l-vintage-gold' 
                                                    : 'hover:bg-vintage-gold/10'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2 gap-2">
                                                <div className="flex-1 min-w-0 overflow-hidden">
                                                    <p className="font-semibold text-sm text-vintage-darkwood dark:text-vintage-cream truncate break-words">
                                                        {getCustomerName(conv)}
                                                    </p>
                                                    <p className="text-xs text-vintage-wood dark:text-vintage-lightwood truncate break-words">
                                                        {getCustomerEmail(conv)}
                                                    </p>
                                                </div>
                                                <StatusIcon className="w-4 h-4 flex-shrink-0" />
                                            </div>
                                            <p className="text-xs font-medium text-vintage-darkwood dark:text-vintage-cream mb-1 line-clamp-1">
                                                {conv.subject}
                                            </p>
                                            <p className="text-xs text-vintage-wood dark:text-vintage-lightwood line-clamp-2">
                                                {conv.message}
                                            </p>
                                            <p className="text-xs text-vintage-wood/70 dark:text-vintage-lightwood/70 mt-2">
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
                    <div className="lg:col-span-9 col-span-1 card-vintage flex flex-col min-w-0 h-full max-w-full overflow-hidden">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-2 sm:p-3 border-b border-vintage-gold/20 min-w-0 flex-shrink-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream truncate break-words">
                                                {getCustomerName(selectedConversation)}
                                            </h3>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood truncate break-words">
                                                {getCustomerEmail(selectedConversation)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const statusBadge = getStatusBadge(selectedConversation.status);
                                                return (
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                                                        {statusBadge.text}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mt-2 break-words">
                                        Chủ đề: {selectedConversation.subject}
                                    </p>
                                </div>

                                {/* Messages */}
                                <div 
                                    ref={messagesContainerRef}
                                    onScroll={handleScroll}
                                    className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 min-h-0"
                                    style={{ scrollBehavior: 'smooth' }}
                                >
                                    <div className="space-y-3 sm:space-y-4">
                                        {loadingMessages ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-gold"></div>
                                            </div>
                                        ) : conversationMessages.length === 0 ? (
                                            <div className="text-center py-8">
                                                <MessageCircle className="w-12 h-12 mx-auto text-vintage-gold/50 mb-3" />
                                                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
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
                                                                ? 'bg-vintage-gold/30 text-vintage-darkwood dark:text-vintage-cream'
                                                                : 'bg-vintage-cream/50 dark:bg-gray-700 text-vintage-darkwood dark:text-vintage-cream'
                                                        }`}>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-xs font-semibold">
                                                                    {isAdmin ? 'Bạn' : getCustomerName(selectedConversation)}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                                                            <p className={`text-xs mt-2 ${
                                                                isAdmin ? 'text-vintage-darkwood/70 dark:text-vintage-cream/70' : 'text-vintage-wood/70 dark:text-vintage-lightwood/70'
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
                                <div className="p-2 sm:p-3 border-t border-vintage-gold/20 flex-shrink-0 bg-white dark:bg-dark-card">
                                    <form onSubmit={handleSendReply} className="flex gap-2 min-w-0">
                                        <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Nhập tin nhắn..."
                                            className="flex-1 input-vintage min-w-0"
                                            disabled={sending}
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !replyText.trim()}
                                            className="btn-vintage px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                                    <MessageCircle className="w-16 h-16 mx-auto text-vintage-gold/50 mb-4" />
                                    <p className="text-vintage-wood dark:text-vintage-lightwood">
                                        Chọn khách hàng để bắt đầu chat
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Customer Chat Interface
const CustomerChatInterface = () => {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        guest_name: user?.full_name || '',
        guest_email: user?.email || '',
        guest_phone: user?.phone || '',
        conversation_id: null
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchConversations();
            const interval = setInterval(fetchConversations, 10000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (selectedConversation) {
            fetchConversationMessages(selectedConversation.id);
            const interval = setInterval(() => {
                fetchConversationMessages(selectedConversation.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (!isUserScrolling) {
            scrollToBottom();
        }
    }, [conversationMessages]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current && !isUserScrolling) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        setIsUserScrolling(!isNearBottom);
    };

    const fetchConversations = async () => {
        if (!isAuthenticated) return;
        
        try {
            const response = await supportService.getMyMessages();
            
            let fetchedMessages = [];
            if (response.data && response.data.messages) {
                fetchedMessages = response.data.messages;
            } else if (response.messages) {
                fetchedMessages = response.messages;
            }
            
            const conversationMap = new Map();
            fetchedMessages.forEach(msg => {
                const convId = msg.conversation_id || msg.id;
                if (!conversationMap.has(convId)) {
                    conversationMap.set(convId, msg);
                }
            });
            
            const convs = Array.from(conversationMap.values())
                .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
            
            setConversations(convs);
            
            if (!selectedConversation && convs.length > 0) {
                setSelectedConversation(convs[0]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchConversationMessages = async (conversationId) => {
        try {
            setLoadingMessages(true);
            const response = await supportService.getMyMessages({ conversation_id: conversationId });
            
            let messages = [];
            if (response.data && response.data.messages) {
                messages = response.data.messages;
            } else if (response.messages) {
                messages = response.messages;
            }
            
            setConversationMessages(messages.sort((a, b) => 
                new Date(a.created_at) - new Date(b.created_at)
            ));
        } catch (error) {
            console.error('Error fetching conversation messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.message) {
            toast.error('Vui lòng nhập tin nhắn');
            return;
        }

        if (!formData.conversation_id && !formData.subject) {
            toast.error('Vui lòng nhập chủ đề');
            return;
        }

        setLoading(true);
        setIsUserScrolling(false);

        try {
            await supportService.createMessage({
                ...formData,
                subject: formData.conversation_id ? (selectedConversation?.subject || '') : formData.subject
            });
            
            toast.success('Tin nhắn của bạn đã được gửi!');
            
            if (formData.conversation_id) {
                setFormData({
                    ...formData,
                    message: ''
                });
                await fetchConversationMessages(formData.conversation_id);
            } else {
            setFormData({
                subject: '',
                message: '',
                guest_name: user?.full_name || '',
                guest_email: user?.email || '',
                    guest_phone: user?.phone || '',
                    conversation_id: null
            });
            }
            
            if (isAuthenticated) {
                await fetchConversations();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200', icon: Clock, text: 'Chờ phản hồi' },
            in_progress: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200', icon: CheckCircle, text: 'Đang xử lý' },
            resolved: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200', icon: CheckCircle, text: 'Đã giải quyết' },
            closed: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200', icon: XCircle, text: 'Đã đóng' }
        };
        return badges[status] || badges.pending;
    };

    return (
        <div className="min-h-[calc(100vh-12rem)] bg-vintage-cream dark:bg-dark-bg py-3 sm:py-4 overflow-x-hidden">
            <div className="w-full mx-auto px-3 sm:px-4 lg:px-6">
                <div className="mb-3 sm:mb-4">
                    <h1 className="font-elegant text-2xl sm:text-3xl md:text-4xl text-vintage-darkwood dark:text-vintage-gold mb-1 sm:mb-2 break-words">
                        Chat với Admin
                    </h1>
                    <p className="text-vintage-wood dark:text-vintage-lightwood font-serif text-xs sm:text-sm md:text-base break-words">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-4" style={{ height: 'calc(100vh - 16rem)', minHeight: '400px', maxHeight: 'calc(100vh - 16rem)' }}>
                    {/* Sidebar - Conversation History - Only show if authenticated */}
                    {isAuthenticated && (
                        <div className="lg:col-span-3 col-span-1 card-vintage overflow-hidden flex flex-col min-w-0 h-full max-w-full">
                            <div className="p-2 sm:p-3 border-b border-vintage-gold/20 flex-shrink-0">
                                <h2 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                    Lịch sử chat ({conversations.length})
                                </h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                                {conversations.length === 0 ? (
                                    <div className="text-center py-8 px-4">
                                        <MessageCircle className="w-12 h-12 mx-auto text-vintage-gold/50 mb-3" />
                                        <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
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
                                                onClick={() => {
                                                    setSelectedConversation(conv);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        conversation_id: conv.id,
                                                        subject: conv.subject
                                                    }));
                                                }}
                                                className={`p-4 border-b border-vintage-gold/20 cursor-pointer transition-colors ${
                                                    isSelected 
                                                        ? 'bg-vintage-gold/20 border-l-4 border-l-vintage-gold' 
                                                        : 'hover:bg-vintage-gold/10'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between mb-2 gap-2">
                                                    <div className="flex-1 min-w-0 overflow-hidden">
                                                        <p className="font-semibold text-sm text-vintage-darkwood dark:text-vintage-cream truncate break-words">
                                                            {conv.subject}
                                                        </p>
                                                        <p className="text-xs text-vintage-wood dark:text-vintage-lightwood truncate break-words">
                                                            {conv.status}
                                                        </p>
                                                    </div>
                                                    <StatusIcon className="w-4 h-4 flex-shrink-0" />
                                                </div>
                                                <p className="text-xs font-medium text-vintage-darkwood dark:text-vintage-cream mb-1 line-clamp-1">
                                                    {conv.subject}
                                                </p>
                                                <p className="text-xs text-vintage-wood dark:text-vintage-lightwood line-clamp-2">
                                                    {conv.message}
                                                </p>
                                                <p className="text-xs text-vintage-wood/70 dark:text-vintage-lightwood/70 mt-2">
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
                    )}

                    {/* Main Chat Area */}
                    <div className={`${isAuthenticated ? "lg:col-span-9" : "lg:col-span-12"} col-span-1 card-vintage flex flex-col min-w-0 h-full max-w-full overflow-hidden`}>
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-2 sm:p-3 border-b border-vintage-gold/20 min-w-0 flex-shrink-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-serif font-semibold text-vintage-darkwood dark:text-vintage-cream truncate break-words">
                                                {selectedConversation.subject}
                                            </h3>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood truncate break-words">
                                                {getStatusBadge(selectedConversation.status).text}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const statusBadge = getStatusBadge(selectedConversation.status);
                                                return (
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                                                        {statusBadge.text}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mt-2 break-words">
                                        Chủ đề: {selectedConversation.subject}
                                    </p>
                                </div>

                                {/* Messages */}
                                <div 
                                    ref={messagesContainerRef}
                                    onScroll={handleScroll}
                                    className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 min-h-0"
                                    style={{ scrollBehavior: 'smooth' }}
                                >
                                    <div className="space-y-3 sm:space-y-4">
                                        {loadingMessages ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-gold"></div>
                                            </div>
                                        ) : conversationMessages.length === 0 ? (
                                            <div className="text-center py-8">
                                                <MessageCircle className="w-12 h-12 mx-auto text-vintage-gold/50 mb-3" />
                                                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                    Chưa có tin nhắn nào
                                                </p>
                                            </div>
                                        ) : (
                                            conversationMessages.map((msg) => {
                                                const isCustomer = msg.sender_type === 'customer' || !msg.sender_type;
                                                
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} px-1`}
                                                    >
                                                        <div className={`max-w-[75%] sm:max-w-[70%] md:max-w-[65%] min-w-[120px] rounded-lg p-3 sm:p-4 break-words shadow-sm ${
                                                            isCustomer
                                                                ? 'bg-vintage-gold/30 text-vintage-darkwood dark:text-vintage-cream'
                                                                : 'bg-vintage-cream/50 dark:bg-gray-700 text-vintage-darkwood dark:text-vintage-cream'
                                                        }`}>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-xs font-semibold">
                                                                    {isCustomer ? 'Bạn' : 'Admin'}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                                                            <p className={`text-xs mt-2 ${
                                                                isCustomer ? 'text-vintage-darkwood/70 dark:text-vintage-cream/70' : 'text-vintage-wood/70 dark:text-vintage-lightwood/70'
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
                                <div className="p-2 sm:p-3 border-t border-vintage-gold/20 flex-shrink-0 bg-white dark:bg-dark-card">
                                    <form onSubmit={handleSubmit} className="flex gap-2 min-w-0">
                                        <input
                                            type="text"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Nhập tin nhắn..."
                                            className="flex-1 input-vintage min-w-0"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-vintage px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {loading ? (
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
                                <div className="w-full max-w-2xl p-4 sm:p-6">
                                    {/* New Conversation Form */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-vintage-gold/20 rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-vintage-gold" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-2xl font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                                Gửi tin nhắn hỗ trợ
                                            </h2>
                                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                                Nhân viên sẽ phản hồi trong thời gian sớm nhất
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                                required={!formData.conversation_id}
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
