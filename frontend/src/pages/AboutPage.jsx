import { Award, Heart, Shield, Users } from 'lucide-react'

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg">
            {/* Hero */}
            <section className="bg-gradient-to-br from-vintage-darkwood to-vintage-wood text-vintage-cream py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-elegant text-5xl md:text-6xl mb-6">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl font-serif text-vintage-cream/90">
                        Hành trình bảo tồn và tôn vinh giá trị của thời gian
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-vintage p-8 md:p-12">
                        <h2 className="font-elegant text-3xl text-vintage-darkwood dark:text-vintage-gold mb-6">
                            Câu Chuyện Của Chúng Tôi
                        </h2>
                        <div className="space-y-4 text-vintage-wood dark:text-vintage-lightwood leading-relaxed">
                            <p>
                                Shop Đồ Cổ được thành lập với niềm đam mê sâu sắc về lịch sử và nghệ thuật.
                                Chúng tôi tin rằng mỗi món đồ cổ không chỉ là một vật phẩm, mà còn là một câu chuyện,
                                một mảnh ghép của quá khứ mang đến cho hiện tại.
                            </p>
                            <p>
                                Với hơn 20 năm kinh nghiệm trong lĩnh vực sưu tầm và buôn bán đồ cổ,
                                chúng tôi tự hào mang đến cho khách hàng những sản phẩm quý hiếm,
                                được xác thực nguồn gốc rõ ràng và bảo quản cẩn thận.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-white dark:bg-dark-card">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-elegant text-4xl text-vintage-darkwood dark:text-vintage-gold text-center mb-12">
                        Giá Trị Cốt Lõi
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Xác Thực',
                                desc: '100% sản phẩm được chuyên gia thẩm định và xác nhận nguồn gốc'
                            },
                            {
                                icon: Award,
                                title: 'Chất Lượng',
                                desc: 'Cam kết chất lượng cao nhất trong từng sản phẩm chúng tôi cung cấp'
                            },
                            {
                                icon: Heart,
                                title: 'Đam Mê',
                                desc: 'Niềm yêu thích sâu sắc với nghệ thuật và lịch sử thúc đẩy chúng tôi'
                            },
                            {
                                icon: Users,
                                title: 'Tận Tâm',
                                desc: 'Đội ngũ chuyên nghiệp luôn sẵn sàng tư vấn và hỗ trợ khách hàng'
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-vintage-gold/10 rounded-full mb-6 group-hover:bg-vintage-gold/20 transition-colors">
                                    <value.icon className="w-10 h-10 text-vintage-gold" />
                                </div>
                                <h3 className="font-serif text-xl font-semibold text-vintage-darkwood dark:text-vintage-cream mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-vintage-wood dark:text-vintage-lightwood">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage


