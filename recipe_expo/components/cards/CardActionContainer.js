import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CardActionContainer = () => {
  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons
          name="heart-outline"
          size={width * 0.065}
          color="#ff7a00"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons
          name="bookmark-outline"
          size={width * 0.065}
          color="#ff3300"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: "absolute",
    top: -width * 0.06,
    right: width * 0.05,
    flexDirection: "row",
    zIndex: 100,
  },

  actionButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,

    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",

    marginLeft: width * 0.03,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 8,
  },
});

export default CardActionContainer;