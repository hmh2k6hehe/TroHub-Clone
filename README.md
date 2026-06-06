# TroHub Web - Hệ Thống Quản Lý Phòng Trọ

## Giới thiệu
TroHub là hệ thống quản lý phòng trọ full-stack, gồm:
- **Backend API**: Node.js + Express + MongoDB
- **Frontend Web**: HTML + Vanilla JS (Vite)

---

## Cấu trúc dự án

```
trohub-web-only/
├── API_DuAnTotNghiep/          # Backend Node.js
│   ├── src/
│   │   ├── controllers/        # Logic xử lý
│   │   ├── models/             # Schema MongoDB
│   │   ├── routes/             # Định nghĩa API endpoints
│   │   └── configs/            # Kết nối DB
│   └── server.js               # Entry point Backend
└── src/                        # Frontend
    ├── app.js                  # Logic giao diện chính
    ├── api.js                  # SDK gọi API
    ├── api-config.js           # Cấu hình endpoints và data mappers
    ├── data.js                 # Dữ liệu mẫu dự phòng
    └── env.js                  # Biến môi trường
```

---

## Cách chạy dự án

### 1. Khởi động Backend API
```bash
cd API_DuAnTotNghiep
npm install
npm run dev
# Server chạy tại: http://localhost:5000
```

### 2. Khởi động Frontend
```bash
# Từ thư mục gốc trohub-web-only/
npm run dev
# Web chạy tại: http://localhost:5173
```

### 3. MongoDB
- Cần chạy MongoDB local hoặc MongoDB Atlas
- Cấu hình kết nối trong file `.env`:
```
MONGODB_URI=mongodb://localhost:27017/trohub
JWT_SECRET=trohub_secret_key_2026
PORT=5000
```

---

## Tài khoản mẫu

| Vai trò | Tên đăng nhập | Mật khẩu |
|---------|--------------|---------|
| Chủ trọ (Admin) | admin@trohub.vn | 123456 |
| Người thuê | tenant@trohub.vn | 123456 |

---

## API Endpoints

### 🔑 Xác thực
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |

### 🏠 Phòng trọ
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/rooms` | Danh sách phòng |
| POST | `/api/rooms` | Tạo phòng mới |
| PUT | `/api/rooms/:id` | Cập nhật phòng |
| DELETE | `/api/rooms/:id` | Xóa phòng |

### 👥 Khách thuê
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/tenants` | Danh sách khách thuê |
| POST | `/api/tenants` | Thêm khách thuê (tạo TK + HĐ tự động) |
| PUT | `/api/tenants/:id` | Cập nhật thông tin |
| PUT | `/api/tenants/:id/terminate` | Ngừng thuê |

### 📋 Hợp đồng
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/contracts` | Danh sách hợp đồng |
| POST | `/api/contracts` | Tạo hợp đồng (Admin mời ký) |
| PUT | `/api/contracts/:id` | Cập nhật hợp đồng |
| PUT | `/api/contracts/:id/sign` | Ký hợp đồng (Admin xác nhận) |

### 💰 Hóa đơn
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/invoices` | Danh sách hóa đơn |
| POST | `/api/invoices` | Tạo hóa đơn |
| PUT | `/api/invoices/:id/pay` | Đánh dấu đã thanh toán |

### 💳 Lịch sử thanh toán
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/payments` | Lịch sử giao dịch (Transaction) |

### 🔧 Sửa chữa
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/repairs` | Danh sách yêu cầu sửa chữa |
| POST | `/api/repairs` | Tạo yêu cầu (kèm tenantId) |
| PUT | `/api/repairs/:id` | Cập nhật trạng thái / độ ưu tiên |

### 👤 Portal Người thuê (yêu cầu JWT)
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/me` | Lấy toàn bộ dữ liệu của người thuê |
| PUT | `/api/me/sign-contract/:contractId` | Ký hợp đồng |
| PUT | `/api/me/pay-invoice/:invoiceId` | Thanh toán hóa đơn |
| POST | `/api/me/repairs` | Gửi yêu cầu sửa chữa |

### ⚙️ Cài đặt
| Method | Endpoint | Mô tả |
|--------|---------|-------|
| GET | `/api/settings` | Thông tin chủ trọ |
| PUT | `/api/settings` | Cập nhật thông tin chủ trọ |

---

## Luồng dữ liệu chính

### Luồng hợp đồng
```
1. Người thuê đăng ký tài khoản → POST /api/auth/register (role=2)
2. Chủ trọ thêm khách thuê → POST /api/tenants (tạo HĐ tự động status=1)
   HOẶC
   Chủ trọ tạo HĐ mời ký → POST /api/contracts (status=0)
