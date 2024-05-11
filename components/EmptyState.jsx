import { Image, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { images } from "../constants";
import CustomButton from "./CustomButton";

export default function EmptyState({ title, subtitle }) {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px ] h-[215px]"
        resizeMode="contain"
      />
      <Text className={"font-pmedium text-sm text-gray-100"}>{subtitle}</Text>
      <Text className="text-xl font-psemibold text-white mt-2">{title}</Text>
      {/* <CustomButton
        title="Create Video"
        containerStyles={"w-full my-5"}
        handlePress={() => router.push("/create ")}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({});
