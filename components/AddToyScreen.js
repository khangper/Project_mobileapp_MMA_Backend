// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const api = axios.create({
//   baseURL: "http://192.168.217.139:5003",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// const AddToyScreen = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [priceDay, setPriceDay] = useState("");
//   const [priceWeek, setPriceWeek] = useState("");
//   const [priceFortnite, setPriceFortnite] = useState("");
//   const [fixedPrice, setFixedPrice] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [inventoryCount, setInventoryCount] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saleOption, setSaleOption] = useState("rent"); // 'rent' or 'rentAndSale'

//   const handleAddToy = async () => {
//     // Validate required fields based on selected option
//     const requiredFields = [
//       name,
//       category,
//       description,
//       imageUrl,
//       priceDay,
//       priceWeek,
//       priceFortnite,
//       inventoryCount,
//     ];
//     if (saleOption === "rentAndSale") {
//       requiredFields.push(fixedPrice);
//     }

//     if (requiredFields.some((field) => !field)) {
//       Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
//       return;
//     }

//     setLoading(true);

//     try {
//       const userToken = await AsyncStorage.getItem("userToken");
//       const userId = await AsyncStorage.getItem("userId");

//       const toyData = {
//         name,
//         category,
//         description,
//         imageUrl,
//         price: {
//           day: parseFloat(priceDay),
//           week: parseFloat(priceWeek),
//           twoWeeks: parseFloat(priceFortnite),
//         },
//         fixedPrice:
//           saleOption === "rentAndSale" ? parseFloat(fixedPrice) : null,
//         availability,
//         is_rentable: true,
//         is_saleable: saleOption === "rentAndSale",
//         supplier_id: userId,
//         inventory_count: parseInt(inventoryCount),
//       };

//       // Only include fixedPrice if saleOption is rentAndSale
//       if (saleOption === "rentAndSale") {
//         toyData.fixedPrice = parseFloat(fixedPrice);
//       }

//       console.log("Sending toy data:", toyData);

//       const response = await api.post("/api/toys", toyData, {
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//       });

//       if (response.data) {
//         Alert.alert("Thành công", "Thêm mới sản phẩm thành công!", [
//           {
//             text: "OK",
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error data:", error.response?.data);
//       // ... rest of error handling
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <TouchableOpacity
//         style={styles.navigationButton}
//         onPress={() => navigation.navigate("ListToy")}
//       >
//         <Text style={styles.navigationButtonText}>Xem danh sách sản phẩm</Text>
//       </TouchableOpacity>
//       <Text style={styles.title}>Thêm mới sản phẩm</Text>

//       {/* Option Selection */}
//       <View style={styles.optionContainer}>
//         <TouchableOpacity
//           style={[
//             styles.optionButton,
//             saleOption === "rent" && styles.optionButtonActive,
//           ]}
//           onPress={() => setSaleOption("rent")}
//         >
//           <Text
//             style={[
//               styles.optionText,
//               saleOption === "rent" && styles.optionTextActive,
//             ]}
//           >
//             Chỉ cho thuê
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.optionButton,
//             saleOption === "rentAndSale" && styles.optionButtonActive,
//           ]}
//           onPress={() => setSaleOption("rentAndSale")}
//         >
//           <Text
//             style={[
//               styles.optionText,
//               saleOption === "rentAndSale" && styles.optionTextActive,
//             ]}
//           >
//             Cho thuê và bán
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Tên sản phẩm"
//         value={name}
//         onChangeText={setName}
//         editable={!loading}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Danh mục"
//         value={category}
//         onChangeText={setCategory}
//         editable={!loading}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Mô tả"
//         value={description}
//         onChangeText={setDescription}
//         editable={!loading}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Hình ảnh (URL)"
//         value={imageUrl}
//         onChangeText={setImageUrl}
//         editable={!loading}
//       />

//       {/* Rental Prices Section */}
//       <View style={styles.priceSection}>
//         <Text style={styles.sectionTitle}>Giá cho thuê</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Giá theo ngày"
//           keyboardType="numeric"
//           value={priceDay}
//           onChangeText={setPriceDay}
//           editable={!loading}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Giá theo tuần"
//           keyboardType="numeric"
//           value={priceWeek}
//           onChangeText={setPriceWeek}
//           editable={!loading}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Giá theo 2 tuần"
//           keyboardType="numeric"
//           value={priceFortnite}
//           onChangeText={setPriceFortnite}
//           editable={!loading}
//         />
//       </View>

//       {/* Fixed Price Section - Only show if rentAndSale is selected */}
//       {saleOption === "rentAndSale" && (
//         <View style={styles.priceSection}>
//           <Text style={styles.sectionTitle}>Giá bán</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Giá bán"
//             keyboardType="numeric"
//             value={fixedPrice}
//             onChangeText={setFixedPrice}
//             editable={!loading}
//           />
//         </View>
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Số lượng"
//         keyboardType="numeric"
//         value={inventoryCount}
//         onChangeText={setInventoryCount}
//         editable={!loading}
//       />

