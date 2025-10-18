# BÁO CÁO ĐỒ ÁN TỐT NGHIỆP

## XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ SHOP ĐỒ CỔ
### (Antique Store E-commerce Website)

---

Sinh viên thực hiện: [Tên sinh viên]  
Mã sinh viên: [Mã sinh viên]  
Lớp: [Lớp]  
Khoa: Công nghệ thông tin  
Trường: [Tên trường]  

Giảng viên hướng dẫn: [Tên giảng viên]  

Năm học: 2024-2025

---

## MỤC LỤC

### DANH MỤC BẢNG BIỂU
- Bảng 2.1: Bảng mô tả yêu cầu chức năng
- Bảng 2.2: Bảng đặc tả usecase Đăng nhập
- Bảng 2.3: Bảng đặc tả usecase Tìm kiếm và xem sản phẩm
- Bảng 2.4: Bảng đặc tả usecase đặt hàng sản phẩm
- Bảng 2.5: Bảng đặc tả usecase quản lý thông tin sản phẩm
- Bảng 2.6: Bảng đặc tả usecase nhập kho sản phẩm
- Bảng 2.7: Bảng đặc tả usecase Tìm kiếm hóa đơn
- Bảng 2.8: Bảng đặc tả usecase hóa đơn sản phẩm
- Bảng 2.9: Bảng đặc tả usecase bảo hành sản phẩm
- Bảng 2.10: Chi tiết cơ sở dữ liệu khách hàng
- Bảng 2.11: Chi tiết cơ sở dữ liệu sản phẩm
- Bảng 2.12: Chi tiết cơ sở dữ liệu nhà cung cấp
- Bảng 2.13: Chi tiết cơ sở dữ liệu đơn hàng
- Bảng 2.14: Chi tiết cơ sở dữ liệu bảo hành sản phẩm
- Bảng 2.15: Chi tiết cơ sở dữ liệu admin
- Bảng 2.16: Chi tiết cơ sở dữ liệu chi tiết đơn hàng
- Bảng 2.17: Chi tiết cơ sở dữ liệu cung cấp

### DANH MỤC HÌNH ẢNH
- Hình 2-1: Sơ đồ usecase chính
- Hình 2-2: Sơ đồ tuần tự Đăng nhập
- Hình 2-3: Sơ đồ tuần tự đặt mua sản phẩm
- Hình 2-4: Sơ đồ tuần tự tra cứu thông tin bảo hành
- Hình 2-5: Sơ đồ tuần tự quản lý nhập kho sản phẩm
- Hình 2-6: Sơ đồ lớp tổng quát
- Hình 2-7: Sơ đồ tổng quát mua một sản phẩm
- Hình 2-8: Sơ đồ tổng quát bảo hành một sản phẩm
- Hình 2-10: Mô hình cơ sở dữ liệu quan hệ
- Hình 3-1: Màn hình đăng ký
- Hình 3-2: Màn hình trang chủ - tab Kinh Doanh
- Hình 3-3: Màn hình giỏ hàng
- Hình 3-4: Màn hình bảo dưỡng sản phẩm
- Hình 3-5: Màn hình đăng nhập admin
- Hình 3-6: Màn hình trang chủ
- Hình 3-7: Màn hình Danh Mục các sản phẩm
- Hình 3-8: Màn hình sản phẩm
- Hình 3-9: Màn hình đơn hàng
- Hình 3-10: Màn hình doanh thu đã bán được
- Hình 3-11: Màn hình lịch bảo dưỡng
- Hình 3-12: Màn hình quản lý user

---

## TÓM TẮT ĐỒ ÁN

Đề tài "Xây dựng website thương mại điện tử Shop Đồ Cổ" gồm 4 chương:

Chương 1: TỔNG QUAN VỀ ĐỀ TÀIPhần đầu sẽ giới thiệu tổng quan về đề tài nghiên cứu, các phương pháp và đối tượng được nghiên cứu cũng như các công cụ hỗ trợ để xây dựng hệ thống.

Chương 2: PHÂN TÍCH THIẾT KẾ HỆ THỐNGPhần này tập trung phân tích và thiết kế hệ thống, bao gồm các nội dung như phân tích sơ đồ chức năng, sơ đồ ngữ cảnh, sơ đồ luồng dữ liệu…

Chương 3: HIỆN THỰC VÀ TRIỂN KHAI HỆ THỐNGPhần này đưa ra các bảng biểu, cơ sở dữ liệu và hiện thực các chức năng ở chương 2 qua hình ảnh từ hệ thống phần mềm đã được xây dựng.

Chương 4: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂNPhần cuối đưa ra các kết luận, đánh giá tổng quan về hệ thống, các hạn chế và hướng phát triển trong tương lai.

---

## CHƯƠNG 1: TỔNG QUAN VỀ ĐỀ TÀI

### 1.1. Đặt vấn đề

Trong những năm gần đây, khoa học và công nghệ Việt Nam đã không ngừng phát triển và từng bước hội nhập với xu thế toàn cầu. Đặc biệt, công nghệ thông tin dù còn non trẻ nhưng đã có tốc độ tăng trưởng nhanh chóng, trở thành nền tảng quan trọng trong nhiều lĩnh vực, từ đời sống xã hội đến sản xuất, quản lý. Tin học hóa trong quản lý giúp các nhà quản lý điều hành công việc một cách khoa học, chính xác và hiệu quả. Hầu hết các cơ quan, doanh nghiệp đều mong muốn áp dụng công nghệ thông tin để nâng cao hiệu suất hoạt động.

Trong bối cảnh đó, bước sang thời kỳ công nghệ 4.0, Thương mại điện tử (TMĐT) đã trở thành một xu hướng tất yếu, thay đổi hoàn toàn thói quen mua sắm và kinh doanh của con người. Một website TMĐT có thể được ví như một "cửa hàng trực tuyến" trên Internet, nơi người dùng dễ dàng tìm kiếm sản phẩm, so sánh giá, đặt hàng và thanh toán chỉ với vài thao tác trên điện thoại hay máy tính, thay vì phải đến tận cửa hàng.

