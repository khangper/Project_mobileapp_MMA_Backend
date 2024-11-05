import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.217.139:5003",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const ListToyScreen = ({ navigation }) => {
  const [toys, setToys] = useState([]);

  const fetchToys = async () => {
    try {
      const response = await api.get("/api/toys");
      setToys(response.data);
    } catch (error) {
      console.error("Error fetching toys:", error);
      Alert.alert("Error", "Failed to fetch toys");
    }
  };

  useEffect(() => {
    fetchToys();

    // Refresh list when focusing screen
    const unsubscribe = navigation.addListener("focus", () => {
      fetchToys();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.toyItem}>
      <View style={styles.toyInfo}>
        <Text style={styles.toyName}>{item.name}</Text>
        <Text>Category: {item.category}</Text>
        <Text>
          Status: {item.is_saleable ? "For Rent & Sale" : "For Rent Only"}
        </Text>
        {item.is_saleable && item.fixedPrice && (
          <Text>Fixed Price: ${item.fixedPrice}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => navigation.navigate("UpdateToy", { toy: item })}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toy List</Text>
      <FlatList
        data={toys}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  toyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  toyInfo: {
    flex: 1,
  },
  toyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ListToyScreen;
