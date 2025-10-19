/**
 * PDF Generator
 * Generate PDF invoices using PDFKit
 */
const PDFDocument = require('pdfkit');
const logger = require('./logger');

/**
 * Generate Invoice PDF
 */
const generateInvoicePDF = async (invoiceData) => {
    return new Promise((resolve, reject) => {
        try {
            const {
                invoice_number,
                order,
                created_at
            } = invoiceData;

            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                info: {
                    Title: `Invoice ${invoice_number}`,
                    Author: 'Antique Store'
                }
            });

            // Buffer to store PDF
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // Company Header
            doc.fontSize(24)
                .fillColor('#667eea')
                .text('ANTIQUE STORE', 50, 50);

            doc.fontSize(10)
                .fillColor('#666')
                .text('Cửa hàng đồ cổ', 50, 80)
                .text('Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM', 50, 95)
                .text('Điện thoại: 0123-456-789', 50, 110)
                .text('Email: contact@antiquestore.com', 50, 125);

            // Invoice Title
            doc.fontSize(18)
                .fillColor('#333')
                .text('HÓA ĐƠN BÁN HÀNG', 350, 50);

            doc.fontSize(10)
                .fillColor('#666')
                .text(`Số: ${invoice_number}`, 350, 75)
                .text(`Ngày: ${new Date(created_at).toLocaleDateString('vi-VN')}`, 350, 90);

            // Line separator
            doc.moveTo(50, 160)
                .lineTo(545, 160)
                .strokeColor('#e0e0e0')
                .stroke();

            // Customer Information
            let yPos = 180;
            doc.fontSize(12)
                .fillColor('#333')
                .text('THÔNG TIN KHÁCH HÀNG', 50, yPos);

            yPos += 20;
            doc.fontSize(10)
                .fillColor('#666')
                .text(`Họ tên: ${order.User?.full_name || 'N/A'}`, 50, yPos);

            yPos += 15;
            doc.text(`Email: ${order.User?.email || 'N/A'}`, 50, yPos);

            yPos += 15;
            doc.text(`Điện thoại: ${order.User?.phone || 'N/A'}`, 50, yPos);

            yPos += 15;
            doc.text(`Địa chỉ: ${order.shipping_address || 'N/A'}`, 50, yPos, {
                width: 495,
                align: 'left'
            });

            // Order Information
            yPos += 35;
            doc.fontSize(12)
                .fillColor('#333')
                .text('THÔNG TIN ĐƠN HÀNG', 50, yPos);

            yPos += 20;
            doc.fontSize(10)
                .fillColor('#666')
                .text(`Mã đơn hàng: ${order.order_number}`, 50, yPos);

            yPos += 15;
            doc.text(`Ngày đặt: ${new Date(order.created_at).toLocaleDateString('vi-VN')}`, 50, yPos);

            yPos += 15;
            const statusMap = {
                pending: 'Chờ xử lý',
                confirmed: 'Đã xác nhận',
                shipping: 'Đang giao',
                delivered: 'Đã giao',
                cancelled: 'Đã hủy'
            };
            doc.text(`Trạng thái: ${statusMap[order.status] || order.status}`, 50, yPos);

            // Product Table
            yPos += 35;
            doc.fontSize(12)
                .fillColor('#333')
                .text('CHI TIẾT SẢN PHẨM', 50, yPos);

            yPos += 20;

            // Table Header
            const tableTop = yPos;
            const tableHeaders = [
                { text: 'STT', x: 50, width: 40 },
                { text: 'Sản phẩm', x: 90, width: 200 },
                { text: 'Số lượng', x: 290, width: 70 },
                { text: 'Đơn giá', x: 360, width: 90 },
                { text: 'Thành tiền', x: 450, width: 95 }
            ];

            doc.fontSize(10)
                .fillColor('#fff')
                .rect(50, tableTop, 495, 25)
                .fillAndStroke('#667eea', '#667eea');

            tableHeaders.forEach(header => {
                doc.fillColor('#fff')
                    .text(header.text, header.x, tableTop + 7, {
                        width: header.width,
                        align: header.text === 'STT' ? 'center' : 'left'
                    });
            });

            // Table Body
            yPos = tableTop + 30;
            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(amount);
            };

            let itemNo = 1;
            order.order_details.forEach((item, index) => {
                const rowBg = index % 2 === 0 ? '#f9f9f9' : '#fff';

                doc.fillColor(rowBg)
                    .rect(50, yPos - 5, 495, 25)
                    .fill();

                doc.fillColor('#333')
                    .text(itemNo++, 50, yPos, { width: 40, align: 'center' })
                    .text(item.Product?.name || 'Sản phẩm', 90, yPos, { width: 200 })
                    .text(item.quantity.toString(), 290, yPos, { width: 70 })
                    .text(formatCurrency(item.unit_price), 360, yPos, { width: 90 })
                    .text(formatCurrency(item.subtotal), 450, yPos, { width: 95, align: 'right' });

                yPos += 25;

                // Check if need new page
                if (yPos > 700) {
                    doc.addPage();
                    yPos = 50;
                }
            });

            // Summary
            yPos += 10;
            doc.moveTo(50, yPos)
                .lineTo(545, yPos)
                .strokeColor('#e0e0e0')
                .stroke();

            yPos += 15;
            const summaryX = 360;

            // Subtotal
            doc.fontSize(10)
                .fillColor('#666')
                .text('Tạm tính:', summaryX, yPos)
                .text(formatCurrency(order.total_amount - (order.shipping_fee || 0) - (order.tax || 0) + (order.discount || 0)), 450, yPos, {
                    width: 95,
                    align: 'right'
                });

            // Shipping
            yPos += 20;
            doc.text('Phí vận chuyển:', summaryX, yPos)
                .text(formatCurrency(order.shipping_fee || 0), 450, yPos, {
                    width: 95,
                    align: 'right'
                });

            // Tax
            yPos += 20;
            doc.text('Thuế VAT:', summaryX, yPos)
                .text(formatCurrency(order.tax || 0), 450, yPos, {
                    width: 95,
                    align: 'right'
                });

            // Discount
            if (order.discount > 0) {
                yPos += 20;
                doc.text('Giảm giá:', summaryX, yPos)
                    .text(`-${formatCurrency(order.discount)}`, 450, yPos, {
                        width: 95,
                        align: 'right'
                    });
            }

            // Total
            yPos += 25;
            doc.fontSize(12)
                .fillColor('#333')
                .text('TỔNG CỘNG:', summaryX, yPos, { bold: true })
                .fontSize(14)
                .fillColor('#667eea')
                .text(formatCurrency(order.total_amount), 450, yPos, {
                    width: 95,
                    align: 'right'
                });

            // Payment Information
            yPos += 40;
            doc.fontSize(12)
                .fillColor('#333')
                .text('THÔNG TIN THANH TOÁN', 50, yPos);

            yPos += 20;
            const payment = order.Payment;
            if (payment) {
                const paymentMethodMap = {
                    cash: 'Tiền mặt',
                    bank_transfer: 'Chuyển khoản',
                    vnpay: 'VNPay',
                    momo: 'MoMo'
                };
                const paymentStatusMap = {
                    pending: 'Chờ thanh toán',
                    paid: 'Đã thanh toán',
                    failed: 'Thất bại',
                    refunded: 'Đã hoàn tiền'
                };

                doc.fontSize(10)
                    .fillColor('#666')
                    .text(`Phương thức: ${paymentMethodMap[payment.payment_method] || payment.payment_method}`, 50, yPos);

                yPos += 15;
                doc.text(`Trạng thái: ${paymentStatusMap[payment.payment_status] || payment.payment_status}`, 50, yPos);

                if (payment.transaction_id) {
                    yPos += 15;
                    doc.text(`Mã giao dịch: ${payment.transaction_id}`, 50, yPos);
                }
            }

            // Footer
            yPos = 750;
            doc.fontSize(8)
                .fillColor('#999')
                .text('Cảm ơn quý khách đã mua hàng tại Antique Store!', 50, yPos, {
                    width: 495,
                    align: 'center'
                });

            yPos += 12;
            doc.text('Hóa đơn được tạo tự động bởi hệ thống', 50, yPos, {
                width: 495,
                align: 'center'
            });

            // Finalize PDF
            doc.end();

            logger.info({ message: 'Invoice PDF generated', invoice_number });
        } catch (error) {
            logger.logError(error, { operation: 'generateInvoicePDF' });
            reject(error);
        }
    });
};

module.exports = {
    generateInvoicePDF
};


