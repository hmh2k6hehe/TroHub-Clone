import zlib
import base64

admin_text = """@startuml
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle hollow
skinparam usecase {
  BackgroundColor White
  BorderColor Black
}

actor "Quản trị viên\n(Admin)" as Admin

rectangle "Hệ thống Web Admin" {
  usecase "Đăng nhập hệ thống" as UC_Login
  usecase "Quản lý tài khoản cá nhân" as UC_Account
  usecase "Quản lý khu trọ, dãy trọ\nvà phòng trọ" as UC_ManageRooms
  usecase "Quản lý người thuê" as UC_ManageTenants
  usecase "Quản lý hợp đồng thuê" as UC_ManageContracts
  usecase "Quản lý điện, nước\nvà dịch vụ" as UC_ManageServices
  usecase "Tạo và gửi hóa đơn\nhàng tháng" as UC_ManageInvoices
  usecase "Quản lý phản ánh, sự cố" as UC_ManageIssues
  usecase "Gửi thông báo đến người thuê" as UC_SendNotif
  usecase "Xem thống kê và\nbáo cáo doanh thu" as UC_Reports

  usecase "Quản lý trạng thái phòng" as UC_RoomStatus
  usecase "Nhập chỉ số điện nước" as UC_EnterMeters
  usecase "Xác nhận thanh toán" as UC_ConfirmPayment
  usecase "Theo dõi công nợ" as UC_TrackDebt

  Admin --> UC_Account
  Admin --> UC_ManageRooms
  Admin --> UC_ManageTenants
  Admin --> UC_ManageContracts
  Admin --> UC_ManageServices
  Admin --> UC_ManageInvoices
  Admin --> UC_ManageIssues
  Admin --> UC_SendNotif
  Admin --> UC_Reports

  UC_Account .> UC_Login : <<include>>
  UC_ManageRooms .> UC_Login : <<include>>
  UC_ManageTenants .> UC_Login : <<include>>
  UC_ManageContracts .> UC_Login : <<include>>
  UC_ManageServices .> UC_Login : <<include>>
  UC_ManageInvoices .> UC_Login : <<include>>
  UC_ManageIssues .> UC_Login : <<include>>
  UC_SendNotif .> UC_Login : <<include>>
  UC_Reports .> UC_Login : <<include>>

  UC_RoomStatus .> UC_ManageRooms : <<extend>>
  UC_EnterMeters .> UC_ManageServices : <<extend>>
  UC_ConfirmPayment .> UC_ManageInvoices : <<extend>>
  UC_TrackDebt .> UC_ManageInvoices : <<extend>>
}
@enduml"""

user_text = """@startuml
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle hollow
skinparam usecase {
  BackgroundColor White
  BorderColor Black
}

actor "Người dùng cuối\n(User)" as User

rectangle "Ứng dụng TroHub App" {
  usecase "Đăng nhập hệ thống" as UC_Login
  usecase "Cập nhật thông tin cá nhân" as UC_UpdateInfo
  usecase "Xem thông tin phòng đang thuê" as UC_ViewRoom
  usecase "Xem hóa đơn hàng tháng" as UC_ViewInvoice
  usecase "Gửi phản ánh sự cố" as UC_ReportIssue
  usecase "Nhận thông báo từ chủ trọ" as UC_ReceiveNotif

  usecase "Xem thời hạn hợp đồng\nvà giá thuê" as UC_ViewContract
  usecase "Xem các thông tin liên quan\nđến phòng đang thuê" as UC_ViewRoomInfo
  usecase "Theo dõi trạng thái\nthanh toán" as UC_TrackPayment
  usecase "Xem lịch sử thanh toán" as UC_PaymentHistory

  User --> UC_UpdateInfo
  User --> UC_ViewRoom
  User --> UC_ViewInvoice
  User --> UC_ReportIssue
  User --> UC_ReceiveNotif

  UC_UpdateInfo .> UC_Login : <<include>>
  UC_ViewRoom .> UC_Login : <<include>>
  UC_ViewInvoice .> UC_Login : <<include>>
  UC_ReportIssue .> UC_Login : <<include>>
  UC_ReceiveNotif .> UC_Login : <<include>>

  UC_ViewContract .> UC_ViewRoom : <<extend>>
  UC_ViewRoomInfo .> UC_ViewRoom : <<extend>>
  UC_TrackPayment .> UC_ViewInvoice : <<extend>>
  UC_PaymentHistory .> UC_ViewInvoice : <<extend>>
}
@enduml"""

def get_kroki_url(text):
    compressed = zlib.compress(text.encode('utf-8'), 9)
    encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')
    return f"https://kroki.io/plantuml/svg/{encoded}"

print("ADMIN:", get_kroki_url(admin_text))
print("USER:", get_kroki_url(user_text))
