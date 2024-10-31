import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5003',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('supplier');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        role,
      });

      if (response.data) {
        Alert.alert(
          "Thành công",
          "Đăng ký tài khoản thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                // Điều hướng sang trang Login
                navigation.navigate('Login');
              }
            }
          ]
        );
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Lỗi",
          error.response.data.message || 
          "Đăng ký thất bại. Vui lòng thử lại."
        );
      } else if (error.request) {
        Alert.alert(
          "Lỗi kết nối",
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký tài khoản</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
        autoCapitalize="none"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Vai trò (supplier/customer)"
        value={role}
        onChangeText={setRole}
        editable={!loading}
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? "Đang xử lý..." : "Đăng ký"} 
          onPress={handleRegister}
          disabled={loading}
        />
      </View>

      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>
          Bạn đã có tài khoản? <Text style={styles.loginTextBold}>Đăng nhập</Text>
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
  loginLink: {
    alignItems: 'center',
    marginTop: 15,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginTextBold: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;