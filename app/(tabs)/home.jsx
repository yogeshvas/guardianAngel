import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { StatusBar } from "expo-status-bar";
import MapViewer from "../../components/MapViewer";
import Emergency from "../../components/Emergency";
import SearchedUsers from "../../components/SearchedUsers";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getNearbyUsers } from "../../lib/appwrite";
import useAppwrite from "../../context/useAppwrite";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const Stack = createNativeStackNavigator();
  const capitalizedUsername = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "";

  const handleFakeCall = () => {
    axios
      .post("https://guardianangel-backend.onrender.com/call", {
        to: "+918595257175",
      })
      .then((response) => {
        // Handle success response if needed
        console.log("Fake call initiated successfully");
      })
      .catch((error) => {
        // Handle error
        console.error("Error initiating fake call:", error);
        Alert.alert(
          "Error",
          "Failed to initiate fake call. Please try again later."
        );
      });
  };

  return (
    <SafeAreaView className="my-10 bg-primary h-full  space-y-6 pb-28">
      <View
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 1,
          paddingHorizontal: 10,
          paddingBottom: 16,
        }}
        className="flex-row items-center justify-between"
      >
        <View>
          <Text className="text-2xl font-pregular text-white">
            Welcome{" "}
            <Text className="text-secondary-100">{capitalizedUsername}!</Text>{" "}
          </Text>
          <Text className={"font-pmedium text-base text-gray-100"}>
            Hope your day is fine.
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleFakeCall} // Call the function to initiate fake call
          className={
            "bg-secondary-100 items-center py-1 px-4 pb-2 flex-row rounded-lg gap-2 "
          }
        >
          <Text className="text-black font-psemibold">Fake</Text>
          <Ionicons name="call" size={19} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <View className={"w-full h-1/2"}>
          <MapViewer />
        </View>
        <View className={"w-full h-1/2 "}>
          <Stack.Navigator>
            <Stack.Screen
              name="Emergency"
              component={Emergency}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SearchedUsers"
              component={SearchedUsers}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </View>
      </View>
      <StatusBar backgroundColor="#151515" style="dark" />
    </SafeAreaView>
  );
};

export default Home;
