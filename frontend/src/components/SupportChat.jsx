import { MessageCircle } from 'lucide-react';

const SupportChat = () => {
    const handleZaloContact = () => {
        window.open('https://zalo.me/0706166053', '_blank');
    };

    return (
        <button
            onClick={handleZaloContact}
            className="fixed bottom-6 right-6 z-50 bg-[#0068FF] hover:bg-[#0052CC] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group"
            aria-label="Chat Zalo"
        >
            <MessageCircle className="w-6 h-6" />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-vintage-darkwood text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat Zalo ngay!
            </span>
        </button>
    );
};

export default SupportChat;

