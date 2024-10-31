import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

  const api = axios.create({
    baseURL: 'http://10.0.2.2:5003',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

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

const ShoppingCartScreen = () => {
    const navigation = useNavigation(); 
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert(
          "Authentication Required",
          "Please login to view your cart",
          [
            { text: "OK", onPress: () => navigation.navigate("Login") }
          ]
        );
        setLoading(false);
        return;
      }

      const response = await api.get('/api/shopping-cart');
      if (response.data.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.log('Error fetching cart:', error);
      if (error.response?.status === 403) {
        Alert.alert(
          "Authentication Error",
          "Please login again to continue",
          [
            { text: "OK", onPress: () => navigation.navigate("Login") }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to fetch shopping cart. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCart();
    });

    return unsubscribe;
  }, [navigation]);

  const removeFromCart = async (itemId) => {
    try {
      // Kiểm tra token
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert(
          "Yêu cầu đăng nhập",
          "Vui lòng đăng nhập để thực hiện chức năng này",
          [
            { text: "OK", onPress: () => navigation.navigate("Login") }
          ]
        );
        return;
      }
  
      // Log thông tin request để debug
      console.log('Attempting to remove item:', itemId);
      console.log('Token:', token);
  
      Alert.alert(
        "Xác nhận",
        "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
        [
          {
            text: "Hủy",
            style: "cancel"
          },
          {
            text: "Xóa",
            onPress: async () => {
              try {
                // Thêm timeout dài hơn cho request
                const response = await api({
                  method: 'DELETE',
                  url: `/api/shopping-cart/${itemId}`,
                  timeout: 15000, // Tăng timeout lên 15 giây
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
  
                // Log response để debug
                console.log('Server response:', response.data);
  
                if (response.status === 200) {
                  Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi giỏ hàng');
                  await fetchCart(); // Thêm await để đảm bảo cập nhật xong
                } else {
                  throw new Error('Unexpected response status: ' + response.status);
                }
              } catch (error) {
                // Log chi tiết lỗi
                console.log('Error details:', {
                  status: error.response?.status,
                  data: error.response?.data,
                  message: error.message,
                  config: error.config
                });
  
                if (error.response?.data?.message) {
                  // Xử lý message lỗi từ server
                  Alert.alert('Thông báo', error.response.data.message);
                } else if (error.response?.status === 403) {
                  Alert.alert(
                    "Lỗi xác thực",
                    "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
                    [
                      { text: "OK", onPress: () => navigation.navigate("Login") }
                    ]
                  );
                } else if (error.response?.status === 404) {
                  Alert.alert('Thông báo', 'Không tìm thấy sản phẩm trong giỏ hàng', [
                    { text: "OK", onPress: () => fetchCart() }
                  ]);
                } else if (error.response?.status === 500) {
                  Alert.alert(
                    'Lỗi Server', 
                    'Hệ thống đang gặp sự cố, vui lòng thử lại sau.\nChi tiết: ' + 
                    (error.response?.data?.message || 'Unknown error')
                  );
                } else if (error.code === 'ECONNABORTED') {
                  Alert.alert('Lỗi kết nối', 'Yêu cầu đã hết thời gian chờ, vui lòng thử lại');
                } else {
                  Alert.alert(
                    'Lỗi',
                    'Không thể xóa sản phẩm, vui lòng thử lại.\nChi tiết: ' + 
                    (error.message || 'Unknown error')
                  );
                }
              }
            }
          }
        ]
      );
  
    } catch (error) {
      console.log('Unhandled error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  const handleRentFormNavigation = () => {
    navigation.navigate('OrderRentForm', { cartItems });
  };

  const handleSaleFormNavigation = useCallback(() => {
    // Check if any item is not saleable
    const hasNonSaleableItem = cartItems.some(item => !item.toy.is_saleable);
    
    if (hasNonSaleableItem) {
      Alert.alert(
        "Cannot Proceed",
        "Your cart contains items that can only be rented, not purchased. Please remove these items to proceed with purchase.",
        [
          { text: "OK" }
        ]
      );
      return;
    }
    
    navigation.navigate('OrderSaleForm', { cartItems });
  }, [cartItems, navigation]);
  
  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.toy.imageUrl }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.toy.name}</Text>
        <Text style={styles.itemPrice}>
          Price/Day: ${item.toy.price.day}
        </Text>
        <Text style={styles.itemDetails}>
          Quantity: {item.quantity}
        </Text>
        <Text style={styles.itemDetails}>
          Duration: {item.rent_duration}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item._id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.orderButton, styles.rentButton]}
              onPress={handleRentFormNavigation}
            >
              <Text style={styles.orderButtonText}>Rent Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.orderButton, styles.saleButton]}
              onPress={handleSaleFormNavigation}
            >
              <Text style={styles.orderButtonText}>Purchase Items</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  emptyCart: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
  },
  orderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  rentButton: {
    backgroundColor: '#4CAF50',
  },
  saleButton: {
    backgroundColor: '#2196F3',
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShoppingCartScreen;