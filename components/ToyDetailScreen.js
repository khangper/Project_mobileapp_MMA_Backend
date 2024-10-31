import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: 'http://10.0.2.2:5003',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('API Error:', error.response?.data || error.message);
      throw error;
    }
  );

const ToyDetailScreen = ({ route }) => {
  const { toyId } = route.params;
  const [toy, setToy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  const fetchToyDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/toys/${toyId}`);
      setToy(response.data);
      fetchFeedback();
    } catch (error) {
      console.log("Error fetching toy details:", error.message);
      Alert.alert(
        "Error",
        "Failed to fetch toy details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await api.get(`/api/toys/${toyId}/feedback`);
      setFeedback(response.data);
    } catch (error) {
      console.log("Error fetching feedback:", error.message);
    }
  };

  const handleSubmitFeedback = async () => {
    if (userRating === 0 || userComment === "") {
      Alert.alert("Please provide both rating and comment");
      return;
    }
  
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      
      // Add debug logging
      console.log("Token from AsyncStorage:", token);
      
      // Check if token exists
      if (!token) {
        Alert.alert("Error", "Please login to submit feedback");
        return;
      }
  
      const response = await api.post(
        `/api/toys/${toyId}/feedback`,
        { rating: userRating, comment: userComment },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      setFeedback(response.data.feedback);
      setUserRating(0);
      setUserComment("");
      fetchToyDetails();
      
      Alert.alert("Success", "Feedback submitted successfully");
    } catch (error) {
      console.log("Error submitting feedback:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert(
          "Authentication Error", 
          "Please login again to submit feedback"
        );
        // Optional: Navigate to login screen or handle re-authentication
        return;
      }
      
      Alert.alert(
        "Error",
        "Failed to submit feedback. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchToyDetails();
  }, [toyId]);

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackUser}>
        {item.user?.username || "Anonymous"}
      </Text>
      <View style={styles.feedbackRating}>
        {[...Array(5)].map((_, i) => (
          <FontAwesome
            key={i}
            name="star"
            size={18}
            color={i < item.rating ? "#ffd700" : "#ddd"}
          />
        ))}
      </View>
      <Text style={styles.feedbackComment}>{item.comment}</Text>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#333" style={styles.loading} />
    );
  }

  return (
    <View style={styles.container}
    showsHorizontalScrollIndicator={false}
    >
      <Image source={{ uri: toy.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{toy.name}</Text>
      <Text style={styles.category}>Category: {toy.category}</Text>
      <Text style={styles.description}>{toy.description}</Text>
      <Text style={styles.price}>Price/Day: ${toy.price.day}</Text>
      <Text style={styles.price}>Price/Week: ${toy.price.week}</Text>
      <Text style={styles.price}>Price/Two Weeks: ${toy.price.twoWeeks}</Text>
      {toy.fixedPrice && (
  <Text style={styles.price}>Fixed Price: ${toy.fixedPrice}</Text>
)}
      <Text style={styles.averageRating}>
        Average Rating: {toy.averageRating.toFixed(1)}{" "}
        <FontAwesome name="star" size={18} color="#ffd700" />
      </Text>

      <Text style={styles.sectionTitle}>User Feedback</Text>
      {feedback.length > 0 ? (
        <FlatList
        // scrollEnabled={false}
          data={feedback}
          renderItem={renderFeedbackItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.feedbackList}
        />
      ) : (
        <Text style={styles.noFeedback}>No feedback yet.</Text>
      )}

      <Text style={styles.sectionTitle}>Leave a Feedback</Text>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <TouchableOpacity key={i} onPress={() => setUserRating(i + 1)}>
            <FontAwesome
              name="star"
              size={30}
              color={i < userRating ? "#ffd700" : "#ddd"}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write your feedback..."
        value={userComment}
        onChangeText={setUserComment}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitFeedback}
      >
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    // alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  averageRating: {
    fontSize: 16,
    color: "#009688",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },
  feedbackList: {
    paddingBottom: 20,
    width: "100%",
  },
  feedbackItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  feedbackUser: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  feedbackRating: {
    flexDirection: "row",
    marginBottom: 5,
  },
  feedbackComment: {
    fontSize: 14,
    color: "#333",
  },
  noFeedback: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#009688",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ToyDetailScreen;