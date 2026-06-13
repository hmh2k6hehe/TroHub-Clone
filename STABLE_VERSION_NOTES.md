# Ghi chú Phiên bản Ổn định (Stable Version) - Web Admin

**Phiên bản:** `v1.0.0-stable-webadmin`
**Ngày lưu:** 13/06/2026

Đây là cột mốc quan trọng đánh dấu việc **toàn bộ các chức năng cốt lõi của Web Admin đã hoạt động hoàn thiện và ổn định**. Bản lưu này đóng vai trò như một điểm khôi phục an toàn (restore point). Nếu trong quá trình phát triển các tính năng tiếp theo (Mobile App, Cổng khách thuê, v.v.) xảy ra lỗi nghiêm trọng không thể sửa, bạn có thể dễ dàng quay lại trạng thái hoàn hảo này.

---

## 🎯 Các tính năng đã hoạt động ổn định trong bản này:
1. **Đăng ký / Đăng nhập:**
   - Hệ thống xác thực dùng Email làm tên đăng nhập chính thức. Mật khẩu được thiết lập riêng biệt và mã hóa an toàn.
   - Hỗ trợ đăng nhập linh hoạt bằng Email hoặc Số điện thoại.
2. **Quản lý Khách thuê:**
   - Thêm/Sửa thông tin khách thuê, hệ thống tự động sinh tài khoản đăng nhập (có email & mật khẩu độc lập).
   - Validation chặt chẽ, chống trùng lặp Email.
3. **Quản lý Hợp đồng:**
   - Liên kết Khách thuê với Phòng.
   - Quản lý dịch vụ đính kèm (Điện, nước, rác...) với giá mặc định chuẩn.
4. **Quản lý Hóa đơn & Thanh toán:**
   - Tự động bóc tách và tính toán giá dịch vụ (Điện, nước) từ Hợp đồng khi sinh Hóa đơn mới.
   - Cập nhật trạng thái "Đã thanh toán" tự động khi khách thuê xác nhận qua mã QR.
   - Tính năng "Nhắc nhở" giúp tự động chuyển trạng thái nợ sang "Quá hạn".
5. **Cấu trúc Database:**
   - Hoàn toàn sạch sẽ, không còn tài khoản kẹt trạng thái khóa (0). 

---

## 🔄 Hướng dẫn khôi phục lại bản này (Nếu cần)

Trong trường hợp code bị lỗi nặng ở tương lai, bạn có thể khôi phục lại chính xác trạng thái này bằng các câu lệnh Git sau:

**Cách 1: Xem lại code của bản ổn định (Không làm mất code mới)**
```bash
git checkout v1.0.0-stable-webadmin
```

**Cách 2: Khôi phục hoàn toàn và XÓA BỎ các sửa đổi bị lỗi sau này (Quay ngược thời gian)**
```bash
# 1. Quay lại bản ổn định
git reset --hard v1.0.0-stable-webadmin

# 2. Đẩy ngược lên Github (Lưu ý: sẽ ghi đè lịch sử)
git push origin main --force
```

*Giờ thì bạn có thể yên tâm phát triển tiếp rồi!*
