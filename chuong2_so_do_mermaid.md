# CHƯƠNG 2: PHÂN TÍCH THIẾT KẾ HỆ THỐNG - SƠ ĐỒ MERMAID

## 2.2. SƠ ĐỒ USECASE CHÍNH

### Hình 2-1: Sơ đồ usecase chính

```mermaid
graph TB
    %% Actors
    KH[Khách hàng]
    ADMIN[Admin]
    NSX[Nhà sản xuất]
    
    %% Use Cases
    subgraph "Hệ thống Shop Đồ Cổ"
        UC1[Đăng nhập hệ thống]
        UC2[Tìm kiếm và xem sản phẩm]
        UC3[Đặt hàng sản phẩm]
        UC4[Quản lý thông tin sản phẩm]
        UC5[Nhập kho sản phẩm]
        UC6[Quản lý khách hàng]
        UC7[Xuất hóa đơn]
        UC8[Quản lý bảo hành sản phẩm]
        UC9[Quản lý đơn hàng]
    end
    
    %% Relationships
    KH --> UC1
    KH --> UC2
    KH --> UC3
    KH --> UC8
    
    ADMIN --> UC1
    ADMIN --> UC4
    ADMIN --> UC6
    ADMIN --> UC7
    ADMIN --> UC8
    ADMIN --> UC9
    
    NSX --> UC1
    NSX --> UC4
    NSX --> UC5
    
    %% Include relationships
    UC3 -.-> UC1
    UC4 -.-> UC1
    UC5 -.-> UC1
    UC6 -.-> UC1
    UC7 -.-> UC1
    UC8 -.-> UC1
    UC9 -.-> UC1
```

## 2.3. SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)

### Hình 2-2: Sơ đồ tuần tự Đăng nhập

```mermaid
sequenceDiagram
    participant U as Người dùng
    participant UI as Giao diện
    participant AUTH as AuthController
    participant DB as Database
    
    U->>UI: Nhập tên đăng nhập và mật khẩu
    UI->>AUTH: Gửi thông tin đăng nhập
    AUTH->>DB: Kiểm tra thông tin tài khoản
    DB-->>AUTH: Trả về thông tin user
    
    alt Thông tin hợp lệ
        AUTH-->>UI: Đăng nhập thành công
        UI-->>U: Chuyển đến trang chủ
    else Thông tin không hợp lệ
        AUTH-->>UI: Đăng nhập thất bại
        UI-->>U: Hiển thị thông báo lỗi
    end
```

### Hình 2-3: Sơ đồ tuần tự đặt mua sản phẩm

```mermaid
sequenceDiagram
    participant KH as Khách hàng
    participant UI as Giao diện
    participant CART as CartController
    participant ORDER as OrderController
    participant DB as Database
    participant ADMIN as Admin
    
    KH->>UI: Chọn sản phẩm và số lượng
    UI->>CART: Thêm vào giỏ hàng
    CART->>DB: Kiểm tra tồn kho
    DB-->>CART: Trả về số lượng tồn
    
    alt Còn hàng
        CART-->>UI: Thêm vào giỏ thành công
        UI-->>KH: Hiển thị giỏ hàng
        
        KH->>UI: Nhấn "Đặt hàng"
        UI->>ORDER: Tạo đơn hàng
        ORDER->>DB: Lưu đơn hàng
        ORDER->>ADMIN: Thông báo đơn hàng mới
        ORDER-->>UI: Đặt hàng thành công
        UI-->>KH: Thông báo đặt hàng thành công
    else Hết hàng
        CART-->>UI: Sản phẩm tạm hết hàng
        UI-->>KH: Hiển thị thông báo hết hàng
    end
```

### Hình 2-4: Sơ đồ tuần tự tra cứu thông tin bảo hành

```mermaid
sequenceDiagram
    participant KH as Khách hàng
    participant UI as Giao diện
    participant WARRANTY as WarrantyController
    participant DB as Database
    
    KH->>UI: Nhập mã đơn hàng hoặc sản phẩm
    UI->>WARRANTY: Gửi yêu cầu tra cứu
    WARRANTY->>DB: Tìm thông tin bảo hành
    DB-->>WARRANTY: Trả về thông tin bảo hành
    
    alt Có thông tin bảo hành
        WARRANTY-->>UI: Trả về thông tin bảo hành
        UI-->>KH: Hiển thị thông tin bảo hành
    else Không có thông tin
        WARRANTY-->>UI: Không tìm thấy thông tin
        UI-->>KH: Hiển thị "Chưa có thông tin bảo hành"
    end
```

### Hình 2-5: Sơ đồ tuần tự quản lý nhập kho sản phẩm

