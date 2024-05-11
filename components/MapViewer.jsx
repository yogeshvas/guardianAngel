import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import useAppwrite from "../context/useAppwrite";
import { getNearbyUsers } from "../lib/appwrite";

const MapViewer = () => {
  const [location, setLocation] = useState(null);
  const { data: nearByUsers } = useAppwrite(getNearbyUsers);

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
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton
        >
          {nearByUsers.map((user, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: user.latitude,
                longitude: user.longitude,
              }}
              title={`star rating: ${user.rating}`}
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "gray",
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
});

export default MapViewer;