Đặc biệt, với những sản phẩm đặc thù như đồ cổ - những món đồ có giá trị lịch sử và nghệ thuật cao - việc xây dựng một nền tảng thương mại điện tử chuyên nghiệp là vô cùng quan trọng. Đồ cổ là những sản phẩm độc bản, có giá trị cao và cần được bảo quản, trưng bày một cách cẩn thận. Khách hàng mua đồ cổ thường là những người có hiểu biết sâu sắc về lịch sử, nghệ thuật và có khả năng tài chính tốt.

Hiện tại, thị trường đồ cổ tại Việt Nam chủ yếu hoạt động theo phương thức truyền thống:
- Bán hàng tại cửa hàng vật lý
- Giao dịch qua mạng xã hội (Facebook, Zalo)
- Một số website đơn giản không chuyên nghiệp

Những hạn chế của phương thức hiện tại:1. Phạm vi tiếp cận hạn chế: Chỉ phục vụ khách hàng trong khu vực địa phương
2. Thiếu tính chuyên nghiệp: Giao diện không đẹp, thiếu thông tin chi tiết về sản phẩm
3. Khó quản lý: Không có hệ thống quản lý kho, đơn hàng hiệu quả
4. Thiếu bảo mật: Giao dịch không an toàn, dễ bị lừa đảo
5. Không có tính năng đa ngôn ngữ: Khó tiếp cận khách hàng quốc tế

### 1.2. Giải pháp

Quản lý bán hàng đồ cổ là một vấn đề trọng yếu mà bất kỳ đơn vị kinh doanh nào cũng phải quan tâm và đầu tư phát triển. Dù ở quy mô nhỏ hay lớn, hoạt động bán hàng đều liên quan trực tiếp đến doanh thu, lợi nhuận và sự phát triển bền vững của doanh nghiệp. Trong thực tế, quá trình bán hàng đồ cổ thường phát sinh nhiều sai sót như nhầm lẫn trong việc nhập – xuất hàng, quản lý tồn kho không chính xác, xử lý đơn hàng chậm trễ, hay thất lạc thông tin liên quan đến khách hàng và sản phẩm.

Chính vì vậy, yêu cầu đặt ra là phải tìm ra giải pháp giúp cho việc bán hàng đồ cổ diễn ra khoa học, minh bạch và hiệu quả nhất. Một hệ thống quản lý bán hàng đồ cổ hiện đại cần đảm bảo:

• Theo dõi chính xác thông tin hàng hóa từ khi nhập kho đến khi bán ra, tránh tình trạng thất thoát hoặc sai lệch dữ liệu.

• Quản lý khách hàng một cách toàn diện, bao gồm lịch sử mua hàng, phản hồi, nhu cầu và thói quen tiêu dùng, từ đó giúp doanh nghiệp xây dựng chiến lược chăm sóc khách hàng hiệu quả.

• Tự động hóa quá trình báo cáo và thống kê, giảm thiểu sai sót do làm thủ công, đồng thời cung cấp số liệu kịp thời cho nhà quản lý đưa ra quyết định.

• Hỗ trợ tối ưu hoạt động bán hàng đa kênh (cửa hàng truyền thống, website TMĐT, mạng xã hội), bảo đảm dữ liệu được đồng bộ và nhất quán.

Khi áp dụng công nghệ thông tin và thương mại điện tử vào quản lý bán hàng đồ cổ, doanh nghiệp không chỉ giải quyết được những bất cập trong hoạt động thường ngày mà còn nâng cao năng lực cạnh tranh trên thị trường.

### 1.3. Mục tiêu đề tài

Hiện nay, các quy trình quản lý bán hàng đồ cổ trong dự án khởi nghiệp của em vẫn chủ yếu thực hiện theo phương pháp thủ công, gây tốn nhiều thời gian cho việc kiểm kê và dễ phát sinh sai sót. Điều này không chỉ làm giảm hiệu quả trong công tác quản lý mà còn ảnh hưởng đến năng suất kinh doanh của cửa hàng. Với mong muốn tối ưu hóa quy trình làm việc, giảm bớt khối lượng công việc thủ công và nâng cao hiệu quả kinh doanh, em nhận thấy việc xây dựng một website thương mại điện tử chuyên nghiệp là nhu cầu cấp thiết.

Xuất phát từ thực tiễn đó, em đã quyết định chọn đề tài "XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ SHOP ĐỒ CỔ" để nghiên cứu và triển khai trong đồ án này, với kỳ vọng góp phần giải quyết những hạn chế hiện tại và mang lại một giải pháp quản lý hiện đại, hiệu quả hơn cho cửa hàng.

Mục tiêu cụ thể của đề tài:Đối với người mua: Cung cấp một công cụ tìm kiếm mạnh mẽ, cho phép họ dễ dàng tìm thấy món đồ cổ ưng ý dựa trên các tiêu chí như loại đồ cổ, niên đại, xuất xứ, giá tiền, tình trạng, v.v. Các thông tin chi tiết về đồ cổ cũng sẽ được hiển thị đầy đủ, giúp họ đưa ra quyết định mua hàng chính xác.

Đối với người bán: Tạo ra một kênh tiếp cận khách hàng tiềm năng rộng lớn, giúp họ đăng bán đồ cổ một cách dễ dàng và hiệu quả.

Đối với người quản trị: Xây dựng một hệ thống quản lý chuyên nghiệp, cho phép kiểm duyệt chặt chẽ thông tin đồ cổ đăng bán, đảm bảo tính xác thực và ngăn chặn các hành vi gian lận.

Để đạt được các mục tiêu trên, website sẽ được trang bị các chức năng chính:Chức năng dành cho người dùng: Đăng ký/đăng nhập tài khoản, tìm kiếm và lọc đồ cổ, xem thông tin chi tiết sản phẩm, đăng bán đồ cổ và quản lý thông tin cá nhân.

