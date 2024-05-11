import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import React from "react";
import { images } from "../constants";
import { useNavigation } from "expo-router";

const Emergency = () => {
  const navigation = useNavigation();
  const handlePress = () => {
    Vibration.vibrate(200);
    navigation.navigate("SearchedUsers");
  };
  return (
    <SafeAreaView className={"h-full w-full bg-primary justify-center"}>
      <View className=" justify-between items-center">
        <Text className="text-white font-psemibold text-xl m-5">
          Use this in emergency only.
        </Text>
        <TouchableOpacity onPress={() => handlePress()}>
          {/* <Image source={{ uri: images.cards }} /> */}
          <Image
            resizeMode="contain"
            className="w-40 h-40"
            source={images.emergency}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Emergency;

const styles = StyleSheet.create({});
