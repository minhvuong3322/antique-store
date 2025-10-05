import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const ContactPage = () => {
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

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="card-vintage p-8">
                        <h2 className="font-serif text-2xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-6">
                            Gửi Tin Nhắn
                        </h2>

                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    Họ và tên
                                </label>
                                <input type="text" className="input-vintage" placeholder="Nguyễn Văn A" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    Email
                                </label>
                                <input type="email" className="input-vintage" placeholder="email@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    Số điện thoại
                                </label>
                                <input type="tel" className="input-vintage" placeholder="0123 456 789" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-vintage-darkwood dark:text-vintage-cream mb-2">
                                    Tin nhắn
                                </label>
                                <textarea
                                    className="input-vintage"
                                    rows={5}
                                    placeholder="Nội dung tin nhắn của bạn..."
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-vintage w-full">
                                Gửi Tin Nhắn
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


