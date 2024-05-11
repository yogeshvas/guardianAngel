import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormFeild from "../../components/FormFeild";
import { ResizeMode, Video } from "expo-av";
import { icons, images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideo, getNearbyUsers } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewer from "../../components/MapViewer";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import useAppwrite from "../../context/useAppwrite";
import * as Location from "expo-location";

const Create = () => {
  const { user } = useGlobalContext();
  const API_KEY = "AIzaSyACmmdBMCbRrd3gHnXRGYaHW40GVdRlfZ4";
  const capitalizedUsername = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "";
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { data: nearByUsers } = useAppwrite(getNearbyUsers);
  const [searchedLocation, setSearchedLocation] = useState(null);

  const mapRef = useRef(null);
  // const MapRef = useRef<MapView>()
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
  const onLocationSelect = (data, details = null) => {
    if (details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
      const selectedLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      setSearchedLocation(selectedLocation);
      if (mapRef.current) {
        mapRef.current.animateToRegion(selectedLocation, 1000);
      }
    }
  };
  if (!location) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 10,
        }}
      >
        <Text className="text-white font-psemibold">
          FETCHING YOUR LOCATION...
        </Text>
      </View>
    );
  }

  const INITIAL_REGION = {
    longitude: location.coords.longitude,
    latitude: location.coords.latitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <SafeAreaView className="my-10 bg-primary h-full">
      <View
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 1,
          paddingHorizontal: 10,
          paddingBottom: 16,
        }}
      >
        <Text className="text-2xl font-pregular text-white">
          Well Done{" "}
          <Text className="text-secondary-100">{capitalizedUsername}!</Text>{" "}
        </Text>
        <Text className={"font-pmedium text-base text-gray-100"}>
          Precaution over Prevention
        </Text>
      </View>
      <View className="m-2 p-2 space-y-1">
        <Text className="text-white text-base font-pregular mt-2">Search</Text>
        <GooglePlacesAutocomplete
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          placeholder="where from"
          onPress={(data, details = null) => onLocationSelect(data, details)}
          fetchDetails={true}
          minLength={2}
          query={{
            key: API_KEY,
            language: "en",
          }}
          className="font-psemibold"
          enablePoweredByContainer={false}
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
              backgroundColor: "#A4A4FF",
              color: "white",
            },
          }}
          textInputProps={{
            fontFamily: "Arial",
            placeholderTextColor: "white", // Change placeholder color here
          }}
        />
        <View style={styles.mapContainer} className="">
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={INITIAL_REGION}
            showsUserLocation
            showsMyLocationButton
            ref={mapRef}
          >
            {nearByUsers.map((user, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: user.latitude,
                  longitude: user.longitude,
                }}
                title={`star rating: ${user.rating}`}
              >
                <Image
                  source={icons.angel} // Path to your custom marker icon
                  style={{ width: 40, height: 40 }} // Adjust the size of the marker icon as needed
                />
              </Marker>
            ))}
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Create;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    borderWidth: 4,
    borderRadius: 10,
    borderColor: "gray",
    overflow: "hidden",
    width: "100%",
    height: "78%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
