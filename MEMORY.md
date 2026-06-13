# TROHUB PROJECT MEMORY

## TRẠNG THÁI HIỆN TẠI (13/06/2026)
Dự án đang trong giai đoạn hoàn thiện, đồng bộ hóa logic chặt chẽ giữa Backend (API) và Frontend (Web Admin, Mobile App).

### CÁC TÍNH NĂNG ĐÃ HOÀN THIỆN:
1. **Luồng Hợp Đồng (Contract Flow):**
   - Admin tạo hợp đồng sẽ nằm ở trạng thái **Chờ ký** (0).
   - Khách thuê ký hợp đồng thì mới chuyển sang **Đang hiệu lực** (1).
   - Đã xử lý triệt để lỗi khi cập nhật lại Hợp đồng đã có hiệu lực (Không còn bị kẹt chặn `existing.status`).
   - Web Admin tự động chọn dữ liệu và liên kết chính xác `roomId` và `tenantId`.

2. **Luồng Hóa Đơn (Invoice Flow):**
   - Loại bỏ hoàn toàn nút **Lưu nháp**, hóa đơn xuất ra tự động là **Chưa thanh toán** (1).
   - Chủ trọ KHÔNG THỂ tự đánh dấu đã thanh toán trên App, trạng thái thanh toán phải do hành động của khách thuê.
   - Khi chủ trọ bấm **Gửi nhắc thanh toán**, hệ thống cập nhật sang **Quá hạn** (3) và **tự động tính 5% phí phạt** cộng thẳng vào tổng tiền (Các số liệu gốc như Tiền phòng, điện, nước được bảo toàn).
   - Form Xuất Hóa Đơn đã được tự động hóa hoàn toàn:
     - Tự kéo Tiền phòng và Tên khách từ Hợp đồng đang hiệu lực.
     - Tự kéo Chỉ số điện/nước MỚI của tháng trước để làm Chỉ số CŨ cho tháng này.

3. **Cấu hình Backend:**
   - Tăng `payload size limit` lên 50MB để tránh lỗi Request Entity Too Large.
   - Các API đã hoạt động ổn định và chính xác theo luồng logic đời thực.

### CÁC VIỆC CÒN DANG DỞ / CẦN LÀM TIẾP:
- [ ] **Kiểm tra kỹ lại biểu đồ doanh thu:** Đảm bảo `Transaction` được sinh ra chính xác khi khách đóng tiền và hiển thị đúng lên Biểu đồ Dashboard.
- [ ] **Hoàn thiện luồng Sửa chữa (Repair):** Đảm bảo luồng tạo yêu cầu từ Mobile và xử lý trên Web Admin trơn tru 100%.
- [ ] **Xử lý các tình huống biên (Edge cases):** Xóa phòng, đổi khách, khách dọn đi sớm (kết thúc hợp đồng).
- [ ] (Tùy chọn) Rà soát lại UI/UX trên Mobile App để phù hợp hơn với luồng Hóa đơn mới.

*Lưu ý: Mọi chỉnh sửa tiền phòng / hóa đơn phải luôn bảo toàn luật lệ: Lấy số liệu chốt từ Hợp Đồng, không được tự động tính toán lại giá mới trừ khi tạo Hợp đồng mới.*
