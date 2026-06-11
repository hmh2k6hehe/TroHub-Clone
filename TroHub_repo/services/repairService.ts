import { RepairRequest, Priority, RepairStatus } from "../types/RepairRequest";
import { apiClient } from "./apiClient";
import { authService } from "./authService";

type ApiRepairRequest = {
  _id: string;
  contractId?: {
    _id: string;
    roomId?: {
      _id: string;
      roomCode?: string;
    };
    tenantId?: {
      _id: string;
      fullName?: string;
      phone?: string;
    };
  };
  title: string;
  content: string;
  priority: number;
  status: number;
  landlordNote?: string;
  createdAt: string;
  updatedAt: string;
};

type RepairListResponse = {
  success: boolean;
  data: ApiRepairRequest[];
  message?: string;
};

type CreateRepairResponse = {
  success: boolean;
  message: string;
  data: ApiRepairRequest;
};

const mapPriorityFromApi = (priority: number): Priority => {
  if (priority === 3) return "Cao";
  if (priority === 1) return "Thấp";
  return "Trung bình";
};

const mapPriorityToApi = (priority?: Priority): number => {
  if (priority === "Cao") return 3;
  if (priority === "Thấp") return 1;
  return 2;
};

const mapStatusFromApi = (status: number): RepairStatus => {
  if (status === 2) return "done";
  if (status === 1) return "processing";
  return "pending";
};

const formatDate = (value?: string) => {
  if (!value) return "Không có";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không có";
  }

  return date.toLocaleDateString("vi-VN");
};

const mapApiRepairToRepair = (item: any): RepairRequest => {
  const roomCode = item.room?.code || item.room?.roomCode || item.contractId?.roomId?.roomCode || item.room || "A101";
  const images = Array.isArray(item.images)
    ? item.images.map((img: any) => typeof img === 'string' ? img : (img.fileUrl || img.url || ''))
    : [];
  return {
    id: item._id || item.id,
    room: roomCode,
    type: item.title || item.category || "",
    priority: mapPriorityFromApi(item.priority),
    description: item.content || item.description || "",
    status: mapStatusFromApi(item.status),
    createdAt: formatDate(item.createdAt),
    images,
  };
};

export const repairService = {
  async getRequests(): Promise<RepairRequest[]> {
    try {
      const token = await authService.getToken();
      const authUser = await authService.getAuthUser();

      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }

      if (!authUser) {
        throw new Error("Không tìm thấy thông tin user đăng nhập");
      }

      const response = await apiClient.get<RepairListResponse>(
        "/repairs",
        token
      );

      if (!response.success) {
        throw new Error(response.message || "Không lấy được danh sách sửa chữa");
      }

      const requests = response.data || [];

      const myRequests = requests.filter((item) => {
        return item.contractId?.tenantId?._id === authUser.id;
      });

      return myRequests.map(mapApiRepairToRepair);
    } catch (error) {
      console.log("Lỗi lấy danh sách sửa chữa từ API:", error);
      throw error;
    }
  },

  async createRequest(
    request: Omit<RepairRequest, "id" | "status" | "createdAt">
  ): Promise<RepairRequest[]> {
    try {
      const token = await authService.getToken();
      const authUser = await authService.getAuthUser();

      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }

      if (!authUser) {
        throw new Error("Không tìm thấy thông tin user đăng nhập");
      }

      const response = await apiClient.post<CreateRepairResponse>(
        "/repairs",
        {
          tenantId: authUser.id,
          room: request.room,
          title: request.type,
          content: request.description,
          priority: mapPriorityToApi(request.priority),
          images: request.images || [],
        },
        token
      );

      if (!response.success) {
        throw new Error(response.message || "Gửi yêu cầu sửa chữa thất bại");
      }

      return await this.getRequests();
    } catch (error) {
      console.log("Lỗi gửi yêu cầu sửa chữa qua API:", error);
      throw error;
    }
  },

  async deleteRequest(id: string): Promise<RepairRequest[]> {
    /**
     * Backend hiện chưa có DELETE /api/repairs/:id.
     * Tạm thời không xóa thật, chỉ load lại danh sách.
     * Nếu muốn xóa thật thì cần thêm route DELETE ở backend.
     */
    console.log("Backend chưa hỗ trợ xóa yêu cầu sửa chữa:", id);
    return await this.getRequests();
  },
};