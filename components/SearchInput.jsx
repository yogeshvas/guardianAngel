import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { StatusBar } from "expo-status-bar";
import { router, usePathname } from "expo-router";
import Toast from "react-native-toast-message";
const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <View
      className={
        "space-x-4  border-2  border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row "
      }
    >
      <TextInput
        value={query}
        placeholder={"Seach for a video"}
        placeholderTextColor={"#cdcde0"}
        onChangeText={(e) => setQuery(e)}
        className={"text-base mt-0.5 flex-1 text-white font-pregular"}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Toast.show({
              type: "error",
              text1: "Empty Search",
              position: "bottom",
              bottomOffset: 90,
              text2: "Type something to search",
              visibilityTime: 5000, // 5 seconds
            });
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image
          source={icons.search}
          className={"w-5 h-5"}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
