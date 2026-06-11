import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import { COLORS } from "../constants/theme";
import {
  Priority,
  RepairRequest,
  RepairStatus,
} from "../types/RepairRequest";
import { repairService } from "../services/repairService";

export default function RepairScreen() {
  const [room] = useState("A101");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState<Priority>("Trung bình");
  const [description, setDescription] = useState("");

  const [typeError, setTypeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const data = await repairService.getRequests();
      setRequests(data);
    } catch (error) {
      console.log("Lỗi load yêu cầu sửa chữa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!type.trim()) {
      setTypeError("Vui lòng nhập loại sự cố");
      isValid = false;
    } else {
      setTypeError("");
    }

    if (!description.trim()) {
      setDescriptionError("Vui lòng nhập mô tả sự cố");
      isValid = false;
    } else if (description.trim().length < 10) {
      setDescriptionError("Mô tả phải có ít nhất 10 ký tự");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!isValid) return;

    try {
      const updatedRequests = await repairService.createRequest({
        room,
        type: type.trim(),
        priority,
        description: description.trim(),
      });

      setRequests(updatedRequests);

      Alert.alert("Thành công", "Yêu cầu sửa chữa đã được gửi");

      setType("");
      setPriority("Trung bình");
      setDescription("");
    } catch (error) {
      console.log("Lỗi gửi yêu cầu:", error);
      Alert.alert("Lỗi", "Không thể gửi yêu cầu sửa chữa");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedRequests = await repairService.deleteRequest(id);
      setRequests(updatedRequests);
    } catch (error) {
      console.log("Lỗi xóa yêu cầu:", error);
      Alert.alert("Lỗi", "Không thể xóa yêu cầu sửa chữa");
    }
  };

  const getPriorityStyle = (value: Priority) => {
    if (value === "Cao") return styles.priorityHigh;
    if (value === "Thấp") return styles.priorityLow;
    return styles.priorityMedium;
  };

  const getStatusText = (status: RepairStatus) => {
    if (status === "pending") return "Chờ tiếp nhận";
    if (status === "processing") return "Đang xử lý";
    return "Đã hoàn thành";
  };

  const getStatusStyle = (status: RepairStatus) => {
    if (status === "done") return styles.statusDone;
    if (status === "processing") return styles.statusProcessing;
    return styles.statusPending;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={COLORS.orange} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Yêu cầu sửa chữa</Text>
      <Text style={styles.subtitle}>
        Gửi thông tin sự cố để chủ trọ xử lý nhanh hơn.
      </Text>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Tạo yêu cầu mới</Text>

        <Text style={styles.label}>Phòng</Text>
        <TextInput style={styles.inputDisabled} value={room} editable={false} />

        <Text style={styles.label}>Loại sự cố</Text>
        <TextInput
          style={[styles.input, typeError ? styles.inputError : null]}
          value={type}
          onChangeText={(value) => {
            setType(value);
            if (typeError) setTypeError("");
          }}
          placeholder="Điện, nước, internet, máy lạnh..."
          placeholderTextColor={COLORS.muted}
        />
        {typeError ? <Text style={styles.errorText}>{typeError}</Text> : null}

        <Text style={styles.label}>Mức độ ưu tiên</Text>
        <View style={styles.priorityRow}>
          {(["Cao", "Trung bình", "Thấp"] as Priority[]).map((item) => {
            const active = priority === item;

            return (
              <Pressable
                key={item}
                style={[styles.priorityButton, active && styles.priorityActive]}
                onPress={() => setPriority(item)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    active && styles.priorityTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            descriptionError ? styles.inputError : null,
          ]}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            if (descriptionError) setDescriptionError("");
          }}
          placeholder="Ví dụ: Máy lạnh không hoạt động, nước chảy yếu..."
          placeholderTextColor={COLORS.muted}
          multiline
        />
        {descriptionError ? (
          <Text style={styles.errorText}>{descriptionError}</Text>
        ) : null}

        <Pressable style={styles.uploadBox}>
          <Text style={styles.uploadIcon}>＋</Text>
          <Text style={styles.uploadText}>Upload ảnh sự cố</Text>
          <Text style={styles.uploadHint}>PNG, JPG hoặc JPEG</Text>
        </Pressable>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Gửi yêu cầu</Text>
        </Pressable>
      </Card>

      <Text style={styles.historyTitle}>Yêu cầu đã gửi</Text>

      {requests.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>Chưa có yêu cầu sửa chữa nào.</Text>
        </Card>
      ) : (
        requests.map((item) => (
          <Card key={item.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestLeft}>
                <Text style={styles.requestTitle}>{item.type}</Text>
                <Text style={styles.requestDate}>
                  Phòng {item.room} • {item.createdAt}
                </Text>
              </View>

              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.requestDesc}>{item.description}</Text>

            <View style={styles.requestFooter}>
              <View
                style={[styles.priorityBadge, getPriorityStyle(item.priority)]}
              >
                <Text style={styles.priorityBadgeText}>{item.priority}</Text>
              </View>

              <Pressable onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Xóa</Text>
              </Pressable>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  formCard: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 8,
    marginTop: 10,
    fontWeight: "700",
  },
  input: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E8E9ED",
    fontSize: 14,
    color: COLORS.text,
  },
  inputDisabled: {
    width: "100%",
    height: 48,
    backgroundColor: "#ECEEF2",
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E1E3E8",
    fontSize: 14,
    color: COLORS.muted,
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF7F7",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  priorityRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  priorityButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.muted,
  },
  priorityTextActive: {
    color: "#FFFFFF",
  },
  textArea: {
    height: 105,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  uploadBox: {
    height: 116,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFD8C2",
    borderStyle: "dashed",
    backgroundColor: "#FFF7F2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 16,
  },
  uploadIcon: {
    color: COLORS.orange,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },
  uploadText: {
    color: COLORS.orange,
    fontWeight: "800",
    fontSize: 14,
  },
  uploadHint: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    height: 52,
    backgroundColor: COLORS.orange,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  requestCard: {
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  requestLeft: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },
  requestDate: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusPending: {
    backgroundColor: "#FFF4E5",
  },
  statusProcessing: {
    backgroundColor: "#E6FAFF",
  },
  statusDone: {
    backgroundColor: "#EAFBEF",
  },
  statusText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "900",
  },
  requestDesc: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  requestFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    alignItems: "center",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityHigh: {
    backgroundColor: "#FFE8E8",
  },
  priorityMedium: {
    backgroundColor: COLORS.orangeSoft,
  },
  priorityLow: {
    backgroundColor: "#EAFBEF",
  },
  priorityBadgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "900",
  },
  deleteText: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: "900",
  },
});