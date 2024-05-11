import { Link, Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  if (!isLoading && isLoggedIn) return <Redirect href={"/home"} />;
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {/* <View
          className="w-full  
        justify-center
        items-center min-h-[90vh] px-4"
        >

          <Image
            source={images.cards}
            className="
            my-10
            max-w--[380px] w-full h-[250px] rounded-lg"
            resizeMode="cover"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Guardian Angel. <Text className="text-secondary-200"></Text>
            </Text>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Discalimer: Guardian Angel is being monitered at your nearby police
            station.
          </Text>
          <CustomButton
            title={"Continue with Email"}
            handlePress={() => router.push("/sign-up")}
            containerStyles="w-full mt-7"
          />
        </View> */}
        <View className="">
          <View className="h-1/2 bg-secondary-200  rounded-br-xl rounded-bl-xl justify-end items-center ">
            <Image className="h-80 w-80" source={images.lady} />
          </View>

          <View className="h-1/2  items-center ">
            <View className="p-4 items-center mt-5">
              <Text className="text-white font-pregular text-2xl">
                Enpower <Text className="text-secondary-100">safety</Text>,
                unite strength
              </Text>
              <Text className="text-white font-pregular text-2xl">
                together, one tap at a time
              </Text>
            </View>
            <View className="items-center p-4 w-full">
              <Text className="text-sm font-psemibold text-gray-100  text-center">
                Discalimer : Guardian Angel is being monitered at your nearby
                police station.
              </Text>
              <CustomButton
                title={"LET'S GET STARTED"}
                textStyles="font-pregular"
                handlePress={() => router.push("/sign-up")}
                containerStyles="w-full m-8"
              />
              <View className="justify-center pt-1 flex-row gap-2">
                <Text className="text-lg text-gray-100 font-pregular">
                  Have an account already?
                </Text>
                <Link
                  href={"/sign-in"}
                  className="text-lg font-semibold text-secondary-100"
                >
                  Sign In
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
