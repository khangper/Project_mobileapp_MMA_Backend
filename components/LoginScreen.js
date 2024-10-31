import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      console.log('Response data:',response.data.user.role);

      
      if (response.data) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userRole', response.data.user.role);
       
        if (response.data.user.role === 'supplier') {
          try {
            navigation.navigate('AddToy');
          } catch (navError) {
            console.log('Navigation error:', navError);
            Alert.alert('Lỗi', 'Không thể chuyển trang. ' + navError.message);
          }
        } else if (response.data.user.role === 'renter') {
          try {
            navigation.navigate('Renter');
          } catch (navError) {
            console.log('Navigation error:', navError);
            Alert.alert('Lỗi', 'Không thể chuyển trang. ' + navError.message);
          }
      } else if (response.data.user.role === 'staff') {
        try {
          navigation.navigate('Staff');
        } catch (navError) {
          console.log('Navigation error:', navError);
          Alert.alert('Lỗi', 'Không thể chuyển trang. ' + navError.message);
        }
    }
       else {
          Alert.alert('Thông báo', `Role không hợp lệ: ${response.data.role}`);
        }
      }
    } 
    catch (error) {
      if (error.response) {
        Alert.alert(
          "Lỗi",
          error.response.data.message || 
          "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu."
        );
      } else if (error.request) {
        Alert.alert(
          "Lỗi kết nối",
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
     finally {
      setLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Đang xử lý..." : "Đăng nhập"} 
          onPress={handleLogin}
          disabled={loading}
        />
      </View>

      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          Chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 15,
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerTextBold: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;