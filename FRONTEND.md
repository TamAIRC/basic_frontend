# Frontend: React + TypeScript

- [Frontend: React + TypeScript](#frontend-react--typescript)
  - [1. Folder Structure](#1-folder-structure)
  - [2. Giải thích chi tiết](#2-giải-thích-chi-tiết)

## 1. Folder Structure

```
frontend/
├── app/
│   ├── (full-page)/
│   │   ├── layout.tsx                # Bố cục dành riêng cho các trang toàn màn hình.
│   │   ├── auth/
│   │   │   ├── access                # Trang xác thực khi không có quyền truy cập.
│   │   │   ├── error                 # Trang lỗi xác thực.
│   │   │   ├── login                 # Trang đăng nhập.
│   │   ├── landing                   # Trang chính của ứng dụng.
│   │   └── pages
│   │       └── notfound            # Trang 404 Not Found.
│   ├── (main)/
│   │   ├── layout.tsx                # Bố cục cho các trang có thành phần giao diện chung.
│   │   ├── page.tsx                  # Trang chính cho phần giao diện chung.
│   │   ├── blocks                    # Trang chứa các khối nội dung.
│   │   ├── documentation             # Trang tài liệu.
│   │   ├── pages/
│   │   │   ├── crud                  # Trang CRUD.
│   │   │   ├── empty                 # Trang trống.
│   │   │   └── timeline              # Trang dòng thời gian.
│   │   └── uikit/                    # Thư mục chứa các thành phần giao diện.
│   │       ├── button                # Thành phần nút bấm.
│   │       ├── charts                # Thành phần biểu đồ.
│   │       ├── input                 # Thành phần nhập liệu.
│   │       └── menu/
│   │            ├── confirmation     # Trang xác nhận từ menu.
│   │            ├── payment          # Trang thanh toán.
│   │            └── seat             # Trang lựa chọn chỗ ngồi.
│   ├── favicon.ico                   # Tệp favicon hiển thị biểu tượng trang web trên trình duyệt.
│   └── layout.tsx                    # Tệp định nghĩa bố cục chung cho toàn bộ ứng dụng.
├── layout/
│   ├── AppConfig.tsx                 # Thành phần cấu hình ứng dụng.
│   ├── AppFooter.tsx                 # Thành phần footer.
│   ├── AppMenu.tsx                   # Thành phần menu.
│   ├── AppMenuitem.tsx               # Thành phần mục trong menu.
│   ├── AppSidebar.tsx                # Thành phần sidebar.
│   ├── AppTopbar.tsx                 # Thành phần thanh điều hướng trên cùng.
│   └── layout.tsx                    # Bố cục chung của phần layout.
├── modules/
│   ├── demo/
│   │   ├── components/
│   │   │   └── BlockViewer.tsx       # Thành phần hiển thị khối nội dung.
│   │   ├── service/                  # Dịch vụ xử lý dữ liệu (CountryService, CustomerService, v.v.).
│   │   └── styles/                   # Các file SCSS định nghĩa style.
├── public/
│   ├── layout/images                 # Thư mục chứa hình ảnh.
│   └── themes                        # Thư mục chứa các chủ đề giao diện.
├── styles/
│   └── layout.scss                   # SCSS định nghĩa bố cục chính.
│       └── _config.scss                 # SCSS định nghĩa cấu hình style.
├── types/
│   ├── demo.d.ts                     # Định nghĩa kiểu dữ liệu cho demo.
│   ├── index.d.ts                    # Định nghĩa kiểu chung.
│   └── layout.d.ts                   # Định nghĩa kiểu cho bố cục.
├── utils/
│   └── utils.ts                      # Các hàm tiện ích chung.
├── CHANGELOG.md                      # Ghi lại các thay đổi qua các phiên bản của dự án.
├── LICENSE.md                        # Giấy phép sử dụng cho dự án.
├── README.md                         # Tài liệu hướng dẫn sử dụng và thông tin dự án.
├── next.config.js                    # Cấu hình cho Next.js.
├── package.json                      # Định nghĩa các package, script, và thông tin dự án.
├── package-lock.json                 # Khóa phiên bản của các package.
└── tsconfig.json                     # Cấu hình TypeScript.
```

## 2. Giải thích chi tiết

- **app/**: Đây là thư mục chính chứa các trang và bố cục (layout) của ứng dụng.
  - **(full-page)/**: Chứa các trang hoặc bố cục (layout) chiếm toàn bộ màn hình, thường không có thành phần giao diện chung (như header hoặc footer).
    - **layout.tsx**: Bố cục dành riêng cho các trang toàn màn hình.
    - **auth/access, auth/error, auth/login**: Chứa các trang liên quan đến xác thực (authentication), như trang đăng nhập, trang lỗi khi không có quyền truy cập, và trang login.
    - **landing**: Trang chính (landing page) của ứng dụng.
    - **pages/notfound**: Trang hiển thị khi người dùng truy cập vào một đường dẫn không tồn tại (404 Not Found).
  - **(main)/**: Chứa các trang sử dụng bố cục chung có thành phần giao diện như sidebar, header, footer.
    - **layout.tsx, page.tsx**: Bố cục và trang chính của phần sử dụng bố cục chung.
    - **blocks, documentation, pages/crud, pages/empty, pages/timeline**: Các trang nội dung chính của ứng dụng, bao gồm tài liệu, các khối nội dung, CRUD (tạo, đọc, cập nhật, xóa), và timeline.
    - **uikit/**: Thư mục này chứa các thành phần giao diện (UI components) như button, charts (biểu đồ), input (nhập liệu), menu và nhiều thành phần giao diện khác.
      - **button, charts, file, floatlabel, formlayout, input, invalidstate, list, media, menu, message, misc, overlay, panel, table, tree**: Các thành phần UI được chia thành các module nhỏ, mỗi module có file SCSS hoặc CSS đi kèm để định nghĩa kiểu dáng.
      - **menu/confirmation, menu/payment, menu/seat**: Các trang liên quan đến menu, bao gồm xác nhận, thanh toán, và lựa chọn chỗ ngồi.
    - **utilities/icons**: Chứa các trang tiện ích, như việc hiển thị các icon hoặc các công cụ bổ trợ.
  - **favicon.ico**: Tệp favicon hiển thị biểu tượng trang web trên trình duyệt.
  - **layout.tsx**: Tệp này định nghĩa bố cục chung cho toàn bộ ứng dụng, có thể bao gồm header, footer, hoặc sidebar.
  - **api/**: Chứa các API hoặc module API.
    - **upload.ts:**: Một API hoặc module liên quan đến việc tải tệp lên (upload).
- **layout/**: Chứa các thành phần bố cục chính của ứng dụng, bao gồm
  - **AppConfig.tsx, AppFooter.tsx, AppMenu.tsx, AppMenuitem.tsx, AppSidebar.tsx, AppTopbar.tsx**: Các thành phần giao diện như cấu hình, footer, menu, sidebar, và thanh điều hướng trên cùng (topbar).
  - **layout.tsx**: Tệp định nghĩa bố cục chung cho phần bố cục này.
  - **context/layoutcontext.tsx, context/menucontext.tsx**: Context API để quản lý trạng thái bố cục và menu trong ứng dụng.
- **modules/**: Chứa các module dịch vụ
  - **demo/**: Chứa các module demo (minh họa) với các thành phần, dịch vụ, và style liên quan
    - **components/BlockViewer.tsx**: Thành phần hiển thị các khối nội dung (block viewer).
    - **service/**: Các dịch vụ liên quan đến việc xử lý dữ liệu như CountryService, CustomerService, ProductService, v.v.
    - **styles/**: Các file SCSS để định nghĩa kiểu dáng của các trang demo.
- **public/**: Chứa các tệp công khai, như hình ảnh, logo, và các chủ đề (themes).
  - **layout/images, themes**: Các hình ảnh và chủ đề giao diện được sử dụng trong ứng dụng.
- **styles/**: Chứa các tệp SCSS định nghĩa style cho bố cục của ứng dụng.
  - **layout.scss và các tệp \_config.scss, \_content.scss, \_footer.scss, v.v.**: Định nghĩa các phần cụ thể của bố cục (header, footer, menu, v.v.).
- **types/**: Các kiểu dữ liệu trong TypeScript để đảm bảo tính an toàn của kiểu.
  - **demo.d.ts, index.d.ts, layout.d.ts:** Các định nghĩa kiểu dữ liệu cho các module và thành phần khác nhau trong ứng dụng.
- **utils/**: Các hàm tiện ích chung, ví dụ như định dạng dữ liệu, xử lý logic chung.
- **CHANGELOG.md**: Ghi lại các thay đổi quan trọng qua các phiên bản của dự án.
- **LICENSE.md**: Tài liệu về giấy phép sử dụng cho dự án.
- **README.md**: Tài liệu giới thiệu, hướng dẫn sử dụng và thông tin cơ bản về dự án.
- **next.config.js**: Tệp cấu hình cho Next.js, để điều chỉnh các thiết lập build và runtime.
- **package.json**: Định nghĩa các package (thư viện) mà dự án sử dụng, cùng với các script và thông tin dự án.
- **package-lock.json**: Khóa phiên bản cụ thể của các package để đảm bảo tính nhất quán giữa các môi trường.
- **tsconfig.json**: Tệp cấu hình cho TypeScript, giúp tùy chỉnh cách TypeScript biên dịch mã.
