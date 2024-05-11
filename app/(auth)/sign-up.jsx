import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import { createNewUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormFeild";
import { images } from "../../constants";

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    lat: 0,
    long: 0,
    address: "",
    aadhar: "",
  });

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getPermissions();
  }, []);

  const setAddress = async () => {
    if (location) {
      try {
        const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        });

        setForm({
          ...form,
          lat: location.coords.latitude,
          long: location.coords.longitude,
          address: reverseGeocodedAddress[0].formattedAddress,
        });
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Location not available.",
        position: "bottom",
        bottomOffset: 90,
        visibilityTime: 5000,
      });
    }
  };

  const submit = async () => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.aadhar ||
      !form.address ||
      !form.lat ||
      !form.long ||
      !form.mobile
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all the details.",
        position: "bottom",
        bottomOffset: 90,
        visibilityTime: 5000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createNewUser(
        form.email,
        form.password,
        form.username,
        form.aadhar,
        form.address,
        form.lat,
        form.long,
        form.mobile
      );
      console.log(form);
      setUser(result);
      setIsLoggedIn(true);
      Toast.show({
        type: "success",
        text1: "User signed in successfully",
        position: "bottom",
        bottomOffset: 90,
        visibilityTime: 5000,
      });
      router.replace("/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        position: "bottom",
        bottomOffset: 90,
        text2: error.message,
        visibilityTime: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className={"bg-primary h-full"}>
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView>
        <View className={"w-full justify-center min-h-[82vh] px-4 my-6 "}>
          <Text
            className={"text-2xl text-white text-semibold mt-5 font-psemibold"}
          >
            Create an account.
          </Text>
          <FormField
            title="Name"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-2"
          />
          <FormField
            title="Aadhar No."
            value={form.aadhar.toString()}
            handleChangeText={(e) => setForm({ ...form, aadhar: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Mobile No."
            value={form.mobile.toString()}
            handleChangeText={(e) => setForm({ ...form, mobile: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <View className={"flex-row items-center justify-between"}>
            <View>
              <FormField
                title="Address"
                value={form.address}
                handleChangeText={(e) => setForm({ ...form, address: e })}
                otherStyles="mt-7 w-[250px]"
              />
            </View>
            <TouchableOpacity
              onPress={() => setAddress()}
              className={
                "w-[100px] bg-secondary-200  items-center justify-between mt-16 py-2 rounded-xl"
              }
            >
              <Text className={"text-white font-psemibold"}>Auto Detect</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            title={"create account."}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
