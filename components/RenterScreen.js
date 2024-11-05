// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   TextInput,
// } from "react-native";
// import axios from "axios";
// import { Picker } from "@react-native-picker/picker";
// import Icon from "react-native-vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const api = axios.create({
//   baseURL: "http://192.168.217.139:5003",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("userToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const RenterScreen = ({ navigation }) => {
//   const [toys, setToys] = useState([]);
//   const [filteredToys, setFilteredToys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const fetchToys = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/api/toys");
//       setToys(response.data);
//       setFilteredToys(response.data);
//     } catch (error) {
//       console.log("Error fetching toys:", error.message);
//       Alert.alert("Error", "Failed to fetch toys. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchToys();
//   }, []);

//   useEffect(() => {
//     const filtered = toys.filter((toy) => {
//       const matchesSearchQuery = toy.name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());
//       const matchesCategory =
//         selectedCategory === "All" || toy.category === selectedCategory;
//       return matchesSearchQuery && matchesCategory;
//     });
//     setFilteredToys(filtered);
//   }, [searchQuery, selectedCategory, toys]);

//   const updateToyRentableStatus = (toyId) => {
//     setToys((prevToys) =>
//       prevToys.map((toy) =>
//         toy._id === toyId ? { ...toy, is_rentable: false } : toy
//       )
//     );
//   };

//   const addToCart = async (toyId) => {
//     try {
//       await api.post("/api/shopping-cart", {
//         toyId,
//         rent_duration: "day",
//         quantity: 1,
//       });

//       Alert.alert("Success", "Item added to cart!");
//     } catch (error) {
//       console.error("Error adding to cart:", error);

//       if (error.response?.status === 401 || error.response?.status === 403) {
//         Alert.alert("Authentication Error", "Please login to continue", [
//           { text: "OK", onPress: () => navigation.navigate("Login") },
//         ]);
//       } else {
//         Alert.alert("Error", "Failed to add item to cart. Please try again.");
//       }
//     }
//   };

//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem("userToken"); // Clear token
//       navigation.navigate("Login"); // Redirect to Login screen
//     } catch (error) {
//       Alert.alert("Error", "Failed to log out. Please try again.");
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={[styles.toyContainer, { shadowOpacity: 0.3 }]}>
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={() => navigation.navigate("ToyDetail", { toyId: item._id })}
//         style={styles.toyContentContainer}
//       >
//         <Image source={{ uri: item.imageUrl }} style={styles.image} />
//         <View style={styles.infoContainer}>
//           <Text style={styles.toyName}>{item.name}</Text>
//           <Text style={styles.toyCategory}>Category: {item.category}</Text>
//           <Text style={styles.toyPrice}>Price/Day: ${item.price.day}</Text>
//           <Text style={styles.toyAvailability}>
//             {item.availability ? "Available" : "Not Available"}
//           </Text>
//           <Text style={styles.toyAvailability}>
//             {item.is_rentable ? "Can Rent" : "Cannot Rent"}
//           </Text>
//           <Text style={styles.toyAvailability}>
//             {item.is_saleable ? "Sale" : "Not Sale"}
//           </Text>
//         </View>
//       </TouchableOpacity>
//       {item.availability && item.is_rentable && (
//         <TouchableOpacity
//           style={[
//             styles.rentButton,
//             !item.is_rentable && styles.rentButtonDisabled,
//           ]}
//           onPress={() => addToCart(item._id)}
//           disabled={!item.is_rentable}
//         >
//           <Text style={styles.rentButtonText}>
//             {item.is_rentable ? "Rent" : "Not Available"}
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Available Toys for Rent</Text>
//         <TouchableOpacity
//           style={styles.cartButton}
//           onPress={() => navigation.navigate("ShoppingCart")}
//         >
//           <Icon name="cart-outline" size={24} color="#333" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.transactionButton}
//           onPress={() => navigation.navigate("Transactions")}
//         >
//           <Text style={styles.transactionButtonText}>View Transactions</Text>
//         </TouchableOpacity>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutButton} onPress={logout}>
//           <Icon name="log-out-outline" size={24} color="#333" />
//         </TouchableOpacity>
//       </View>

//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search toys..."
//         value={searchQuery}
//         onChangeText={(text) => setSearchQuery(text)}
//       />

//       <Picker
//         selectedValue={selectedCategory}
//         onValueChange={(value) => setSelectedCategory(value)}
//         style={styles.picker}
//       >
//         <Picker.Item label="All Categories" value="All" />
//         <Picker.Item label="Educational" value="Educational" />
//         <Picker.Item label="Collection" value="Collection" />
//       </Picker>