Chức năng dành cho admin: Quản lý sản phẩm, quản lý đơn hàng, quản lý người dùng, thống kê bán hàng, quản lý thanh toán.

### 1.4. Đối tượng, phương pháp nghiên cứu

#### 1.4.1. Đối tượng nghiên cứu
- Cơ chế, cách thức hoạt động của các nghiệp vụ bán hàng đồ cổ, quản lý thông tin
- Quy trình xây dựng, phát triển hệ thống thông tin quản lý thương mại điện tử
- Các công cụ, nền tảng lập trình để xây dựng hệ thống được nêu ở mục 1.4.3

#### 1.4.2. Phương pháp nghiên cứu
Để nghiên cứu và xây dựng website thương mại điện tử phù hợp với yêu cầu thực tế hiện nay, đề tài đã sử dụng các phương pháp sau:

- Phương pháp thu thập thông tin:- Phương pháp quan sát trực tiếp
- Phương pháp thu thập tài liệu: Thông qua các nguồn thu thập tài liệu như sách báo, mạng internet, tổng hợp các tài liệu, ngôn ngữ và công nghệ liên quan để xây dựng hệ thống thích hợp.

- Phương pháp mô hình hóa: Sử dụng các mô hình, sơ đồ mô tả lại các quy trình, nghiệp vụ quản lý hoạt động kinh doanh đồ cổ.

- Phương pháp phát triển hệ thống thông tin: Dựa trên những thông tin đã thu thập tiến hành phân tích, thiết kế hệ thống bao gồm các chức năng chính của website sẽ xây dựng, chuẩn hóa cơ sở dữ liệu và mã hóa để đưa ra sản phẩm website phù hợp yêu cầu.

#### 1.4.3. Công cụ sử dụng

- Hệ quản trị cơ sở dữ liệu: MySQL/PostgreSQL
- Ngôn ngữ lập trình: HTML, CSS, JavaScript, React, Node.js
- Trình soạn thảo mã: Visual Studio Code 2022
- Framework và thư viện: Express.js, Sequelize ORM, TailwindCSS

#### 1.4.4. Các thành phần của React và Node.js

React được cấu tạo từ các thành phần chính:
- Components: Các thành phần UI có thể tái sử dụng
- JSX: Cú pháp mở rộng JavaScript để viết HTML trong JavaScript
- State Management: Quản lý trạng thái của ứng dụng
- Props: Truyền dữ liệu giữa các components
- Hooks: Các hàm đặc biệt để sử dụng state và lifecycle trong functional components
- Virtual DOM: Tối ưu hóa việc render và cập nhật UI

Node.js bao gồm các thành phần:
- V8 Engine: JavaScript runtime engine
- Event Loop: Xử lý các sự kiện bất đồng bộ
- Modules: Hệ thống module để tổ chức code
- NPM: Package manager để quản lý dependencies
- Streams: Xử lý dữ liệu theo luồng
- Buffer: Xử lý dữ liệu binary

#### 1.4.5. Bố cục báo cáo
Ngoài phần mở đầu và kết luận, nội dung của khóa luận được kết cấu thành 4 chương như sau:

Chương 1: TỔNG QUAN VỀ ĐỀ TÀI
Chương 2: PHÂN TÍCH THIẾT KẾ HỆ THỐNG  
Chương 3: HIỆN THỰC VÀ TRIỂN KHAI HỆ THỐNG
Chương 4: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

---

## CHƯƠNG 2: PHÂN TÍCH THIẾT KẾ HỆ THỐNG

### 2.1. Phân tích yêu cầu hệ thống

#### 2.1.1. Yêu cầu chức năng

| STT | Tên chức năng | Mô tả |
|-----|---------------|-------|
| 1 | Đăng nhập | Cho phép Khách hàng, Admin, Nhà sản xuất đăng nhập vào hệ thống bằng tài khoản đã đăng ký. |
| 2 | Tìm kiếm và xem sản phẩm | Khách hàng có thể tìm kiếm đồ cổ theo nhu cầu và xem thông tin chi tiết như giá, niên đại, xuất xứ, tình trạng, hình ảnh. |
| 3 | Đặt hàng sản phẩm | Khách hàng chọn đồ cổ, nhập số lượng và gửi yêu cầu đặt hàng. Hệ thống xác nhận và thông báo kết quả. |
| 4 | Quản lý thông tin sản phẩm | Admin hoặc Nhà sản xuất có thể thêm mới, chỉnh sửa, xóa hoặc cập nhật thông tin đồ cổ. |
| 5 | Nhập kho sản phẩm | Nhà sản xuất nhập đồ cổ mới vào kho. Nếu sản phẩm đã tồn tại, hệ thống cập nhật số lượng. |
| 6 | Quản lý khách hàng | Chức năng này cho phép Admin thêm/ xóa/ sửa thông tin về khách hàng. |
| 7 | Xuất hóa đơn | Admin tạo hóa đơn cho đơn hàng đã xác nhận, nhập thông tin và gửi hóa đơn cho khách hàng |
| 8 | Quản lý bảo hành sản phẩm | Admin cập nhật thông tin bảo hành cho từng đồ cổ: thời hạn, điều kiện bảo hành, lịch sử bảo hành. Khách hàng có thể tra cứu thông tin bảo hành đồ cổ đã mua. |

Bảng 2.1 Bảng mô tả yêu cầu chức năng#### 2.1.2. Các yêu cầu phi chức năng

##### 2.1.2.1. Yêu cầu về hệ thống
• Yêu cầu về hiệu năng: Thời gian phản hồi nhanh nhất có thể.
• Yêu cầu về sự logic của cơ sở dữ liệu: Dữ liệu phải được đảm bảo tính toàn vẹn, tính nhất quán và các ràng buộc thiết kế.
• Hệ thống được xây dựng trên mã nguồn mở.• Hệ quản trị cơ sở dữ liệu là MySQL/PostgreSQL.• Phân tích và thiết kế được thực hiện theo chuẩn UML.• Các công cụ hỗ trợ không tính bản quyền, thư viện hỗ trợ khác phải là mã nguồn mở.• Hệ thống được thiết kế theo hướng có khả năng phát triển trong tương lai với việc thêm bớt các module, hoặc tích hợp hệ thống vào một hệ thống khác dễ dàng.#### 2.1.3. Các yêu cầu về giao diện

