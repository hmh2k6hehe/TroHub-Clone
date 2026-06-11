import { Platform } from "react-native";

const LOCAL_IP = "192.168.1.70";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : Platform.OS === "android"
    ? "http://10.0.2.2:5000/api"
    : `http://${LOCAL_IP}:5000/api`;