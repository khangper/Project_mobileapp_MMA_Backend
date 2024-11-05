import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.217:5003",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const UpdateToyScreen = ({ route, navigation }) => {
  const { toy } = route.params;

  const [formData, setFormData] = useState({
    name: toy.name,
    category: toy.category,
    description: toy.description,
    imageUrl: toy.imageUrl,
    priceDay: toy.price.day.toString(),
    priceWeek: toy.price.week.toString(),
    priceTwoWeeks: toy.price.twoWeeks.toString(),
    inventory_count: toy.inventory_count.toString(),
    is_saleable: toy.is_saleable,
    fixedPrice: toy.fixedPrice?.toString() || "",
  });

  const toggleSaleOption = () => {
    setFormData((prev) => ({
      ...prev,
      is_saleable: !prev.is_saleable,
      fixedPrice: !prev.is_saleable ? "" : null,
    }));
  };

  const handleUpdate = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      const updateData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.imageUrl,
        price: {
          day: parseFloat(formData.priceDay),
          week: parseFloat(formData.priceWeek),
          twoWeeks: parseFloat(formData.priceTwoWeeks),
        },
        is_saleable: formData.is_saleable,
        fixedPrice: formData.is_saleable
          ? parseFloat(formData.fixedPrice)
          : null,
        inventory_count: parseInt(formData.inventory_count),
      };

      await api.put(`/api/toys/${toy._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      Alert.alert("Success", "Toy updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ListToy"),
        },
      ]);
    } catch (error) {
      console.error("Error updating toy:", error);
      Alert.alert("Error", "Failed to update toy");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Toy</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, name: text }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={formData.category}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, category: text }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, description: text }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={formData.imageUrl}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, imageUrl: text }))
        }
      />

      <Text style={styles.sectionTitle}>Rental Prices</Text>
      <TextInput
        style={styles.input}
        placeholder="Price per Day"
        value={formData.priceDay}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, priceDay: text }))
        }
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Price per Week"
        value={formData.priceWeek}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, priceWeek: text }))
        }
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Price per Two Weeks"
        value={formData.priceTwoWeeks}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, priceTwoWeeks: text }))
        }
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Inventory Count"
        value={formData.inventory_count}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, inventory_count: text }))
        }
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.toggleButton} onPress={toggleSaleOption}>
        <Text style={styles.toggleButtonText}>
          {formData.is_saleable ? "Disable Sale Option" : "Enable Sale Option"}
        </Text>
      </TouchableOpacity>

      {formData.is_saleable && (
        <TextInput
          style={styles.input}
          placeholder="Fixed Price"
          value={formData.fixedPrice}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, fixedPrice: text }))
          }
          keyboardType="numeric"
        />
      )}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Toy</Text>
      </TouchableOpacity>
    </ScrollView>
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
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  toggleButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  toggleButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  updateButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default UpdateToyScreen;