##### 2.1.3.1. Giao diện người dùng:
• Kiểu chữ sử dụng: Tahoma, cỡ chữ 10pt
• Tỷ lệ kích thước Form: Ưu tiên tỷ lệ 4:3 nhằm đảm bảo sự hài hòa và phù hợp với đa số màn hình hiển thị.
• Tiêu chuẩn hệ thống cần đáp ứng:+ Giao diện cần thể hiện sự chuyên nghiệp, đồng thời đảm bảo yếu tố thẩm mỹ với phong cách hoài cổ sang trọng
+ Toàn bộ văn bản hiển thị phải sử dụng font Unicode để đảm bảo tính tương thích và chuẩn hóa
+ Thiết kế giao diện phải phù hợp với độ phân giải màn hình tối thiểu 800x600 pixels, sử dụng chế độ màu ít nhất là High Color (16-bit)
+ Ngôn ngữ sử dụng xuyên suốt hệ thống: Tiếng Việt và English
+ Định dạng ngày tháng: DD/MM/YYYY
+ Định dạng số: 000.000.000 (có dấu chấm phân cách hàng nghìn)

### 2.2. Xây dựng sơ đồ usecase (Usecase Diagram)

#### 2.2.1. Sơ đồ usecase chính

Hình 2-1 Sơ đồ usecase chính#### 2.2.2. Đặc tả usecase

##### 2.2.2.1. Đặc tả chức năng Đăng nhập

| Tên usecase | Đăng nhập hệ thống |
|-------------|-------------------|
| Actor | Khách hàng, Admin, Nhà sản xuất |
| Mô tả | Cho phép người dùng đăng nhập vào hệ thống bằng tài khoản đã đăng ký. |
| Điều kiện tiên quyết | Tài khoản đã được đăng ký và kích hoạt. |
| Kết quả | • Nếu thành công: đăng nhập vào hệ thống và mở giao diện trang chủ<br>• Nếu thất bại: báo lỗi đăng nhập |
| Kịch bản chính | • Người dùng nhập tên đăng nhập và mật khẩu.<br>• Hệ thống kiểm tra thông tin.<br>• Nếu hợp lệ, đăng nhập thành công.<br>• Chuyển đến giao diện người dùng tương ứng. |
| Kịch bản phụ | Nếu sai Tên Đăng Nhập hoặc Mật Khẩu, hệ thống báo lỗi đăng nhập |

Bảng 2.2 Bảng đặc tả usecase Đăng nhập##### 2.2.2.2. Đặc tả chức năng tìm kiếm và xem sản phẩm

| Tên usecase | Tìm kiếm và xem sản phẩm |
|-------------|-------------------------|
| Actor | Khách hàng |
| Mô tả | Khách hàng tìm kiếm đồ cổ theo nhu cầu và xem thông tin chi tiết. |
| Điều kiện tiên quyết | Hệ thống có dữ liệu đồ cổ. |
| Kết quả | • Khách hàng dễ dàng tìm được đồ cổ phù hợp, xem đầy đủ thông tin để ra quyết định mua. |
| Kịch bản chính | • Khách hàng nhập từ khóa hoặc bộ lọc tìm kiếm.<br>• Hệ thống hiển thị danh sách đồ cổ phù hợp.<br>• Khách hàng chọn sản phẩm để xem chi tiết. |
| Kịch bản phụ | Nếu không có sản phẩm phù hợp → hiển thị "Không tìm thấy sản phẩm phù hợp" |

Bảng 2.3 Bảng đặc tả usecase Tìm kiếm và xem sản phẩm##### 2.2.2.3. Đặc tả chức năng đặt hàng sản phẩm

| Tên usecase | Đặt hàng sản phẩm |
|-------------|------------------|
| Actor | Khách hàng |
| Mô tả | Khách hàng gửi yêu cầu đặt hàng đồ cổ. |
| Điều kiện tiên quyết | Khách hàng đã đăng nhập. |
| Kết quả | Đơn hàng được tạo và lưu trữ, khách hàng nhận được xác nhận đặt hàng từ hệ thống. |
| Kịch bản chính | • Khách hàng chọn đồ cổ và số lượng.<br>• Nhấn "Đặt hàng".<br>• Hệ thống tạo đơn hàng và thông báo kết quả. |
| Kịch bản phụ | • Nếu sản phẩm hết hàng → hiển thị "Sản phẩm tạm hết hàng". |

Bảng 2.4 Bảng đặc tả usecase đặt hàng sản phẩm##### 2.2.2.4. Đặc tả chức năng quản lý thông tin sản phẩm

| Tên usecase | Quản lý thông tin sản phẩm |
|-------------|---------------------------|
| Actor | Admin, Nhà sản xuất |
| Mô tả | Quản lý thông tin đồ cổ: thêm, sửa, xóa, cập nhật. |
| Điều kiện tiên quyết | Người dùng có quyền quản trị. |
| Kết quả | Dữ liệu đồ cổ được cập nhật chính xác, giúp khách hàng luôn thấy thông tin mới nhất. |
| Kịch bản chính | • Người dùng truy cập danh sách đồ cổ.<br>• Chọn thao tác: thêm mới, chỉnh sửa, xóa.<br>• Nhập thông tin và lưu.<br>• Hệ thống cập nhật dữ liệu. |
| Kịch bản phụ | Nếu thiếu thông tin → hiển thị cảnh báo. |

Bảng 2.5 Bảng đặc tả usecase quản lý thông tin sản phẩm##### 2.2.2.5. Đặc tả chức năng nhập kho sản phẩm

