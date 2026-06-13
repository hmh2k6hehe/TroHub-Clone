# Báo Cáo Thay Đổi (Changelog) - TroHub Clone

Dưới đây là danh sách chi tiết những thay đổi và lỗi đã được khắc phục trong phiên làm việc vừa qua để tiện cho việc theo dõi và tiếp tục sau này:

## 1. Sửa Lỗi Hóa Đơn (Invoice)
- **Tự động điền giá điện, nước, rác:** Đã cập nhật `app.js` và `contractController.js` để tự động lấy giá `defaultPrice` của Điện, Nước, Rác... từ Hợp đồng hiện tại của phòng thay vì để trống khi tạo Hóa đơn mới.
- **Tự động chuyển trạng thái Hóa Đơn:** 
  - Khách thuê khi nhấn nút **"Xác nhận đã thanh toán"** trên mã QR hóa đơn, trạng thái hóa đơn sẽ lập tức chuyển sang `"Đã thanh toán"`.
  - Admin khi bấm **"Nhắc nhở"** (Gửi yêu cầu thanh toán), hệ thống sẽ gửi nhắc nhở và tự động chuyển các hóa đơn chưa thanh toán của phòng đó sang `"Quá hạn"`.

## 2. Sửa Lỗi Quản Lý Khách Thuê (Tenants)
- **Cập nhật cách xác thực Đăng nhập:** Hệ thống hiện tại đã hỗ trợ khách thuê đăng nhập bằng một trong ba phương thức: `Email`, `Số điện thoại` hoặc `Tên đăng nhập`.
- **Tách biệt Tên Đăng Nhập và Mật Khẩu (Tính năng Thêm Khách Thuê):**
  - **Tên đăng nhập:** Chuyển đổi từ việc sử dụng *Số điện thoại* sang bắt buộc sử dụng **Email**. Mọi khách thuê hiện tại trong database đã được migrate `username` thành `email` của họ.
  - **Mật khẩu riêng biệt:** Thêm trường **Mật khẩu** vào form Thêm/Sửa khách thuê. Admin giờ đây phải tự thiết lập mật khẩu riêng cho khách thay vì hệ thống tự động lấy Số điện thoại làm mật khẩu mặc định như trước.
  - **Validate Dữ liệu:** Thêm các cảnh báo (toast) chặn trên giao diện nếu Admin không nhập Email hoặc Mật khẩu khi tạo mới.

## 3. Khắc phục Cấu trúc Database (Migrate)
- Đã chạy Script để **Mở khóa** (`status: 1`) toàn bộ các tài khoản khách thuê bị lỗi khóa (0).
- Đã chạy Script **Reset mật khẩu** của tất cả khách thuê cũ (được tạo trước đó) thành chính **Số điện thoại** của họ để giải quyết tình trạng sai mật khẩu do lỗi khởi tạo mặc định.
- Đã chạy Script **Cập nhật Tên đăng nhập** của các tài khoản cũ thành **Email**.

---
*Lưu ý cho lần làm việc tiếp theo: Các dữ liệu test (như `newuser@gmail.com` hay `khachthue5@gmail.com`) đang hoạt động tốt. Nếu có bất kỳ lỗi "Không thể đăng nhập" nào, hãy kiểm tra kỹ lại trong Database MongoDB bảng `accounts` xem mật khẩu mã hóa có khớp với số điện thoại hay email tương ứng không.*
