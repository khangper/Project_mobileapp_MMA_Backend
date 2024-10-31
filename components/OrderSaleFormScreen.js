import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5003',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add API interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const OrderSaleFormScreen = ({ route, navigation }) => {
    const { cartItems } = route.params;
    const [formData, setFormData] = useState({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });
  
    const totalPrice = cartItems.reduce((sum, item) => 
        sum + (item.toy.fixedPrice * item.quantity), 0);
  
    const handleSubmit = async () => {
        try {
          // Kiểm tra token
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            Alert.alert('Error', 'Please login to continue');
            navigation.navigate('Login');
            return;
          }
    
          // Validate form data
          if (!formData.street || !formData.city || !formData.state || 
              !formData.postalCode || !formData.country) {
            Alert.alert('Error', 'Please fill in all address fields');
            return;
          }
    
          const orderData = {
            shippingAddress: formData,
            type: 'saleForm',
            transaction_type: 'sale',
            order_type: 'saleForm',
            items: cartItems.map(item => ({
              toy: item.toy._id,
              quantity: item.quantity,
              rent_duration: 'sale' // Thêm trường này để phù hợp với schema
            })),
            totalAmount: totalPrice
          };
    
          const response = await api.post('/api/checkout', orderData);
          
          if (response.status === 201) {
            Alert.alert(
              'Success',
              'Order placed successfully!',
              [
                { text: 'OK', onPress: () => navigation.navigate('Renter') }
              ]
            );
          }
        } catch (error) {
          console.error('Order submission error:', error);
          let errorMessage = 'Failed to place order. Please try again.';
          
          if (error.response) {
            // Handle specific error responses from server
            if (error.response.status === 403) {
              errorMessage = 'Session expired. Please login again.';
              navigation.navigate('Login');
            } else if (error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
          }
          
          Alert.alert('Error', errorMessage);
        }
      };
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Purchase Order Form</Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={formData.street}
            onChangeText={(text) => setFormData({...formData, street: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => setFormData({...formData, city: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.state}
            onChangeText={(text) => setFormData({...formData, state: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={formData.postalCode}
            onChangeText={(text) => setFormData({...formData, postalCode: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Country"
            value={formData.country}
            onChangeText={(text) => setFormData({...formData, country: text})}
          />
  
          {cartItems.map((item) => (
            <View key={item.toy._id} style={styles.saleItemContainer}>
              <Text style={styles.itemName}>{item.toy.name}</Text>
              <View>
                <Text style={styles.salePrice}>
                  ${item.toy.fixedPrice} x {item.quantity}
                </Text>
                <Text style={[styles.salePrice, { fontSize: 14 }]}>
                  Subtotal: ${(item.toy.fixedPrice * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          <Text style={styles.totalPrice}>Total Price: ${totalPrice.toFixed(2)}</Text>
          <Text style={styles.orderType}>Order Type: saleForm</Text>
  
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
  
  // Shared styles for both forms
  const styles = StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // Title and headers
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
    },
  
    // Form container and inputs
    form: {
      width: '100%',
      paddingBottom: 80, // Space for bottom buttons
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#f5f5f5',
      padding: 12,
      marginBottom: 15,
      borderRadius: 8,
      fontSize: 16,
      color: '#333',
    },
  
    // Item container styles (for rent form)
    itemContainer: {
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    
    // Picker styles (for rent form)
    picker: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginTop: 5,
    },
  
    // Price and order type display
    totalPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginVertical: 15,
      textAlign: 'right',
      paddingRight: 10,
    },
    orderType: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
      textAlign: 'right',
      paddingRight: 10,
      fontStyle: 'italic',
    },
  
    // Button styles
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    submitButton: {
      backgroundColor: '#4CAF50', // Green color matching rent button
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 10,
      elevation: 2, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  
    // Validation error messages
    errorText: {
      color: '#ff4444',
      fontSize: 14,
      marginTop: -10,
      marginBottom: 10,
      marginLeft: 5,
    },
  
    // Additional styles for sale form specific elements
    saleItemContainer: {
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    salePrice: {
      fontSize: 16,
      color: '#2196F3', // Blue color matching sale button
      fontWeight: 'bold',
    },
  });
  export default OrderSaleFormScreen;