| Tên usecase | Quản lý kho sản phẩm |
|-------------|---------------------|
| Actor | Nhà sản xuất |
| Mô tả | Nhập đồ cổ mới vào kho hoặc cập nhật số lượng sản phẩm có sẵn. |
| Điều kiện tiên quyết | Sản phẩm đã có trong danh mục hoặc được thêm mới. |
| Kết quả | Số lượng đồ cổ trong kho được cập nhật đúng thực tế, hỗ trợ quản lý tồn kho hiệu quả. |
| Kịch bản chính | • Nhà sản xuất chọn đồ cổ cần nhập kho.<br>• Nhập số lượng.<br>• Hệ thống cập nhật kho. |
| Kịch bản phụ | Nếu sản phẩm chưa có trong danh mục → yêu cầu thêm mới sản phẩm trước. |

Bảng 2.6 Bảng đặc tả usecase nhập kho sản phẩm##### 2.2.2.6. Chức năng quản lý đơn hàng

| Tên usecase | Quản lý đơn hàng |
|-------------|-----------------|
| Actor | Admin |
| Mô tả | Xem, xác nhận và xử lý đơn hàng. |
| Điều kiện tiên quyết | Có đơn hàng mới từ khách hàng. |
| Kết quả | Admin xử lý đơn hàng nhanh chóng, giảm sai sót, tăng tốc độ phục vụ khách hàng. |
| Kịch bản chính | • Admin truy cập danh sách đơn hàng.<br>• Chọn đơn cần xử lý.<br>• Xác nhận đơn.<br>• Hệ thống cập nhật trạng thái. |
| Kịch bản phụ | Nếu đơn hàng không hợp lệ → hiển thị lỗi và yêu cầu kiểm tra. |

Bảng 2.7 Bảng đặc tả usecase Tìm kiếm hóa đơn##### 2.2.2.7. Đặc tả chức năng quản lý xuất hóa đơn sản phẩm

| Tên usecase | Quản lý xuất hóa đơn sản phẩm |
|-------------|------------------------------|
| Actor | Admin |
| Mô tả | Hóa đơn được tạo và gửi đến khách hàng đầy đủ thông tin, phục vụ thanh toán và lưu trữ. |
| Điều kiện tiên quyết | Người dùng có quyền quản trị. |
| Kết quả | Hóa đơn được tạo và gửi đến khách hàng đầy đủ thông tin, phục vụ thanh toán và lưu trữ. |
| Kịch bản chính | • Admin chọn đơn hàng đã xác nhận.<br>• Nhập thông tin hóa đơn.<br>• Lưu và gửi hóa đơn.<br>• Hệ thống thông báo thành công. |
| Kịch bản phụ | Nếu thiếu thông tin → hiển thị cảnh báo. |

Bảng 2.8 Bảng đặc tả usecase hóa đơn sản phẩm##### 2.2.2.8. Đặc tả chức năng quản lý bảo hành sản phẩm

| Tên usecase | Quản lý bảo hành sản phẩm |
|-------------|--------------------------|
| Actor | Admin, Khách hàng |
| Mô tả | Admin cập nhật thông tin bảo hành, Khách hàng tra cứu bảo hành đồ cổ đã mua |
| Điều kiện tiên quyết | Sản phẩm đã được bán và có thông tin đơn hàng. |
| Kết quả | Thông tin bảo hành được lưu trữ và tra cứu dễ dàng, tăng độ tin cậy và dịch vụ hậu mãi. |
| Kịch bản chính | • Khách hàng tra cứu: chọn đồ cổ đã mua, xem thông tin bảo hành.<br>• Admin cập nhật bảo hành: chọn sản phẩm, nhập thông tin, lưu. |
| Kịch bản phụ | Nếu chưa có thông tin bảo hành → hiển thị "Chưa có thông tin bảo hành". |

Bảng 2.9 Bảng đặc tả usecase bảo hành sản phẩm### 2.3. Sơ đồ tuần tự (Sequence Diagram) và Sơ đồ lớp (Class Diagram)

#### 2.3.1. Sơ đồ tuần tự cho từng Usecase

##### 2.3.1.1. Sơ đồ tuần tự Đăng nhập

Hình 2-2 Sơ đồ tuần tự Đăng nhập##### 2.3.1.2. Sơ đồ tuần tự đặt mua sản phẩm

Hình 2-3 Sơ đồ tuần tự đặt mua sản phẩm##### 2.3.1.3. Sơ đồ tuần tự tra cứu thông tin bảo hành

Hình 2-4 Sơ đồ tuần tự tra cứu thông tin bảo hành##### 2.3.1.4. Sơ đồ tuần tự quản lý nhập kho sản phẩm

Hình 2-5 Sơ đồ tuần tự quản lý nhập kho sản phẩm##### 2.3.1.5. Sơ đồ lớp tổng quát của hệ thống

Hình 2-6 Sơ đồ lớp tổng quát### 2.4. Activity Diagram

Hình 2-7 Sơ đồ tổng quát mua một sản phẩmHình 2-8 Sơ đồ tổng quát bảo hành một sản phẩm#### 2.4.1. Mô tả quy trình mà một khách hàng thực hiện

##### 2.4.1.1. Đặt mua một sản phẩm đồ cổ.

Giai đoạn 1: Đặt hàng sản phẩm1. Khách hàng truy cập hệ thống & đăng nhập   Người dùng phải có tài khoản để thực hiện giao dịch.
   Nếu đăng nhập thất bại → hệ thống thông báo lỗi và kết thúc phiên.

2. Hiển thị danh sách sản phẩm   Sau khi đăng nhập thành công, hệ thống hiển thị danh sách các đồ cổ có sẵn.

3. Khách hàng chọn sản phẩm và nhập số lượng   Người dùng chọn loại đồ cổ muốn mua và số lượng cần đặt.

4. Gửi yêu cầu đặt hàng   Hệ thống tiếp nhận yêu cầu và kiểm tra số lượng sản phẩm trong kho.