//       <View style={styles.buttonContainer}>
//         <Button
//           title={loading ? "Đang xử lý..." : "Thêm sản phẩm"}
//           onPress={handleAddToy}
//           disabled={loading}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 30,
//     color: "#333",
//   },
//   optionContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   optionButton: {
//     flex: 1,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   optionButtonActive: {
//     backgroundColor: "#007AFF",
//     borderColor: "#007AFF",
//   },
//   optionText: {
//     color: "#333",
//     fontSize: 16,
//   },
//   optionTextActive: {
//     color: "#fff",
//   },
//   input: {
//     height: 50,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     backgroundColor: "#fafafa",
//     fontSize: 16,
//   },
//   priceSection: {
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   buttonContainer: {
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   navigationButton: {
//     backgroundColor: "#4CAF50",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//     width: "100%",
//   },
//   navigationButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default AddToyScreen;
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

const AddToyScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [priceWeek, setPriceWeek] = useState("");
  const [priceFortnite, setPriceFortnite] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [inventoryCount, setInventoryCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [saleOption, setSaleOption] = useState("rent"); // 'rent' or 'rentAndSale'

  const handleAddToy = async () => {
    const requiredFields = [
      name,
      category,
      description,
      imageUrl,
      priceDay,
      priceWeek,
      priceFortnite,
      inventoryCount,
    ];
    if (saleOption === "rentAndSale") {
      requiredFields.push(fixedPrice);
    }

    if (requiredFields.some((field) => !field)) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      const toyData = {
        name,
        category,
        description,
        imageUrl,
        price: {
          day: parseFloat(priceDay),
          week: parseFloat(priceWeek),
          twoWeeks: parseFloat(priceFortnite),
        },
        fixedPrice:
          saleOption === "rentAndSale" ? parseFloat(fixedPrice) : null,
        availability,
        is_rentable: true,
        is_saleable: saleOption === "rentAndSale",
        supplier_id: userId,
        inventory_count: parseInt(inventoryCount),
      };

      const response = await api.post("/api/toys", toyData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data) {
        Alert.alert("Thành công", "Thêm mới sản phẩm thành công!", [
          {
            text: "OK",
          },
        ]);
      }
    } catch (error) {
      console.error("Error data:", error.response?.data);
    } finally {
      setLoading(false);
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Logout Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Thêm mới sản phẩm</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => navigation.navigate("ListToy")}
      >
        <Text style={styles.navigationButtonText}>Xem danh sách sản phẩm</Text>
      </TouchableOpacity>

      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            saleOption === "rent" && styles.optionButtonActive,
          ]}
          onPress={() => setSaleOption("rent")}
        >
          <Text
            style={[
              styles.optionText,
              saleOption === "rent" && styles.optionTextActive,
            ]}
          >
            Chỉ cho thuê
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            saleOption === "rentAndSale" && styles.optionButtonActive,
          ]}
          onPress={() => setSaleOption("rentAndSale")}
        >
          <Text
            style={[
              styles.optionText,
              saleOption === "rentAndSale" && styles.optionTextActive,
            ]}
          >
            Cho thuê và bán
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Danh mục"
        value={category}
        onChangeText={setCategory}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Hình ảnh (URL)"
        value={imageUrl}
        onChangeText={setImageUrl}
        editable={!loading}
      />

      <View style={styles.priceSection}>
        <Text style={styles.sectionTitle}>Giá cho thuê</Text>
        <TextInput
          style={styles.input}
          placeholder="Giá theo ngày"
          keyboardType="numeric"
          value={priceDay}
          onChangeText={setPriceDay}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá theo tuần"
          keyboardType="numeric"
          value={priceWeek}
          onChangeText={setPriceWeek}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá theo 2 tuần"
          keyboardType="numeric"
          value={priceFortnite}
          onChangeText={setPriceFortnite}
          editable={!loading}
        />
      </View>

      {saleOption === "rentAndSale" && (
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Giá bán</Text>
          <TextInput
            style={styles.input}
            placeholder="Giá bán"
            keyboardType="numeric"
            value={fixedPrice}
            onChangeText={setFixedPrice}
            editable={!loading}
          />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Số lượng"
        keyboardType="numeric"
        value={inventoryCount}
        onChangeText={setInventoryCount}
        editable={!loading}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Đang xử lý..." : "Thêm sản phẩm"}
          onPress={handleAddToy}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#FF0000",
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    color: "#333",
    fontSize: 16,
  },
  optionTextActive: {
    color: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  priceSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  navigationButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  navigationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddToyScreen;
