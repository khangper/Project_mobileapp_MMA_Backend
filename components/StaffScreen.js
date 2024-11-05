import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StaffScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const api = axios.create({
    baseURL: "http://192.168.217.139:5003",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await api.get("/api/checkout/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await api.put(
        `/api/checkout/${orderId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "approved" } : order
        )
      );

      Alert.alert("Thành công", "Đơn hàng đã được phê duyệt");
    } catch (error) {
      console.error("Error approving order:", error);
      Alert.alert("Lỗi", "Không thể phê duyệt đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.username}>Khách hàng: {item.user?.username}</Text>
        <Text
          style={[
            styles.status,
            item.status === "approved"
              ? styles.statusApproved
              : styles.statusPending,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Đồ chơi:</Text>
      {item.items.map((orderItem, index) => (
        <Text key={index} style={styles.itemText}>
          - {orderItem.toy?.name} (x{orderItem.quantity}){"\n  "}Giá:{" "}
          {orderItem.toy?.price.toLocaleString("vi-VN")} VNĐ
        </Text>
      ))}

      <Text style={styles.totalAmount}>
        Tổng tiền: {item.totalAmount.toLocaleString("vi-VN")} VNĐ
      </Text>

      {item.status === "Pending" && (
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApproveOrder(item._id)}
        >
          <Text style={styles.approveButtonText}>Phê duyệt</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý đơn hàng</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchOrders();
        }}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: "bold",
  },
  statusPending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  statusApproved: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  approveButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  approveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StaffScreen;