5. Kiểm tra tồn kho   Nếu đủ số lượng → đơn hàng được chuyển cho Admin xử lý.
   Nếu không đủ → hệ thống thông báo hết hàng.

6. Admin xác nhận đơn hàng   Admin kiểm tra và xác nhận đơn hàng.

7. Tạo hóa đơn & cập nhật kho   Hệ thống tạo hóa đơn cho khách hàng.
   Số lượng sản phẩm trong kho được cập nhật.

8. Thông báo đặt hàng thành công   Khách hàng nhận được thông báo và tiến hành nhận sản phẩm.

##### 2.4.1.2. Gửi yêu cầu bảo hành nếu sản phẩm gặp sự cố

Giai đoạn 2: Bảo hành sản phẩm1. Kiểm tra sản phẩm có sự cố không   Nếu đồ cổ gặp lỗi hoặc hỏng hóc → khách hàng truy cập chức năng bảo hành.

2. Nhập thông tin bảo hành   Khách hàng nhập thông tin sản phẩm, mô tả lỗi và gửi yêu cầu bảo hành.

3. Hệ thống kiểm tra thời hạn bảo hành   Nếu sản phẩm còn trong thời hạn bảo hành → yêu cầu được chuyển cho Admin.
   Nếu đã hết hạn → hệ thống từ chối bảo hành.

4. Admin xác nhận yêu cầu   Admin kiểm tra và xác nhận yêu cầu bảo hành.

5. Tiến hành xử lý bảo hành   Sản phẩm được sửa chữa hoặc thay thế theo chính sách bảo hành.

6. Thông báo hoàn tất bảo hành   Khách hàng nhận được thông báo kết quả xử lý.

### 2.5. Thiết kế cơ sở dữ liệu

#### 2.5.1. Thiết kế bảng cơ sở dữ liệu

##### 2.5.1.1. Bảng: khách hàng
• Mô tả: Lưu trữ thông tin của khách hàng 
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maKH | INT | PRIMARY KEY |
| tenKH | NVARCHAR(100) | NOT NULL |
| diaChi | NVARCHAR(200) | NULL |
| sdt | VARCHAR(15) | NULL |
| email | VARCHAR(100) | NULL |

Bảng 2.10 Chi tiết cơ sở dữ liệu khách hàng##### 2.5.1.2. Bảng: sản phẩm
• Mô tả: Lưu trữ thông tin của đồ cổ
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maSP | INT | PRIMARY KEY |
| tenSP | NVARCHAR(100) | NOT NULL |
| loaiSP | NVARCHAR(50) | NULL |
| giaSP | FLOAT | NOT NULL |
| soLuongTon | INT | DEFAULT 0 |
| uuDai | FLOAT | NULL |
| namSanXuat | INT | NULL |
| xuatXu | NVARCHAR(100) | NULL |
| tinhTrang | NVARCHAR(50) | NULL |
| chatLieu | NVARCHAR(100) | NULL |

Bảng 2.11 Chi tiết cơ sở dữ liệu sản phẩm##### 2.5.1.3. Bảng: Nhà cung cấp 
• Mô tả: Lưu trữ thông tin của nhà cung cấp đồ cổ
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maNCC | INT | PRIMARY KEY |
| tenNCC | NVARCHAR(100) | NOT NULL |
| diaChi | NVARCHAR(200) | NULL |
| email | VARCHAR(100) | NULL |
| sdt | VARCHAR(15) | NULL |

Bảng 2.12 Chi tiết cơ sở dữ liệu nhà cung cấp##### 2.5.1.4. Bảng: Đơn hàng
• Mô tả: Lưu trữ thông tin của đơn hàng khách đặt
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maDon | INT | PRIMARY KEY |
| ngayDat | DATE | NOT NULL |
| trangThai | NVARCHAR(50) | NULL |
| tongTien | FLOAT | NULL |
| maKH | INT | FOREIGN KEY REFERENCES KhachHang(maKH) |

Bảng 2.13 Chi tiết cơ sở dữ liệu đơn hàng##### 2.5.1.5. Bảng: Bảo hành 
• Mô tả: Lưu trữ thông tin của khách bảo hành
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maBH | INT | PRIMARY KEY |
| ngayBaoHanh | DATE | NOT NULL |
| moTaLoi | NVARCHAR(255) | NULL |
| maDon | INT | FOREIGN KEY REFERENCES DonHang(maDon) |

Bảng 2.14 Chi tiết cơ sở dữ liệu bảo hành sản phẩm##### 2.5.1.6. Bảng: Admin 
• Mô tả: Lưu trữ thông tin của admin hệ thống
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maAdmin | INT | PRIMARY KEY |
| tenAdmin | NVARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NULL |

Bảng 2.15 Chi tiết cơ sở dữ liệu admin##### 2.5.1.7. Bảng: Chi tiết đơn hàng
• Mô tả: Lưu trữ thông tin của đơn hàng khách đã đặt
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maDon | INT | PRIMARY KEY, FOREIGN KEY REFERENCES DonHang(maDon) |
| maSP | INT | PRIMARY KEY, FOREIGN KEY REFERENCES SanPham(maSP) |
| soLuong | INT | NOT NULL |

Bảng 2.16 Chi tiết cơ sở dữ liệu chi tiết đơn hàng##### 2.5.1.8. Bảng: cung cấp
• Mô tả: Lưu trữ thông tin của nhà cung cấp
• Danh sách các trường:| Tên cột | Kiểu dữ liệu | Ràng buộc |
|---------|--------------|-----------|
| maNCC | INT | PRIMARY KEY, FOREIGN KEY REFERENCES NhaCungCap(maNCC) |
| maSP | INT | PRIMARY KEY, FOREIGN KEY REFERENCES SanPham(maSP) |

Bảng 2.17 Chi tiết cơ sở dữ liệu cung cấp##### 2.5.1.9. Mô hình cơ sở dữ liệu quan hệ

