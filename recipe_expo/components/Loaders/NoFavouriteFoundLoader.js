import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../const/COLORS";

const NoFavouriteFoundLoader = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animations/NoFavourites.json")}
        autoPlay
        loop
        resizeMode="contain"
        style={{
          width: width * 0.9,
          height: height * 0.45,
        }}
      />

      <Text style={styles.title}>
        No Favourite Found
      </Text>

      <Text style={styles.subtitle}>
        Click on <Ionicons style={{padding:10}} size={20} name="heart" color={COLORS.primary}/> To make it favourite
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF9",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
});

export default NoFavouriteFoundLoader;