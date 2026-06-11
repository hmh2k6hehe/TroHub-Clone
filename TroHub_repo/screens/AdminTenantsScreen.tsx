import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { adminService, AdminTenant, AdminRoom } from "../services/adminService";

export default function AdminTenantsScreen() {
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states for adding tenant
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [idCard, setIdCard] = useState("");
  const [selectedRoomCode, setSelectedRoomCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [tenantsData, roomsData] = await Promise.all([
        adminService.getTenants(),
        adminService.getRooms(),
      ]);
      setTenants(tenantsData);
      setRooms(roomsData);
    } catch (error) {
      console.log("Lỗi tải dữ liệu khách thuê:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Set default start date to today's date formatted as YYYY-MM-DD
    const today = new Date();
    setStartDate(today.toISOString().split("T")[0]);
  }, []);

  const handleAddTenant = async () => {
    if (!fullName.trim() || !phone.trim() || !idCard.trim() || !selectedRoomCode.trim() || !startDate.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.createTenant({
        fullName: fullName.trim(),
        phone: phone.trim(),
        roomCode: selectedRoomCode,
        idCard: idCard.trim(),
        startDate,
        password: phone.trim(), // default password is phone
      });
      Alert.alert("Thành công", "Đã thêm khách thuê mới và tạo hợp đồng nháp!");
      setModalVisible(false);
      setFullName("");
      setPhone("");
      setIdCard("");
      setSelectedRoomCode("");
      loadData();
    } catch (error) {
      Alert.alert("Lỗi", error instanceof Error ? error.message : "Thêm khách thuê thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  const vacantRooms = rooms.filter(room => room.status === 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách khách thuê</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="person-add" size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Thêm khách</Text>
        </Pressable>
      </View>

      <FlatList
        data={tenants}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.tenantCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.fullName.slice(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.tenantInfo}>
              <Text style={styles.tenantName}>{item.fullName}</Text>
              <Text style={styles.tenantSub}>SĐT: {item.phone}</Text>
              {item.email && <Text style={styles.tenantSub}>Email: {item.email}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </View>
        )}
      />

      {/* Modal thêm khách thuê */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm khách thuê mới</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </Pressable>
            </View>

            <FlatList
              data={[1]}
              keyExtractor={(item) => String(item)}
              showsVerticalScrollIndicator={false}
              renderItem={() => (
                <View style={styles.form}>
                  <Text style={styles.label}>Họ và tên</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Nhập họ và tên khách"
                  />

                  <Text style={styles.label}>Số điện thoại (dùng để đăng nhập)</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />

                  <Text style={styles.label}>Số CCCD</Text>
                  <TextInput
                    style={styles.input}
                    value={idCard}
                    onChangeText={setIdCard}
                    placeholder="Nhập số CMND/CCCD"
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Chọn phòng trống</Text>
                  <View style={styles.dropdownContainer}>
                    {vacantRooms.length === 0 ? (
                      <Text style={styles.noVacantText}>Không có phòng trống nào hiện tại!</Text>
                    ) : (
                      <View style={styles.roomSelectGrid}>
                        {vacantRooms.map((room) => (
                          <Pressable
                            key={room._id}
                            style={[
                              styles.roomSelectItem,
                              selectedRoomCode === room.roomCode && styles.roomSelectActive
                            ]}
                            onPress={() => setSelectedRoomCode(room.roomCode)}
                          >
                            <Text
                              style={[
                                styles.roomSelectText,
                                selectedRoomCode === room.roomCode && styles.roomSelectTextActive
                              ]}
                            >
                              {room.roomCode}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>

                  <Text style={styles.label}>Ngày bắt đầu hợp đồng (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                  />

                  <Pressable
                    style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                    onPress={handleAddTenant}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitButtonText}>Thêm khách & Tạo hợp đồng</Text>
                    )}
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  tenantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.orangeSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    color: COLORS.orange,
    fontWeight: "900",
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  tenantSub: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F0F0F0",
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  form: {
    width: "100%",
    paddingBottom: 20,
  },
  label: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#F4F5F7",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  dropdownContainer: {
    width: "100%",
    minHeight: 44,
    justifyContent: "center",
    marginTop: 2,
  },
  noVacantText: {
    fontSize: 13,
    color: COLORS.red,
    fontWeight: "700",
  },
  roomSelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roomSelectItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E9ED",
    backgroundColor: "#FFFFFF",
  },
  roomSelectActive: {
    backgroundColor: COLORS.orangeSoft,
    borderColor: COLORS.orange,
  },
  roomSelectText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "700",
  },
  roomSelectTextActive: {
    color: COLORS.orange,
    fontWeight: "900",
  },
  submitButton: {
    height: 48,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
