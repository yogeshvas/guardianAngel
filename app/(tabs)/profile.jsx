import {
  View,
  Text,
  FlatList,
  Touchable,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons, images } from "../../constants";
import InfoBox from "../../components/InfoBox";
import Toast from "react-native-toast-message";
import { signOut } from "../../lib/appwrite";
import selfDefence from "./selfdefense 1.png";
const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const EduData = [
    {
      id: 1,
      logoUri: selfDefence,
      title: "Self Defence",
      desc: "4 Documents",
    },
    {
      id: 2,
      logoUri: selfDefence,
      title: "Essentials",
      desc: "Equipments every women should carry",
    },
    {
      id: 3,
      logoUri: selfDefence,
      title: "Virtual Learing",
      desc: "Virtual Learining for better understanding",
    },
  ];
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(null);
    Toast.show({
      type: "success",
      text1: "Logged out successfully.",
      position: "bottom",
      visibilityTime: 5000,
    });
    router.replace("/sign-in");
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row justify-between p-3 mt-4">
        <Text className="text-secondary-100 text-2xl font-psemibold">
          Enpower Shield
        </Text>
        <TouchableOpacity onPress={() => logout()}>
          <Image
            className="w-[30px] h-[30px]"
            resizeMode="contain"
            source={icons.logout}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={EduData} // Add your data array here
        renderItem={({ item }) => (
          <View
            style={{
              height: 200,
              backgroundColor: "#1D1D1D",
              marginVertical: 8,
              marginHorizontal: 16,
              borderRadius: 10,
              // padding: 15,
              justifyContent: "between",
            }}
          >
            <View className="flex-row justify-between items-end ">
              <Text className="text-black ">Item</Text>
              <View>
                <Image
                  style={{ height: 150, width: 150 }}
                  source={item.logoUri}
                />
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Profile;
