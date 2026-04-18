import { useState, useEffect } from 'react';
import { QrCode, Copy, Check, RefreshCw, Building2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/format';

const QRCodePayment = ({ order, onPaymentComplete, onPaymentFailed }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [bankInfo, setBankInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState('');
    const [expiresAt, setExpiresAt] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);

    useEffect(() => {
        if (order && order.id) {
            console.log('QRCodePayment: Order received:', order);
            generateQRCode();
            // Set expiration time (30 minutes from now)
            const expirationTime = new Date(Date.now() + 30 * 60 * 1000);
            setExpiresAt(expirationTime);
        } else {
            console.warn('QRCodePayment: Order is missing or invalid:', order);
        }
    }, [order]);

    // Countdown timer
    useEffect(() => {
        if (!expiresAt) return;

        const timer = setInterval(() => {
            const now = new Date();
            const diff = expiresAt - now;

            if (diff <= 0) {
                setTimeRemaining(null);
                clearInterval(timer);
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    const generateQRCode = async () => {
        try {
            setLoading(true);
            // Import paymentService dynamically to avoid circular dependency
            const { paymentService } = await import('../../services/paymentService');
            const response = await paymentService.createQRCodePayment(order.id);
            
            console.log('QR Code API Response:', response);
            
            // API interceptor đã unwrap response.data, nên response trực tiếp là data object
            // Structure: { success: true, message: "...", data: { qr_code_url, bank_info, ... } }
            if (response?.success && response?.data) {
                setQrCodeUrl(response.data.qr_code_url);
                setBankInfo(response.data.bank_info);
                setPaymentMessage(response.data.payment_message);
            } else {
                const errorMessage = response?.message || 'Không thể tạo mã QR thanh toán';
                console.error('QR Code creation failed:', response);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            // Error đã được interceptor xử lý, error object sẽ có message
            const errorMessage = error?.message || 
                                'Không thể tạo mã QR thanh toán. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const copyAccountNumber = () => {
        if (bankInfo?.account_number) {
            navigator.clipboard.writeText(bankInfo.account_number);
            setCopied(true);
            toast.success('Đã sao chép số tài khoản!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const copyPaymentMessage = () => {
        if (paymentMessage) {
            navigator.clipboard.writeText(paymentMessage);
            toast.success('Đã sao chép nội dung chuyển khoản!');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <RefreshCw className="w-8 h-8 text-vintage-gold animate-spin" />
                <p className="text-vintage-wood dark:text-vintage-lightwood">
                    Đang tạo mã QR thanh toán...
                </p>
            </div>
        );
    }

    if (!qrCodeUrl || !bankInfo) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500 mb-4">Không thể tạo mã QR thanh toán</p>
                <button
                    onClick={generateQRCode}
                    className="btn-vintage"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="card-vintage p-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-vintage-gold/10 rounded-full mb-4">
                    <QrCode className="w-8 h-8 text-vintage-gold" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-vintage-darkwood dark:text-vintage-cream mb-2">
                    Thanh Toán Qua Mã QR
                </h3>
                <p className="text-vintage-wood dark:text-vintage-lightwood">
                    Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
                <div className="relative bg-white p-4 rounded-lg shadow-lg">
                    <img
                        src={qrCodeUrl}
                        alt="QR Code Thanh Toán"
                        className="w-64 h-64"
                        onError={(e) => {
                            console.error('QR code image failed to load');
                            e.target.src = 'https://via.placeholder.com/256?text=QR+Code+Error';
                        }}
                    />
                    {timeRemaining && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                            Hết hạn: {timeRemaining}
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Amount */}
            <div className="bg-vintage-gold/5 rounded-lg p-4 mb-6 text-center">
                <p className="text-sm text-vintage-wood dark:text-vintage-lightwood mb-1">
                    Số tiền cần thanh toán
                </p>
                <p className="text-3xl font-bold text-vintage-bronze dark:text-vintage-gold">
                    {formatCurrency(order.total_amount)}
                </p>
            </div>

            {/* Bank Info */}
            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-vintage-gold" />
                        <div>
                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                Ngân hàng
                            </p>
                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                {bankInfo.bank_name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                        <User className="w-5 h-5 text-vintage-gold" />
                        <div className="flex-1">
                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                Chủ tài khoản
                            </p>
                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream">
                                {bankInfo.account_name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-vintage-gold font-bold">#</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                Số tài khoản
                            </p>
                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream font-mono">
                                {bankInfo.account_number}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={copyAccountNumber}
                        className="ml-4 p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                        title="Sao chép số tài khoản"
                    >
                        {copied ? (
                            <Check className="w-5 h-5 text-green-500" />
                        ) : (
                            <Copy className="w-5 h-5 text-vintage-gold" />
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-vintage-gold font-bold">💬</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-vintage-wood dark:text-vintage-lightwood">
                                Nội dung chuyển khoản
                            </p>
                            <p className="font-semibold text-vintage-darkwood dark:text-vintage-cream font-mono text-sm break-all">
                                {paymentMessage}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={copyPaymentMessage}
                        className="ml-4 p-2 hover:bg-vintage-gold/10 rounded-lg transition-colors"
                        title="Sao chép nội dung"
                    >
                        <Copy className="w-5 h-5 text-vintage-gold" />
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-vintage-sage/10 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                    Hướng dẫn thanh toán:
                </p>
                <ol className="text-sm text-vintage-wood dark:text-vintage-lightwood space-y-1 list-decimal list-inside">
                    <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                    <li>Chọn tính năng "Quét mã QR" hoặc "Chuyển khoản QR"</li>
                    <li>Quét mã QR trên màn hình</li>
                    <li>Kiểm tra thông tin và xác nhận thanh toán</li>
                    <li>Hệ thống sẽ tự động cập nhật trạng thái thanh toán</li>
                </ol>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
                <button
                    onClick={generateQRCode}
                    className="text-sm text-vintage-gold hover:text-vintage-bronze transition-colors flex items-center justify-center mx-auto space-x-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Tạo lại mã QR</span>
                </button>
            </div>
        </div>
    );
};

export default QRCodePayment;