3. Người thuê nhận thông báo HĐ → GET /api/me → contracts[].status=0
4. Người thuê ký HĐ → PUT /api/me/sign-contract/:id → HĐ status=1
5. Chủ trọ thấy HĐ hiệu lực → GET /api/contracts → status=1
```

### Luồng thanh toán → Lịch sử doanh thu
```
1. Chủ trọ tạo hóa đơn → POST /api/invoices
2. Chủ trọ đánh dấu đã TT → PUT /api/invoices/:id/pay
   → Invoice.status = 1 (Đã thanh toán)
   → Transaction mới được tạo (ghi vào collection Transaction)
3. Lịch sử thanh toán reload → GET /api/payments
   → Đọc từ collection Transaction + populate Invoice/Room/Tenant
4. Biểu đồ doanh thu cập nhật dựa trên payments đã thanh toán
```

### Luồng sửa chữa
```
1. Người thuê đăng nhập → GET /api/me (lấy portal data)
2. Người thuê gửi yêu cầu → POST /api/me/repairs
   → Tự động tìm contract hiệu lực của tenant
   → Tạo RepairRequest gắn contractId
3. Chủ trọ thấy yêu cầu → GET /api/repairs (populate room + sender)
4. Chủ trọ cập nhật → PUT /api/repairs/:id {status, priority, note}
5. Người thuê thấy cập nhật → GET /api/me → repairs[]
```

---

## Thay đổi trong phiên bản này (cập nhật 07/06/2026)

### Backend (API)
- ✅ **Thêm `/api/me` endpoint** — Portal người thuê: lấy phòng, HĐ, hóa đơn, thanh toán, sửa chữa, stats
- ✅ **Thêm `/api/me/sign-contract/:id`** — Người thuê ký HĐ qua token JWT
- ✅ **Thêm `/api/me/pay-invoice/:id`** — Người thuê thanh toán hóa đơn
- ✅ **Thêm `/api/me/repairs`** — Người thuê gửi yêu cầu sửa chữa (tự tìm contract từ token)
- ✅ **Thêm `/api/payments`** — Lịch sử giao dịch từ collection Transaction
- ✅ **Thêm `PUT /api/contracts/:id`** — Cập nhật hợp đồng (Admin)
- ✅ **Sửa `GET /api/repairs`** — Populate đúng tên phòng và tên người gửi từ contract
- ✅ **Sửa `PUT /api/repairs/:id`** — Nhận đúng status/priority dạng string → number
- ✅ **Thêm `DELETE /api/rooms/:id`** — Xóa phòng (từ phiên bản trước)
- ✅ **Thêm `/api/settings`** — Cài đặt thông tin chủ trọ (từ phiên bản trước)

### Frontend (Web)
- ✅ **Sửa đăng nhập người thuê** — Nhận `role=2` từ JWT, chuyển sang giao diện tenant
- ✅ **Thanh tìm kiếm hoạt động** — Tìm kiếm toàn hệ thống (phòng, khách, hóa đơn)
- ✅ **Nút "Mời ký hợp đồng"** — Tạo hợp đồng status=0 thực sự, người thuê nhận thông báo
- ✅ **Đánh dấu đã thanh toán** — Tự động reload lịch sử thanh toán và biểu đồ doanh thu
- ✅ **Yêu cầu sửa chữa** — Người thuê gửi, Admin thấy + cập nhật, cả 2 role đều thấy
- ✅ **Nút "Hoàn thành sửa chữa"** — Admin click một nút để đánh dấu xong
- ✅ **Portal người thuê** — Xem hợp đồng, hóa đơn, thanh toán, thống kê chi phí
- ✅ **Đăng ký tài khoản** — Tab đăng ký trên màn hình login

---

## Database Schema (MongoDB)

| Collection | Mô tả |
|-----------|-------|
| `accounts` | Tài khoản người dùng (role 1=Chủ trọ, 2=Người thuê) |
| `rooms` | Thông tin phòng trọ |
| `contracts` | Hợp đồng thuê phòng |
| `invoices` | Hóa đơn hàng tháng |
| `transactions` | Lịch sử giao dịch thanh toán |
| `repairrequests` | Yêu cầu sửa chữa |
| `services` | Dịch vụ (điện, nước, wifi...) |

---

## Công nghệ sử dụng

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- nodemon (dev)

**Frontend:**
- Vite (build tool)
- Vanilla JavaScript (ES Modules)
- CSS thuần túy (Dark mode)
- VietQR API (QR thanh toán ngân hàng)
