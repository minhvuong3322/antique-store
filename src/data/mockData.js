/**
 * Mock data for development and demo purposes
 * TODO: Replace with real API calls when backend is ready
 */

export const mockProducts = [
    {
        id: 1,
        name: 'Bình Hoa Gốm Sứ Thanh Hoa',
        nameEn: 'Qing Dynasty Porcelain Vase',
        price: 45000000,
        era: '1850-1900',
        origin: 'Trung Quốc',
        originEn: 'China',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'ceramics',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://dytbw3ui6vsu6.cloudfront.net/media/catalog/product/resize/914x914/1/0/10518500_1_PLP_1.webp',
            'https://dytbw3ui6vsu6.cloudfront.net/media/catalog/product/resize/914x914/1/0/10518500_1_PLP_1.webp'
        ],
        description: 'Bình hoa gốm sứ quý hiếm từ thời Thanh Hoa, được trang trí hoa văn rồng phượng tinh xảo. Sản phẩm được bảo quản nguyên vẹn qua hơn 150 năm.',
        descriptionEn: 'Rare porcelain vase from Qing Dynasty, decorated with exquisite dragon and phoenix patterns. Perfectly preserved for over 150 years.',
        specifications: {
            height: '35cm',
            diameter: '20cm',
            weight: '2.5kg',
            material: 'Gốm sứ / Porcelain'
        }
    },
    {
        id: 2,
        name: 'Đồng Hồ Quả Lắc Pháp Cổ',
        nameEn: 'French Antique Pendulum Clock',
        price: 28000000,
        era: '1920-1930',
        origin: 'Pháp',
        originEn: 'France',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'clocks',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800',
            'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800'
        ],
        description: 'Đồng hồ quả lắc cơ học Pháp từ thập niên 1920, vỏ gỗ sồi nguyên bản, cơ chế vận hành hoàn hảo với âm thanh trong trẻo.',
        descriptionEn: 'Mechanical French pendulum clock from 1920s, original oak case, perfectly working mechanism with clear chime.',
        specifications: {
            height: '80cm',
            width: '35cm',
            depth: '18cm',
            material: 'Gỗ sồi, Đồng / Oak wood, Bronze'
        }
    },
    {
        id: 3,
        name: 'Tủ Thuốc Gỗ Xưa',
        nameEn: 'Vintage Apothecary Cabinet',
        price: 65000000,
        era: '1880-1920',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Đã phục hồi',
        conditionEn: 'Restored',
        category: 'furniture',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://dogotruongnhung.com/wp-content/uploads/2022/08/IMG_6277-2048x2048.jpg',
            'https://dogotruongnhung.com/wp-content/uploads/2022/08/IMG_6277-2048x2048.jpg'
        ],
        description: 'Tủ thuốc cổ bằng gỗ lim với 48 ngăn kéo nhỏ, từng được sử dụng trong nhà thuốc Đông y. Đã được phục hồi tinh tế giữ nguyên nét cổ.',
        descriptionEn: 'Antique wooden apothecary cabinet with 48 small drawers, formerly used in traditional medicine shop. Carefully restored maintaining original charm.',
        specifications: {
            height: '120cm',
            width: '90cm',
            depth: '40cm',
            material: 'Gỗ lim / Ironwood'
        }
    },
    {
        id: 4,
        name: 'Đèn Dầu Đồng Thời Pháp',
        nameEn: 'French Colonial Oil Lamp',
        price: 12000000,
        era: '1900-1940',
        origin: 'Pháp - Đông Dương',
        originEn: 'France - Indochina',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'lighting',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'
        ],
        description: 'Đèn dầu bằng đồng từ thời Pháp thuộc, thiết kế tinh xảo với hoa văn chạm khắc thủ công.',
        descriptionEn: 'Bronze oil lamp from French colonial period, exquisite design with hand-carved patterns.',
        specifications: {
            height: '45cm',
            diameter: '15cm',
            material: 'Đồng / Bronze'
        }
    },
    {
        id: 5,
        name: 'Bàn Trà Gỗ Hương',
        nameEn: 'Rosewood Tea Table',
        price: 38000000,
        era: '1950-1970',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'furniture',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://gonghethuat.vn/wp-content/uploads/2022/03/ban-tra-go.jpg'
        ],
        description: 'Bàn trà gỗ hương nguyên khối với họa tiết rồng chạm nổi tinh xảo, thể hiện đỉnh cao nghệ thuật mộc của Việt Nam.',
        descriptionEn: 'Solid rosewood tea table with exquisite carved dragon patterns, representing the pinnacle of Vietnamese woodcraft.',
        specifications: {
            height: '45cm',
            length: '80cm',
            width: '50cm',
            material: 'Gỗ hương / Rosewood'
        }
    },
    {
        id: 6,
        name: 'Ấm Trà Bạc Hoàng Gia',
        nameEn: 'Royal Silver Tea Pot',
        price: 22000000,
        era: '1890-1910',
        origin: 'Anh',
        originEn: 'England',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'silverware',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://product.hstatic.net/200000296482/product/000000029164-14-xl_76ade7b821b346fc82ca2292677c35f9_master.jpg',
            'https://product.hstatic.net/200000296482/product/000000029164-14-xl_76ade7b821b346fc82ca2292677c35f9_master.jpg'
        ],
        description: 'Ấm trà bạc nguyên chất với dấu ấn hoàng gia Anh, thiết kế Victorian cổ điển, trọng lượng 850g.',
        descriptionEn: 'Sterling silver tea pot with British royal hallmark, classic Victorian design, weighs 850g.',
        specifications: {
            height: '18cm',
            capacity: '800ml',
            weight: '850g',
            material: 'Bạc 925 / Sterling Silver'
        }
    },
    // Thêm sản phẩm Gốm Sứ
    {
        id: 7,
        name: 'Bộ Chén Tách Gốm Bát Tràng',
        nameEn: 'Bat Trang Ceramic Tea Set',
        price: 8500000,
        era: '1970-1980',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'ceramics',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1525974160448-038dacadcc71?w=800'
        ],
        description: 'Bộ chén tách gốm Bát Tràng với hoa văn sen cổ điển, men màu xanh lam đặc trưng. Gồm 1 ấm và 6 chén.',
        descriptionEn: 'Bat Trang ceramic tea set with classic lotus patterns, characteristic blue glaze. Includes 1 pot and 6 cups.',
        specifications: {
            set: '1 ấm + 6 chén',
            material: 'Gốm sứ / Ceramic',
            origin: 'Làng Bát Tràng'
        }
    },
    {
        id: 8,
        name: 'Chum Sành Cổ',
        nameEn: 'Antique Clay Jar',
        price: 15000000,
        era: '1900-1930',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Đã phục hồi',
        conditionEn: 'Restored',
        category: 'ceramics',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'
        ],
        description: 'Chum sành cổ dùng đựng nước, men nâu đặc trưng của gốm Việt Nam xưa, miệng chum rộng 40cm.',
        descriptionEn: 'Antique clay water jar with characteristic brown glaze of old Vietnamese pottery, 40cm mouth diameter.',
        specifications: {
            height: '60cm',
            diameter: '50cm',
            material: 'Gốm sành / Earthenware'
        }
    },
    {
        id: 9,
        name: 'Đĩa Gốm Sứ Nhật Bản',
        nameEn: 'Japanese Ceramic Plate',
        price: 6800000,
        era: '1960-1970',
        origin: 'Nhật Bản',
        originEn: 'Japan',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'ceramics',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://macdanhtra.com/wp-content/uploads/2023/07/chen-khai-su-canh-duc-phan-thai-cao-cap-ve-tay-rong-dep-as73-1.jpg'
        ],
        description: 'Đĩa gốm sứ Nhật Bản với họa tiết hoa anh đào, kỹ thuật vẽ tay truyền thống, đường kính 25cm.',
        descriptionEn: 'Japanese ceramic plate with cherry blossom pattern, traditional hand-painted technique, 25cm diameter.',
        specifications: {
            diameter: '25cm',
            weight: '400g',
            material: 'Gốm sứ / Porcelain'
        }
    },
    // Thêm sản phẩm Đồ Gỗ
    {
        id: 10,
        name: 'Ghế Salon Gỗ Gụ',
        nameEn: 'Rosewood Salon Chair',
        price: 52000000,
        era: '1950-1960',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'furniture',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
        ],
        description: 'Bộ ghế salon gỗ gụ ta 6 món, chạm khắc họa tiết rồng phượng, tay vịn cong thanh lịch.',
        descriptionEn: 'Rosewood salon set of 6 pieces, carved with dragon and phoenix motifs, elegant curved armrests.',
        specifications: {
            set: '6 món (1 bàn + ghế)',
            material: 'Gỗ gụ / Rosewood',
            style: 'Minh - Thanh'
        }
    },
    {
        id: 11,
        name: 'Tủ Chè Gỗ Hương',
        nameEn: 'Rosewood Display Cabinet',
        price: 78000000,
        era: '1920-1940',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Đã phục hồi',
        conditionEn: 'Restored',
        category: 'furniture',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800'
        ],
        description: 'Tủ chè gỗ hương 4 cánh, có kính, chạm khắc tứ quý tinh xảo, dùng trưng bày đồ sứ quý.',
        descriptionEn: 'Four-door rosewood display cabinet with glass, exquisitely carved Four Gentlemen motif, for displaying fine china.',
        specifications: {
            height: '180cm',
            width: '120cm',
            depth: '45cm',
            material: 'Gỗ hương / Rosewood'
        }
    },
    {
        id: 12,
        name: 'Giường Ngủ Gỗ Trắc',
        nameEn: 'Teak Antique Bed',
        price: 95000000,
        era: '1900-1920',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'furniture',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
        ],
        description: 'Giường ngủ gỗ trắc cổ kiểu ba kê, chạm rồng phượng tứ linh, nguyên bản hoàn chỉnh.',
        descriptionEn: 'Antique teak bed in ba ke style, carved with dragon, phoenix and four sacred animals, complete original condition.',
        specifications: {
            length: '200cm',
            width: '180cm',
            height: '220cm',
            material: 'Gỗ trắc / Teak'
        }
    },
    // Thêm sản phẩm Đồng Hồ
    {
        id: 13,
        name: 'Đồng Hồ Để Bàn Đức',
        nameEn: 'German Table Clock',
        price: 18500000,
        era: '1930-1950',
        origin: 'Đức',
        originEn: 'Germany',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'clocks',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800'
        ],
        description: 'Đồng hồ để bàn cơ Đức với vỏ gỗ óc chó, chuông đồng báo giờ, cơ chế vận hành êm ái.',
        descriptionEn: 'German mechanical table clock with walnut case, brass chime, smooth running mechanism.',
        specifications: {
            height: '25cm',
            width: '30cm',
            material: 'Gỗ óc chó, Đồng / Walnut, Brass',
            mechanism: 'Cơ học / Mechanical'
        }
    },
    {
        id: 14,
        name: 'Đồng Hồ Treo Tường Kiểu Pháp',
        nameEn: 'French Wall Clock',
        price: 24000000,
        era: '1910-1930',
        origin: 'Pháp',
        originEn: 'France',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'clocks',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://vangvong.com/wp-content/uploads/2023/11/products-Djong-Ho-Co-Odo-Nhap-Phap.png'
        ],
        description: 'Đồng hồ treo tường Pháp với mặt số men trắng, kim đồng, vỏ gỗ chạm khắc hoa văn Art Nouveau.',
        descriptionEn: 'French wall clock with white enamel dial, brass hands, wooden case carved with Art Nouveau patterns.',
        specifications: {
            height: '65cm',
            width: '40cm',
            material: 'Gỗ, Đồng, Men / Wood, Brass, Enamel'
        }
    },
    // Thêm sản phẩm Đèn
    {
        id: 15,
        name: 'Đèn Chùm Pha Lê',
        nameEn: 'Crystal Chandelier',
        price: 85000000,
        era: '1920-1940',
        origin: 'Pháp',
        originEn: 'France',
        condition: 'Đã phục hồi',
        conditionEn: 'Restored',
        category: 'lighting',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://casani.vn/img/image/new/989/den-chum-pha-le-nen-1.jpg'
        ],
        description: 'Đèn chùm pha lê Pháp 12 tay, pha lê Baccarat chính hãng, khung đồng mạ vàng, ánh sáng lấp lánh.',
        descriptionEn: 'French crystal chandelier with 12 arms, authentic Baccarat crystal, gold-plated brass frame, sparkling light.',
        specifications: {
            height: '90cm',
            diameter: '80cm',
            arms: '12 tay',
            material: 'Pha lê, Đồng mạ vàng / Crystal, Gold-plated brass'
        }
    },
    {
        id: 16,
        name: 'Đèn Bàn Tiffany',
        nameEn: 'Tiffany Table Lamp',
        price: 32000000,
        era: '1950-1970',
        origin: 'Mỹ',
        originEn: 'USA',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'lighting',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'
        ],
        description: 'Đèn bàn phong cách Tiffany với chao kính ghép nhiều màu sắc, họa tiết hoa chuông, chân đồng.',
        descriptionEn: 'Tiffany style table lamp with multi-colored stained glass shade, bell flower pattern, bronze base.',
        specifications: {
            height: '55cm',
            diameter: '35cm',
            material: 'Kính màu, Đồng / Stained glass, Bronze'
        }
    },
    {
        id: 17,
        name: 'Đèn Lồng Nhật Bản',
        nameEn: 'Japanese Lantern',
        price: 9500000,
        era: '1960-1980',
        origin: 'Nhật Bản',
        originEn: 'Japan',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'lighting',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://denvietmake.com/wp-content/uploads/2024/09/Den-long-Nhat-Ban-1536x1025.jpg'
        ],
        description: 'Đèn lồng giấy washi truyền thống Nhật Bản, khung tre, vẽ tay hoa anh đào, ánh sáng dịu nhẹ.',
        descriptionEn: 'Traditional Japanese washi paper lantern, bamboo frame, hand-painted cherry blossoms, soft lighting.',
        specifications: {
            height: '40cm',
            diameter: '30cm',
            material: 'Giấy washi, Tre / Washi paper, Bamboo'
        }
    },
    // Thêm sản phẩm Đồ Bạc
    {
        id: 18,
        name: 'Bộ Dao Muỗng Nĩa Bạc',
        nameEn: 'Silver Cutlery Set',
        price: 28000000,
        era: '1900-1920',
        origin: 'Anh',
        originEn: 'England',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'silverware',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://e-noritake.com/wp-content/uploads/2024/11/bo-dao-muong-nia-25-mon-danh-cho-5-nguoi-yamaco-crystal-line-crs-25-768x768.jpg',
            'https://e-noritake.com/wp-content/uploads/2024/11/bo-dao-muong-nia-25-mon-danh-cho-5-nguoi-yamaco-crystal-line-crs-25-768x768.jpg'
        ],
        description: 'Bộ dao muỗng nĩa bạc 925 cho 12 người, họa tiết hoa hồng chạm nổi, có hộp gỗ đựng.',
        descriptionEn: 'Sterling silver cutlery set for 12 people, embossed rose pattern, comes with wooden case.',
        specifications: {
            set: '72 món (12 người)',
            weight: '3.5kg',
            material: 'Bạc 925 / Sterling Silver'
        }
    },
    {
        id: 19,
        name: 'Khay Bạc Chạm Khắc',
        nameEn: 'Engraved Silver Tray',
        price: 16500000,
        era: '1920-1940',
        origin: 'Pháp',
        originEn: 'France',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'silverware',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
        ],
        description: 'Khay bạc hình oval với hoa văn rococo chạm khắc tinh xảo, viền nổi, đường kính 45cm.',
        descriptionEn: 'Oval silver tray with exquisitely engraved rococo patterns, raised rim, 45cm diameter.',
        specifications: {
            length: '45cm',
            width: '35cm',
            weight: '1.2kg',
            material: 'Bạc 900 / Silver 900'
        }
    },
    // Thêm sản phẩm Tranh
    {
        id: 20,
        name: 'Tranh Sơn Dầu Phong Cảnh',
        nameEn: 'Oil Painting Landscape',
        price: 48000000,
        era: '1960-1970',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'paintings',
        inStock: true,
        isUnique: true,
        featured: true,
        images: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'
        ],
        description: 'Tranh sơn dầu phong cảnh làng quê Việt Nam, có chữ ký họa sĩ, khung gỗ nguyên bản.',
        descriptionEn: 'Oil painting of Vietnamese countryside landscape, artist signed, original wooden frame.',
        specifications: {
            size: '80cm x 60cm',
            medium: 'Sơn dầu trên canvas / Oil on canvas',
            frame: 'Khung gỗ nguyên bản / Original wood frame'
        }
    },
    {
        id: 21,
        name: 'Tranh Khắc Gỗ Đông Hồ',
        nameEn: 'Dong Ho Woodblock Print',
        price: 12500000,
        era: '1970-1980',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tốt',
        conditionEn: 'Good',
        category: 'paintings',
        inStock: true,
        isUnique: false,
        featured: false,
        images: [
            'https://tranhdongho.info/uploads/products/tranh-khac-go-vinh-quy-bai-to-tkg013.jpg'
        ],
        description: 'Tranh Đông Hồ truyền thống với họa tiết lợn rừng, màu sắc tự nhiên từ thực vật, giấy dó.',
        descriptionEn: 'Traditional Dong Ho woodblock print with wild boar motif, natural plant-based colors, do paper.',
        specifications: {
            size: '40cm x 30cm',
            material: 'Giấy dó, Màu thực vật / Do paper, Plant-based colors',
            technique: 'Khắc gỗ / Woodblock printing'
        }
    },
    {
        id: 22,
        name: 'Tranh Thêu Tứ Quý',
        nameEn: 'Embroidered Four Gentlemen',
        price: 35000000,
        era: '1950-1970',
        origin: 'Việt Nam',
        originEn: 'Vietnam',
        condition: 'Tuyệt hảo',
        conditionEn: 'Excellent',
        category: 'paintings',
        inStock: true,
        isUnique: true,
        featured: false,
        images: [
            'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800'
        ],
        description: 'Tranh thêu tay tứ quý (Mai - Lan - Cúc - Trúc), tơ tằm cao cấp, khung gỗ gụ.',
        descriptionEn: 'Hand-embroidered Four Gentlemen (Plum - Orchid - Chrysanthemum - Bamboo), premium silk threads, rosewood frame.',
        specifications: {
            size: '100cm x 60cm',
            material: 'Tơ tằm / Silk threads',
            technique: 'Thêu tay / Hand embroidery',
            frame: 'Gỗ gụ / Rosewood'
        }
    }
]

export const mockCategories = [
    { id: 'ceramics', name: 'Gốm Sứ', nameEn: 'Ceramics', icon: '🏺' },
    { id: 'furniture', name: 'Đồ Gỗ', nameEn: 'Furniture', icon: '🪑' },
    { id: 'clocks', name: 'Đồng Hồ', nameEn: 'Clocks', icon: '🕰️' },
    { id: 'lighting', name: 'Đèn', nameEn: 'Lighting', icon: '💡' },
    { id: 'silverware', name: 'Đồ Bạc', nameEn: 'Silverware', icon: '🍽️' },
    { id: 'paintings', name: 'Tranh', nameEn: 'Paintings', icon: '🖼️' }
]

export const mockTestimonials = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        comment: 'Sản phẩm tuyệt vời, đúng như mô tả. Đội ngũ tư vấn rất chuyên nghiệp.',
        commentEn: 'Excellent product, exactly as described. Very professional consulting team.'
    },
    {
        id: 2,
        name: 'Trần Thị B',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 5,
        comment: 'Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng với chiếc bình gốm cổ.',
        commentEn: 'Fast delivery, careful packaging. Very satisfied with the antique vase.'
    }
]