Hình 2-10 Mô hình cơ sở dữ liệu quan hệ---

## CHƯƠNG 3: HIỆN THỰC VÀ TRIỂN KHAI HỆ THỐNG

### 3.1. Thiết kế giao diện web

#### 3.1.1. Giao diện chính trang web

Hình 3-1 Giao diện chính trang webĐây là giao diện chính khi người dùng khởi động website bán đồ cổ. Ở phía trên bao gồm thanh menu và các danh mục chức năng đã được mô tả. Cụ thể, mục Sản phẩm thể hiện nghiệp vụ Quản lý đồ cổ, bao gồm việc hiển thị danh sách đồ cổ, thông tin chi tiết, giá bán và các chương trình khuyến mãi. Mục Giỏ hàng ứng với nghiệp vụ Mua sắm trực tuyến, nơi khách hàng có thể thêm đồ cổ vào giỏ, đặt cọc hoặc tiến hành thanh toán. Ngoài ra, hệ thống còn có thanh Tra cứu để tìm kiếm nhanh sản phẩm, và mục Tài khoản người dùng hỗ trợ quản lý thông tin khách hàng, lịch sử mua hàng cũng như các giao dịch đã thực hiện.

#### 3.1.2. Kết quả xây dựng trang web

##### 3.1.2.1. Màn hình đăng ký

Hình 3-1 Màn hình đăng ký##### 3.1.2.2. Màn hình chính
• Sau khi đăng nhập thành công, phần mềm hiển thị giao diện trang chủ

Hình 3-2 Màn hình trang chủ - tab Kinh DoanhSau khi đăng nhập thành công, phần mềm hiển thị giao diện trang chủ sẽ có các tab SẢN PHẨM, GIỎ HÀNG, BẢO DƯỠNG SẢN PHẨM, để khách hàng có thể truy cập để xem thông tin các loại đồ cổ cũng như kiểm tra các sản phẩm mình đã chọn ở mục giỏ hàng, khách hàng cũng có thể vào tab BẢO DƯỠNG SẢN PHẨM để kiểm tra tình trạng, giá thành, thời gian của đồ cổ mình.

Hình 3-3 Màn hình giỏ hàngMô tả:
• Ở giao diện trang chủ, nhấn vào tab "GIỎ HÀNG", hiển thị các sản phẩm mà khách hàng đã chọn để tiện cho việc thanh toán.

Hình 3-4 Màn hình bảo dưỡng sản phẩmMô tả:
• Ở giao diện trang chủ, nhấn vào tab "BẢO DƯỠNG SẢN PHẨM", sẽ hiển thị những thông tin bảo dưỡng đồ cổ của khách hàng giúp người dùng chủ động hơn về thời gian cũng như chi phí phải bỏ ra.

### 3.2. Màn hình đăng nhập quản lý 

Hình 3-5 Màn hình đăng nhập adminMô tả:

• Nhập Email là "admin@antiquestore.com"
• Nhập Password là "admin123"
• Nhấn "Đăng Nhập" để vào giao diện "Trang chủ"
• Nhấn "Reset" để khởi động trang web

### 3.3. Màn hình trang chủ 

Hình 3-6 Màn hình trang chủMô tả:

• Sau khi đăng nhập thành công, phần mềm hiển thị giao diện trang chủ
• Tab "Danh mục sản phẩm" hiển thị các sản phẩm của cửa hàng  
• Tab "Sản phẩm" sẽ hiển thị hình ảnh thông tin cũng như số lượng các sản phẩm của cửa hàng
• Tab "Đơn hàng" sẽ hiển thị hình ảnh thông tin các đơn hàng khách hàng đã đặt 
• Tab "Doanh thu" sẽ hiển thị hình ảnh và thông tin các doanh thu sản phẩm đã bán được của cửa hàng.
• Tab "Lịch bảo dưỡng" sẽ hiển thị hình ảnh và thông tin bảo dưỡng của khách hàng.
• Tab "Quản lý user" hiển thị thông tin và email của các quản trị viên 

Hình 3-7 Màn hình Danh Mục các sản phẩmMô tả:

• Ở giao diện trang chủ, nhấn vào tab "Danh mục sản phẩm", hiển thị các sản phẩm của cửa hàng 
• Nút "Add category": Dùng để thêm các thông tin sản phẩm 
• Chức năng "Xóa": Chọn một sản phẩm sau đó bấm kí hiệu xóa, thông tin sẽ được xóa trên hệ thống
• Chức năng "Sửa": Chọn một sản phẩm sau đó bấm vào kí hiệu sửa, dùng để sửa các thông tin như tên sản phẩm hoặc mô tả sản phẩm.

Hình 3-8 Màn hình sản phẩmMô tả:

• Ở giao diện trang chủ, nhấn vào tab "Sản phẩm", sẽ hiển thị hình ảnh thông tin cũng như số lượng các sản phẩm của cửa hàng 
• Chức năng "Xóa": Chọn một sản phẩm sau đó bấm kí hiệu xóa, thông tin sẽ được xóa trên hệ thống
• Chức năng "Sửa": Chọn một sản phẩm sau đó bấm vào kí hiệu sửa, dùng để sửa các thông tin như tên sản phẩm hoặc mô tả sản phẩm.

Hình 3-9 Màn hình đơn hàngMô tả:

• Ở giao diện trang chủ, nhấn vào tab "Đơn hàng", sẽ hiển thị hình ảnh thông tin các đơn hàng khách hàng đã đặt 
• Nút trạng thái "Chưa giao hàng": Cho biết sản phẩm đã được đặt và hiện tại đang chuẩn bị được giao hàng.
• Nút trạng thái "Đã giao hàng": cho biết sản phẩm đã được giao thành công 
• Nút "Chi tiết": cho biết thông tin sản phẩm và thông tin khách hàng đã đặt 

