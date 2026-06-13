import { ENV } from "./env.js?v=7";

export const API_CONFIG = {
  BASE_URL: ENV.API_URL || "http://localhost:5000/api",

  ENDPOINTS: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/me",
    rooms: "/rooms",
    tenants: "/tenants",
    contracts: "/contracts",
    invoices: "/invoices",
    payments: "/payments",
    repairs: "/repairs",
    settings: "/settings",
    dashboardStats: "/dashboard/stats"
  },

  MAP_ROOM: (apiData) => ({
    id: apiData.roomCode || apiData._id || apiData.id || "",
    objectId: apiData._id || apiData.id || "",
    name: "Phòng " + (apiData.roomCode || apiData.name || ""),
    rent: apiData.defaultRentPrice || apiData.rent || 0,
    deposit: apiData.defaultDeposit || apiData.deposit || 0,
    area: apiData.area || 0,
    max: apiData.max || 1,
    occupantCount: apiData.occupantCount || 0,
    status: ["Còn trống", "Đang thuê", "Bảo trì"][Number(apiData.status)] || "Còn trống",
    tenant: apiData.tenant || "-",
    payment: apiData.payment || "Chưa thanh toán",
    note: apiData.note || ""
  }),

  MAP_ROOM_PAYLOAD: (payload) => ({
    roomCode: payload.id || payload.roomCode || payload.name,
    area: String(payload.area || "0"),
    defaultRentPrice: Number(payload.rent || payload.defaultRentPrice || 0),
    defaultDeposit: Number(payload.deposit || payload.defaultDeposit || 0),
    status: payload.status === "Đang thuê" ? 1 : payload.status === "Bảo trì" ? 2 : 0
  }),

  MAP_TENANT: (apiData) => ({
    id: apiData._id || apiData.id || "",
    objectId: apiData._id || apiData.id || "",
    name: apiData.fullName || apiData.name || "",
    phone: apiData.phone || "",
    email: apiData.email || apiData.username || "",
    room: apiData.room || apiData.roomId?.roomCode || "-",
    citizenId: apiData.idCard || apiData.citizenId || "",
    startDate: apiData.createdAt ? new Date(apiData.createdAt).toLocaleDateString("vi-VN") : "",
    status: Number(apiData.status) === 0 ? "Ngừng thuê" : "Đang thuê",
    accountStatus: "Đã tạo"
  }),

  MAP_TENANT_PAYLOAD: (payload) => ({
    fullName: payload.name || payload.fullName,
    phone: payload.phone,
    email: payload.email,
    username: payload.email,
    password: payload.password,
    idCard: payload.citizenId || payload.idCard,
    room: payload.room,
    status: payload.status === "Ngừng thuê" ? 0 : 1
  }),

  MAP_CONTRACT: (apiData) => ({
    id: apiData._id || apiData.id || "",
    objectId: apiData._id || apiData.id || "",
    room: apiData.roomId?.roomCode || apiData.roomId || apiData.room || "",
    tenant: apiData.tenantId?.fullName || apiData.tenantId || apiData.tenant || "",
    startDate: apiData.startDate ? new Date(apiData.startDate).toLocaleDateString("vi-VN") : "",
    endDate: apiData.endDate ? new Date(apiData.endDate).toLocaleDateString("vi-VN") : "",
    rent: apiData.fixedRentPrice || apiData.rent || 0,
    deposit: apiData.fixedDeposit || apiData.deposit || 0,
    status: ["Chờ ký", "Đang hiệu lực", "Đã kết thúc", "Đã hủy"][Number(apiData.status)] || "Chờ ký",
    tenantAccepted: apiData.tenantAccepted || false,
    services: apiData.services || []
  }),

  MAP_CONTRACT_PAYLOAD: (payload) => ({
    roomId: payload.roomId || payload.room,
    tenantId: payload.tenantId || payload.tenant,
    startDate: payload.startDate,
    endDate: payload.endDate,
    fixedRentPrice: Number(payload.rent || payload.fixedRentPrice || 0),
    fixedDeposit: Number(payload.deposit || payload.fixedDeposit || 0),
    status: payload.status === "Đang hiệu lực" ? 1 : payload.status === "Đã kết thúc" ? 2 : payload.status === "Đã hủy" ? 3 : 0,
    services: payload.services || []
  }),

  MAP_INVOICE: (apiData) => ({
    id: apiData.invoiceCode || apiData._id || apiData.id || "",
    objectId: apiData._id || apiData.id || "",
    room: apiData.room || apiData.contractId?.roomId?.roomCode || "-",
    tenant: apiData.tenant || apiData.contractId?.tenantId?.fullName || "-",
    month: apiData.period || apiData.month || "",
    fromDate: apiData.fromDate || "",
    toDate: apiData.toDate || "",
    dueDate: apiData.dueDate ? new Date(apiData.dueDate).toLocaleDateString("vi-VN") : "",
    roomAmount: apiData.roomAmount || apiData.contractId?.fixedRentPrice || 0,
    electricityOld: apiData.oldElectricityIndex || apiData.electricityOld || 0,
    electricityNew: apiData.newElectricityIndex || apiData.electricityNew || 0,
    electricity: apiData.electricity || 0,
    waterOld: apiData.oldWaterIndex || apiData.waterOld || 0,
    waterNew: apiData.newWaterIndex || apiData.waterNew || 0,
    water: apiData.water || 0,
    services: apiData.services || 0,
    discount: apiData.discount || 0,
    penaltyDays: apiData.penaltyDays || 0,
    penaltyRate: 0.1,
    penalty: apiData.penalty || 0,
    paymentMethod: apiData.paymentMethod || "",
    transactionCode: apiData.transactionCode || "-",
    total: apiData.totalAmount || apiData.total || 0,
    status: ["Nháp", "Chưa thanh toán", "Đã thanh toán", "Quá hạn"][Number(apiData.status)] || "Chưa thanh toán"
  }),

  MAP_REPAIR: (apiData) => ({
    id: apiData.repairCode || apiData._id || apiData.id || "",
    objectId: apiData._id || apiData.id || "",
    room: apiData.room || "-",
    sender: apiData.sender || "-",
    category: apiData.title || apiData.category || "",
    priority: ["", "Thấp", "Trung bình", "Cao"][Number(apiData.priority)] || "Thấp",
    priorityBy: "Admin",
    date: apiData.createdAt ? new Date(apiData.createdAt).toLocaleDateString("vi-VN") : "",
    status: ["Mới", "Đang xử lý", "Đã hoàn thành", "Đã hủy"][Number(apiData.status)] || "Mới",
    description: apiData.content || apiData.description || "",
    note: apiData.landlordNote || apiData.note || "",
    images: apiData.images || []
  }),

  MAP_PAYMENT: (apiData) => ({
    id: apiData.paymentCode || apiData._id || apiData.id || "",
    invoiceId: apiData.invoiceId?.invoiceCode || apiData.invoiceId || "",
    room: apiData.room || apiData.invoiceId?.contractId?.roomId?.roomCode || "-",
    tenant: apiData.tenant || apiData.invoiceId?.contractId?.tenantId?.fullName || "-",
    month: apiData.month || apiData.invoiceId?.period || "",
    date: apiData.createdAt ? new Date(apiData.createdAt).toLocaleDateString("vi-VN") : "",
    method: apiData.paymentMethod || apiData.method || "Tiền mặt",
    amount: apiData.amount || apiData.totalAmount || 0,
    status: ["Chưa thanh toán", "Đã thanh toán", "Thất bại"][Number(apiData.status)] || "Đã thanh toán"
  })
};