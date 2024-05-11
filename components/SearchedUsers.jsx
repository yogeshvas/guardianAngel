import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import useAppwrite from "../context/useAppwrite";
import { getNearbyUsers, policeVerification } from "../lib/appwrite";
import { CustomModal } from "./Modal";
import * as SMS from "expo-sms";
import { Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import axios from "axios"; // Import Axios library
import { useGlobalContext } from "../context/GlobalProvider";

const SearchedUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: nearByUsers } = useAppwrite(getNearbyUsers);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();
  const { user } = useGlobalContext();

  const helpClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setMessage(
        `A user near you is unsafe, he/she is near you at: https://www.google.com/maps/search/?api=1&query=${location?.coords.latitude},${location?.coords.longitude}`
      );
    };
    getPermissions();
  }, [location]);

  const handleSendMessage = async () => {
    if (selectedUser && message.trim() !== "") {
      try {
        let phoneNumber = selectedUser.mobile;

        // Check if the phone number starts with '+91', if not, prepend it
        if (!phoneNumber.startsWith("+91")) {
          phoneNumber = "+91" + phoneNumber;
        }
        console.log(phoneNumber);
        const response = await axios.post(
          "https://guardianangel-backend.onrender.com/sms",
          {
            to: phoneNumber,
            body: message,
          }
        );
        console.log("SMS sent successfully:", response.data);

        // Call policeVerification function with necessary parameters
        const resultPolice = await policeVerification({
          seeker_name: user.username,
          seeker_phone: user.mobile,
          helper_name: selectedUser.username,
          helper_phone: selectedUser.mobile,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setIsModalOpen(!isModalOpen);
        setMessage("Message is being sent");
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-primary">
      <View style={styles.item}>
        <Text style={styles.text} className="font-psemibold">
          Username: {item.username}
        </Text>
        <Text style={styles.text} className="font-psemibold">
          Rating: {item.rating}
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => helpClick(item)}>
          <Text style={styles.buttonText} className="font-psemibold">
            Ask to Help
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handlePress = () => {
    navigation.navigate("Emergency");
  };

  return (
    <View style={styles.container} className="bg-primary">
      <CustomModal isOpen={isModalOpen}>
        <>
          <View className="w-full items-end">
            <TouchableOpacity onPress={() => setIsModalOpen(false)}>
              <Entypo name="circle-with-cross" size={24} color="#7070AD" />
            </TouchableOpacity>
          </View>
          <View className="mt-6">
            <Text className="font-pregular">Message Draft</Text>
            <View className="bg-gray-100 p-5 rounded-xl">
              <Text className="font-psemibold">{message}</Text>
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      </CustomModal>
      <View style={styles.header} className="bg-primary">
        <TouchableOpacity onPress={handlePress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Nearby Angels</Text>
      </View>
      <FlatList
        data={nearByUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
      />
    </View>
  );
};

export default SearchedUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#A4A4FF",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  text: {
    color: "black",
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "black",
    // fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    color: "#2196F3",
    alignSelf: "flex-end",
  },
});
