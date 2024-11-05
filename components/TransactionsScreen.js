import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.217.139:5003",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.log("Error fetching transactions:", error.message);
      Alert.alert("Error", "Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.transactionContainer}>
      {item.toy_id?.imageUrl && (
        <Image source={{ uri: item.toy_id.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.transactionTitle}>{item.toy_id?.name}</Text>
      <Text style={styles.transactionAmount}>Amount: ${item.amount}</Text>
      <Text style={styles.transactionDate}>
        Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.transactionStatus}>
        Status: {item.status === "completed" ? "Completed" : "Pending"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "column", // Change to column to stack items vertically
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 10, // Add space below the image
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  transactionAmount: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  transactionStatus: {
    fontSize: 14,
    color: "#009688",
    marginTop: 2,
  },
});

export default TransactionsScreen;

{
  /* <Text style={styles.transactionType}>Type: {item.transaction_type}</Text> */
}