```mermaid
sequenceDiagram
    participant NSX as Nhà sản xuất
    participant UI as Giao diện
    participant PRODUCT as ProductController
    participant INVENTORY as InventoryController
    participant DB as Database
    
    NSX->>UI: Chọn sản phẩm và nhập số lượng
    UI->>PRODUCT: Kiểm tra sản phẩm tồn tại
    PRODUCT->>DB: Tìm sản phẩm
    
    alt Sản phẩm đã tồn tại
        PRODUCT-->>INVENTORY: Sản phẩm có sẵn
        INVENTORY->>DB: Cập nhật số lượng tồn kho
        DB-->>INVENTORY: Cập nhật thành công
        INVENTORY-->>UI: Nhập kho thành công
        UI-->>NSX: Thông báo nhập kho thành công
    else Sản phẩm chưa tồn tại
        PRODUCT-->>UI: Sản phẩm chưa có trong hệ thống
        UI-->>NSX: Yêu cầu thêm mới sản phẩm trước
    end
```

## 2.3. SƠ ĐỒ LỚP TỔNG QUÁT

### Hình 2-6: Sơ đồ lớp tổng quát của hệ thống

```mermaid
classDiagram
    %% User Classes
    class User {
        +int userId
        +string username
        +string email
        +string password
        +string role
        +login()
        +logout()
        +updateProfile()
    }
    
    class Customer {
        +int customerId
        +string fullName
        +string address
        +string phone
        +string email
        +viewProducts()
        +addToCart()
        +placeOrder()
        +viewWarranty()
    }
    
    class Admin {
        +int adminId
        +string adminName
        +string email
        +manageProducts()
        +manageOrders()
        +manageCustomers()
        +generateInvoice()
        +manageWarranty()
    }
    
    class Supplier {
        +int supplierId
        +string supplierName
        +string address
        +string email
        +string phone
        +addProduct()
        +updateInventory()
        +viewOrders()
    }
    
    %% Product Classes
    class Product {
        +int productId
        +string productName
        +int categoryId
        +float price
        +int stockQuantity
        +float discount
        +int yearOfManufacture
        +string origin
        +string condition
        +string material
        +getProductInfo()
        +updateStock()
        +calculatePrice()
    }
    
    class Category {
        +int categoryId
        +string categoryName
        +string description
        +addCategory()
        +updateCategory()
        +deleteCategory()
    }
    
    %% Order Classes
    class Order {
        +int orderId
        +date orderDate
        +string status
        +float totalAmount
        +int customerId
        +createOrder()
        +updateStatus()
        +calculateTotal()
        +generateInvoice()
    }
    
    class OrderDetail {
        +int orderId
        +int productId
        +int quantity
        +float unitPrice
        +float subtotal
        +calculateSubtotal()
    }
    
    class Cart {
        +int cartId
        +int customerId
        +addItem()
        +removeItem()
        +updateQuantity()
        +calculateTotal()
    }
    
    class CartItem {
        +int cartItemId
        +int cartId
        +int productId
        +int quantity
        +float price
    }
    
    %% Payment Classes
    class Payment {
        +int paymentId
        +int orderId
        +float amount
        +string paymentMethod
        +string status
        +date paymentDate
        +processPayment()
        +updateStatus()
    }
    
    %% Warranty Classes
    class Warranty {
        +int warrantyId
        +int orderId
        +date warrantyDate
        +string issueDescription
        +string status
        +date expiryDate
        +createWarranty()
        +updateStatus()
        +checkExpiry()
    }
    
    %% OTP Classes
    class OTP {
        +int otpId
        +string email
        +string otpCode
        +date expiryTime
        +string status
        +generateOTP()
        +verifyOTP()
        +expireOTP()
    }
    
    %% Relationships
    User <|-- Customer
    User <|-- Admin
    User <|-- Supplier
    
    Customer --> Order : places
    Customer --> Cart : owns
    Customer --> Warranty : requests
    
    Order --> OrderDetail : contains
    Order --> Payment : has
    
    Cart --> CartItem : contains
    CartItem --> Product : references
    CartItem --> Cart : belongs_to
    
    Product --> Category : belongs_to
    Product --> OrderDetail : ordered_in
    Product --> CartItem : added_to
    
    Supplier --> Product : supplies
    
    Order --> Warranty : generates
    
    Customer --> OTP : receives
```

## 2.4. SƠ ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAMS)

### Hình 2-7: Sơ đồ tổng quát mua một sản phẩm

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Khách hàng truy cập hệ thống]
    B --> C{Đã đăng nhập?}
    C -->|Không| D[Hiển thị form đăng nhập]
    D --> E[Nhập thông tin đăng nhập]
    E --> F{Xác thực thành công?}
    F -->|Không| G[Hiển thị lỗi đăng nhập]
    G --> D
    F -->|Có| H[Chuyển đến trang chủ]
    C -->|Có| H
    
    H --> I[Hiển thị danh sách sản phẩm]
    I --> J[Khách hàng chọn sản phẩm]
    J --> K[Nhập số lượng]
    K --> L{Số lượng có hợp lệ?}
    L -->|Không| M[Hiển thị lỗi số lượng]
    M --> K
    L -->|Có| N[Kiểm tra tồn kho]
    N --> O{Còn đủ hàng?}
    O -->|Không| P[Hiển thị Hết hàng]
    P --> I
    O -->|Có| Q[Thêm vào giỏ hàng]
    Q --> R[Nhấn Đặt hàng]
    R --> S[Hệ thống tạo đơn hàng]
    S --> T[Gửi thông báo cho Admin]
    T --> U[Admin xác nhận đơn hàng]
    U --> V{Tạo hóa đơn?}
    V -->|Có| W[Tạo hóa đơn]
    V -->|Không| X[Bỏ qua tạo hóa đơn]
    W --> Y[Cập nhật tồn kho]
    X --> Y
    Y --> Z[Thông báo đặt hàng thành công]
    Z --> AA[Kết thúc]
