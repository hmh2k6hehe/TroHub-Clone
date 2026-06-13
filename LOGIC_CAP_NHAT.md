# BÁO CÁO CẬP NHẬT LOGIC QUẢN LÝ DỮ LIỆU TÀI CHÍNH

Tài liệu này giải thích chi tiết các biện pháp xử lý an toàn dữ liệu (Safe Data Handling) đã được áp dụng vào hệ thống TroHub nhằm đảm bảo tính toàn vẹn của lịch sử tài chính, hóa đơn và hợp đồng.

---

## 1. Logic Xóa Phòng (Room Deletion Logic)
**File xử lý:** `API_DuAnTotNghiep/src/controllers/roomController.js`

### Vấn đề cũ:
Hệ thống cho phép xóa vĩnh viễn (hard delete) một phòng nếu phòng đó không có người đang thuê. Điều này làm mất dữ liệu lịch sử các hợp đồng cũ đã từng thuê phòng này, dẫn đến sai lệch biểu đồ doanh thu.

### Giải pháp (Đã áp dụng):
- **Kiểm tra đang thuê:** Nếu phòng đang có người thuê (`status = 1`), chặn xóa.
- **Kiểm tra lịch sử:** Hệ thống tìm kiếm xem phòng này đã từng có bất kỳ hợp đồng nào trong quá khứ hay chưa.
  - Nếu **CÓ**, hệ thống báo lỗi: *"Không thể xóa vì phòng này đã có lịch sử hợp đồng và hóa đơn cũ. Vui lòng đổi tên hoặc chuyển sang Bảo trì"*.
  - Nếu **KHÔNG CÓ**, hệ thống cho phép xóa vĩnh viễn để dọn rác cơ sở dữ liệu.

---

## 2. Logic Hoàn Tất Hợp Đồng / Trả Phòng (Terminate Contract Logic)
**File xử lý:** `API_DuAnTotNghiep/src/controllers/tenantController.js`

### Vấn đề cũ:
Khi người thuê trả phòng, chủ trọ bấm "Kết thúc hợp đồng", hệ thống không kiểm tra công nợ và sẽ tự động khóa vĩnh viễn tài khoản (`status = 0`) của người thuê. Người thuê không thể đăng nhập vào App để xem lại lịch sử hóa đơn.

### Giải pháp (Đã áp dụng):
- **Chốt công nợ:** Trước khi chuyển hợp đồng sang trạng thái Hết hạn, hệ thống kiểm tra xem hợp đồng này còn hóa đơn nào ở trạng thái "Chưa thanh toán" hoặc "Quá hạn" hay không.
  - Nếu **CÒN NỢ**, hệ thống báo lỗi chặn việc trả phòng: *"Khách thuê này vẫn còn hóa đơn chưa thanh toán. Vui lòng thu tiền hoặc hủy hóa đơn trước."*
- **Quyền lợi khách thuê:** Bỏ lệnh khóa tài khoản khách thuê. Giữ nguyên tài khoản active. Khách mất quyền sở hữu phòng (về trạng thái không có phòng), nhưng vẫn dùng được App để tra cứu lịch sử đóng tiền cũ.

---

## 3. Logic Lịch Sử Khách Thuê Chuyển Phòng (Tenant Portal Multi-Contract Logic)
**File xử lý:** `API_DuAnTotNghiep/src/controllers/meController.js`

### Vấn đề cũ:
Trong Mobile App của khách thuê, danh sách "Hóa đơn", "Sửa chữa" và "Thanh toán" chỉ được truy vấn dựa trên ID của Hợp đồng đang hiệu lực (`activeContract._id`). Nếu khách tái ký hợp đồng mới hoặc chuyển sang phòng khác, mọi dữ liệu của phòng cũ bị "biến mất" khỏi màn hình.

### Giải pháp (Đã áp dụng):
- Gom **toàn bộ mảng ID hợp đồng** mà khách thuê đã từng ký từ trước đến nay (bao gồm cả hợp đồng đã kết thúc và hợp đồng đang thuê).
- Lấy toàn bộ Hóa đơn, Giao dịch thanh toán, và Yêu cầu sửa chữa khớp với bất kỳ ID hợp đồng nào trong mảng trên (`$in: allContractIds`).
- **Kết quả:** Khách thuê có một Timeline (dòng thời gian) liên tục và đầy đủ về toàn bộ quá trình thuê trọ của họ qua các năm hoặc qua nhiều phòng khác nhau trong cùng một hệ thống.

---
*Báo cáo được tạo tự động sau đợt cập nhật ngày 13/06/2026.*
