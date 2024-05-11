import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { GlobalProvider, useGlobalContext } from "../context/GlobalProvider";
import { deletePost, getAllPost } from "../lib/appwrite";
import Toast from "react-native-toast-message";
import useAppwrite from "../context/useAppwrite";

const VideoCard = ({ video: { $id, title, thumbnail, video, creator } }) => {
  const { user } = useGlobalContext();

  const [play, setPlay] = useState(false);
  const deleteVideo = async (videoId) => {
    try {
      await deletePost(videoId);
      //make a custom toast
      Toast.show({
        type: "success",
        text1: "Video Deleted Successfully",
        position: "bottom",

        bottomOffset: 100,
        text2: "Swipe down to refresh",
        visibilityTime: 5000, // 5 seconds
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        position: "bottom",
        bottomOffset: 90,
        text2: "Error while deleting the video",
        visibilityTime: 5000, // 5 seconds
      });
    }
  };
  return (
    <View className={"flex-col items-center px-4 mb-14"}>
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary-100 justify-center items-center p-0.5">
            <Image
              source={{ uri: creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm font-semibold text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className={"text-xs text-gray-100 font-pregular"}
              numberOfLines={1}
            >
              {creator.username}
            </Text>
          </View>
        </View>
        <View className={"pt-2"}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => deleteVideo($id)}
          >
            {/* <Image
              source={icons.del}
              className="w-10 h-10"
              resizeMode="contain"
            /> */}
            {user && user.$id === creator.$id ? ( // Check if user is defined
              <Image
                source={icons.del}
                className="w-8 h-8"
                resizeMode="contain"
              />
            ) : (
              <Text></Text>
            )}
          </TouchableOpacity>
          {/* <Text className=" text-white font-psemibold justify-center items-center">
            delete
          </Text> */}
        </View>
      </View>
      {play ? (
        <Video
          className={"w-full h-60 rounded-xl mt-3"}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
          source={{ uri: video }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className={"w-full h-full rounded-xl mt-3"}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