Hình 3-10 Màn hình doanh thu đã bán đượcMô tả:
• Ở giao diện trang chủ, nhấn vào tab "Doanh thu", sẽ hiển thị hình ảnh và thông tin các doanh thu sản phẩm đã bán được của cửa hàng. 

Hình 3-11 Màn hình lịch bảo dưỡngMô tả:
• Ở giao diện trang chủ, nhấn vào tab "Lịch bảo dưỡng", sẽ hiển thị hình ảnh và thông tin bảo dưỡng của khách hàng.
• Nút "Cập nhật": cho biết tình trạng hiện tại bảo dưỡng của sản phẩm khách hàng.

Hình 3-12 Màn hình quản lý userMô tả:

• Ở giao diện trang chủ, nhấn vào tab "Quản lý user", hiển thị thông tin và email của các quản trị viên 
• Nút "Add category": Dùng để thêm vào các admin 
• Chức năng "Xóa": Chọn một admin sau đó bấm kí hiệu xóa, thông tin sẽ được xóa trên hệ thống
• Chức năng "Sửa": Chọn một admin sau đó bấm vào kí hiệu sửa, dùng để sửa các thông tin như tên admin hoặc email.

---

## CHƯƠNG 4: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 4.1. Đánh giá kết luận về ứng dụng

Xét về tổng thể, hệ thống quản lý bán đồ cổ đã đáp ứng đầy đủ các yêu cầu đặt ra ban đầu, cung cấp các chức năng cần thiết phục vụ cho quy trình kinh doanh đồ cổ. Hệ thống hỗ trợ hiệu quả việc quản lý thông tin sản phẩm (đồ cổ), khách hàng, hóa đơn, đơn hàng và bảo hành.

Đối với Admin (Người quản lý), hệ thống cho phép thực hiện các thao tác quản trị như cập nhật thông tin đồ cổ, quản lý đơn hàng, xuất hóa đơn, theo dõi bảo hành và tra cứu dữ liệu liên quan. Giao diện trực quan giúp người quản lý dễ dàng thao tác và kiểm soát toàn bộ hoạt động kinh doanh.

Đối với Khách hàng, hệ thống hỗ trợ tìm kiếm đồ cổ theo nhu cầu, xem thông tin chi tiết, đặt hàng và tra cứu bảo hành sau khi mua đồ cổ.

Đối với Nhà sản xuất, hệ thống cho phép nhập kho đồ cổ, cập nhật thông số kỹ thuật và theo dõi các đơn hàng liên quan đến sản phẩm của mình.

### 4.2. Kết luận chung

#### 4.2.1. Kết quả đạt được
• Phân tích hệ thống và xây dựng các biểu đồ Use Case, Activity thể hiện mối quan hệ chức năng. Phân tích dữ liệu của chương trình.
• Thiết kế, xây dựng cơ sở dữ liệu phù hợp với nghiệp vụ quản lý bán đồ cổ.
• Thiết kế xây dựng giao diện đáp ứng yêu cầu người dùng, tích hợp đầy đủ các chức năng chính như đặt hàng, quản lý đồ cổ, xuất hóa đơn, bảo hành…
• Tổ chức luồng xử lý rõ ràng giữa các tác nhân: Khách hàng, Admin, Nhà sản xuất.

#### 4.2.2. Hạn chế
Do giới hạn về thời gian và kinh nghiệm, hệ thống chưa hoàn thiện đầy đủ toàn bộ quy trình bán hàng. Một số chức năng nâng cao như quản lý kho chi tiết, phân quyền nhân viên, báo cáo thống kê chưa được triển khai.

#### 4.2.3. Hướng phát triển
• Hoàn thiện các chức năng còn thiếu như quản lý xuất–nhập kho, phân quyền chi tiết cho từng loại người dùng.
• Tối ưu giao diện người dùng, cải thiện trải nghiệm sử dụng.
• Tích hợp thêm các tính năng nâng cao như thanh toán trực tuyến, theo dõi vận chuyển, báo cáo doanh thu.
• Mở rộng hệ thống theo hướng đa nền tảng: web, mobile, API kết nối showroom.

---

## DANH MỤC TÀI LIỆU THAM KHẢO

1. React Documentation. (2024). React - A JavaScript library for building user interfaces. https://react.dev/

2. Node.js Documentation. (2024). Node.js - JavaScript runtime built on Chrome's V8 JavaScript engine. https://nodejs.org/

3. Express.js Documentation. (2024). Express - Fast, unopinionated, minimalist web framework for Node.js. https://expressjs.com/

4. Sequelize Documentation. (2024). Sequelize - A promise-based Node.js ORM. https://sequelize.org/

5. TailwindCSS Documentation. (2024). Tailwind CSS - A utility-first CSS framework. https://tailwindcss.com/

6. MySQL Documentation. (2024). MySQL - The world's most popular open source database. https://dev.mysql.com/doc/

7. PostgreSQL Documentation. (2024). PostgreSQL - The world's most advanced open source relational database. https://www.postgresql.org/docs/

8. JWT.io. (2024). JSON Web Tokens - An open standard for securely transmitting information. https://jwt.io/

9. VNPay Documentation. (2024). VNPay - Cổng thanh toán điện tử. https://sandbox.vnpayment.vn/

10. Docker Documentation. (2024). Docker - Container platform. https://docs.docker.com/

11. E-commerce Best Practices. (2024). E-commerce UX Design Guidelines. https://www.nngroup.com/articles/ecommerce-ux/

12. Web Security Guidelines. (2024). OWASP Top 10 - Web Application Security Risks. https://owasp.org/www-project-top-ten/

13. Responsive Web Design. (2024). MDN Web Docs - Responsive design. https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

14. API Design Best Practices. (2024). RESTful API Design Guidelines. https://restfulapi.net/

15. Database Design Principles. (2024). Database Normalization and Design. https://www.studytonight.com/dbms/database-normalization.php

---

Ngày hoàn thành: [Ngày tháng năm]  
Sinh viên thực hiện: [Tên sinh viên]  
Chữ ký: [Chữ ký]