```

### Hình 2-8: Sơ đồ tổng quát bảo hành một sản phẩm

```mermaid
flowchart TD
    A[Bắt đầu] --> B[Khách hàng phát hiện sản phẩm có sự cố]
    B --> C[Khách hàng truy cập hệ thống]
    C --> D{Đã đăng nhập?}
    D -->|Không| E[Hiển thị form đăng nhập]
    E --> F[Nhập thông tin đăng nhập]
    F --> G{Xác thực thành công?}
    G -->|Không| H[Hiển thị lỗi đăng nhập]
    H --> E
    G -->|Có| I[Chuyển đến trang chủ]
    D -->|Có| I
    
    I --> J[Truy cập chức năng bảo hành]
    J --> K[Nhập mã đơn hàng hoặc sản phẩm]
    K --> L[Hệ thống tìm kiếm thông tin]
    L --> M{Tìm thấy sản phẩm?}
    M -->|Không| N[Hiển thị Không tìm thấy]
    N --> K
    M -->|Có| O[Kiểm tra thời hạn bảo hành]
    O --> P{Còn trong thời hạn?}
    P -->|Không| Q[Hiển thị Hết hạn bảo hành]
    Q --> R[Kết thúc]
    P -->|Có| S[Nhập mô tả lỗi]
    S --> T[Gửi yêu cầu bảo hành]
    T --> U[Hệ thống gửi thông báo cho Admin]
    U --> V[Admin xác nhận yêu cầu]
    V --> W{Chấp nhận bảo hành?}
    W -->|Không| X[Thông báo từ chối bảo hành]
    X --> R
    W -->|Có| Y[Tiến hành sửa chữa/thay thế]
    Y --> Z[Cập nhật trạng thái bảo hành]
    Z --> AA[Thông báo hoàn tất bảo hành]
    AA --> R
```

## 2.5. SƠ ĐỒ CƠ SỞ DỮ LIỆU QUAN HỆ

### Hình 2-10: Mô hình cơ sở dữ liệu quan hệ

```mermaid
erDiagram
    KHACHHANG {
        int maKH PK
        nvarchar tenKH
        nvarchar diaChi
        varchar sdt
        varchar email
    }
    
    SANPHAM {
        int maSP PK
        nvarchar tenSP
        nvarchar loaiSP
        float giaSP
        int soLuongTon
        float uuDai
        int namSanXuat
        nvarchar xuatXu
        nvarchar tinhTrang
        nvarchar chatLieu
    }
    
    NHACUNGCAP {
        int maNCC PK
        nvarchar tenNCC
        nvarchar diaChi
        varchar email
        varchar sdt
    }
    
    DONHANG {
        int maDon PK
        date ngayDat
        nvarchar trangThai
        float tongTien
        int maKH FK
    }
    
    BAOHANH {
        int maBH PK
        date ngayBaoHanh
        nvarchar moTaLoi
        int maDon FK
    }
    
    ADMIN {
        int maAdmin PK
        nvarchar tenAdmin
        varchar email
    }
    
    CHITIETDONHANG {
        int maDon PK,FK
        int maSP PK,FK
        int soLuong
    }
    
    CUNGCAP {
        int maNCC PK,FK
        int maSP PK,FK
    }
    
    %% Relationships
    KHACHHANG ||--o{ DONHANG : places
    DONHANG ||--o{ CHITIETDONHANG : contains
    SANPHAM ||--o{ CHITIETDONHANG : ordered_in
    DONHANG ||--o{ BAOHANH : generates
    NHACUNGCAP ||--o{ CUNGCAP : supplies
    SANPHAM ||--o{ CUNGCAP : supplied_by
```

## HƯỚNG DẪN SỬ DỤNG:

1. **Copy từng đoạn code Mermaid** ở trên
2. **Paste vào các công cụ hỗ trợ Mermaid** như:
   - Mermaid Live Editor: https://mermaid.live/
   - GitHub (trong file .md)
   - VS Code với extension Mermaid
   - Notion, Obsidian, etc.

3. **Mỗi sơ đồ mô tả**:
   - **Use Case**: Các chức năng và người dùng của hệ thống
   - **Sequence**: Luồng tương tác giữa các thành phần
   - **Class**: Cấu trúc các lớp và mối quan hệ
   - **Activity**: Quy trình hoạt động chi tiết
   - **ERD**: Mô hình cơ sở dữ liệu quan hệ

## GHI CHÚ:
- Tất cả các sơ đồ đều được tạo dựa trên nội dung báo cáo Chương 2
- Các sơ đồ có thể được chỉnh sửa để phù hợp với yêu cầu cụ thể
- Mỗi sơ đồ đều có tiêu đề và số thứ tự theo báo cáo gốc