//       {loading ? (
//         <ActivityIndicator size="large" color="#333" />
//       ) : (
//         <FlatList
//           data={filteredToys}
//           renderItem={renderItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.listContainer}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     flex: 1,
//   },
//   cartButton: {
//     padding: 8,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//     backgroundColor: "#f9f9f9",
//   },
//   picker: {
//     height: 40,
//     width: "100%",
//     marginBottom: 10,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   toyContainer: {
//     marginBottom: 15,
//     borderRadius: 8,
//     backgroundColor: "#fafafa",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   toyContentContainer: {
//     flexDirection: "row",
//     padding: 15,
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 15,
//   },
//   infoContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   toyName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   toyCategory: {
//     fontSize: 14,
//     color: "#666",
//   },
//   toyPrice: {
//     fontSize: 14,
//     color: "#333",
//     marginTop: 5,
//   },
//   toyAvailability: {
//     fontSize: 14,
//     color: "#009688",
//     marginTop: 5,
//   },
//   rentButton: {
//     backgroundColor: "#009688",
//     padding: 10,
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//   },
//   rentButtonDisabled: {
//     backgroundColor: "#cccccc",
//   },
//   rentButtonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   transactionButton: {
//     padding: 10,
//     backgroundColor: "#009688",
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   transactionButtonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   logoutButton: {
//     padding: 8,
//   },
// });

// export default RenterScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
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
      config.headers.Authorization = `Bearer ${token}`; // Fix: Added backticks
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const RenterScreen = ({ navigation }) => {
  const [toys, setToys] = useState([]);
  const [filteredToys, setFilteredToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDurations, setSelectedDurations] = useState({});
  const [addingToCart, setAddingToCart] = useState(false); // New state for adding to cart

  const fetchToys = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/toys");
      setToys(response.data);
      setFilteredToys(response.data);
    } catch (error) {
      console.log("Error fetching toys:", error.message);
      Alert.alert("Error", "Failed to fetch toys. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToys();
  }, []);

  useEffect(() => {
    const filtered = toys.filter((toy) => {
      const matchesSearchQuery = toy.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || toy.category === selectedCategory;
      return matchesSearchQuery && matchesCategory;
    });
    setFilteredToys(filtered);
  }, [searchQuery, selectedCategory, toys]);

  const updateToyRentableStatus = (toyId) => {
    setToys((prevToys) =>
      prevToys.map((toy) =>
        toy._id === toyId ? { ...toy, is_rentable: false } : toy
      )
    );
  };

  const handleDurationChange = (toyId, duration) => {
    setSelectedDurations((prevDurations) => ({
      ...prevDurations,
      [toyId]: duration,
    }));
  };

  const addToCart = async (toyId) => {
    const rentDuration = selectedDurations[toyId] || "day"; // Default to "day" if no duration selected
    setAddingToCart(true); // Start loading state for adding to cart
    try {
      await api.post("/api/shopping-cart", {
        toyId,
        rent_duration: rentDuration,
        quantity: 1,
      });

      Alert.alert("Success", `Item added to cart for ${rentDuration}!`); // Fix: Added backticks
      updateToyRentableStatus(toyId); // Update toy status after adding to cart
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert("Authentication Error", "Please login to continue", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", "Failed to add item to cart. Please try again.");
      }
    } finally {
      setAddingToCart(false); // End loading state for adding to cart
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.toyContainer, { shadowOpacity: 0.3 }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ToyDetail", { toyId: item._id })}
        style={styles.toyContentContainer}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.toyName}>{item.name}</Text>
          <Text style={styles.toyCategory}>Category: {item.category}</Text>
          <Text style={styles.toyPrice}>Price/Day: ${item.price.day}</Text>
          <Text style={styles.toyAvailability}>
            {item.availability ? "Available" : "Not Available"}
          </Text>
          <Text style={styles.toyAvailability}>
            {item.is_rentable ? "Can Rent" : "Cannot Rent"}
          </Text>
          <Text style={styles.toyAvailability}>
            {item.is_saleable ? "Sale" : "Not Sale"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Duration Picker */}
      <Picker
        selectedValue={selectedDurations[item._id] || "day"}
        onValueChange={(value) => handleDurationChange(item._id, value)}
        style={styles.picker}
      >
        <Picker.Item label="Daily Rate" value="day" />
        <Picker.Item label="Weekly Rate" value="week" />
        <Picker.Item label="Bi-weekly Rate" value="twoWeeks" />
      </Picker>

      {item.availability && item.is_rentable && (
        <TouchableOpacity
          style={[
            styles.rentButton,
            !item.is_rentable && styles.rentButtonDisabled,
          ]}
          onPress={() => addToCart(item._id)}
          disabled={!item.is_rentable || addingToCart} // Disable if adding to cart
        >
          <Text style={styles.rentButtonText}>
            {item.is_rentable
              ? addingToCart
                ? "Adding..."
                : "Rent"
              : "Not Available"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Toys for Rent</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("ShoppingCart")}
        >
          <Icon name="cart-outline" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transactionButton}
          onPress={() => navigation.navigate("Transactions")}
        >
          <Text style={styles.transactionButtonText}>View Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon name="log-out-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search toys..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value)}
        style={styles.picker}
      >
        <Picker.Item label="All Categories" value="All" />
        <Picker.Item label="Educational" value="Educational" />
        <Picker.Item label="Collection" value="Collection" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={filteredToys}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  cartButton: {
    padding: 8,
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 40,
    width: "100%",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  toyContainer: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toyContentContainer: {
    flexDirection: "row",
    padding: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  toyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  toyCategory: {
    fontSize: 14,
    color: "#666",
  },
  toyPrice: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  toyAvailability: {
    fontSize: 14,
    color: "#009688",
    marginTop: 5,
  },
  rentButton: {
    backgroundColor: "#009688",
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  rentButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  rentButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  transactionButton: {
    padding: 10,
    backgroundColor: "#009688",
    borderRadius: 5,
    marginTop: 10,
  },
  transactionButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
});

export default RenterScreen;
