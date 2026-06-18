import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const RecipeTopActions = ({
  onBack,
  onShare,
  onMore,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.circleBtn}
        onPress={onBack}
      >
        <Ionicons
          name="arrow-back"
          size={width * 0.06}
          color="#FF7A00"
        />
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onShare}
        >
          <Ionicons
            name="share-social-outline"
            size={width * 0.055}
            color="#FF7A00"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onMore}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={width * 0.055}
            color="#FF7A00"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecipeTopActions;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.04,
    right: width * 0.04,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    zIndex: 100,
  },

  rightActions: {
    flexDirection: "row",
    gap: width * 0.03,
  },

  circleBtn: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,

    backgroundColor: "rgba(255,255,255,0.9)",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 5,
  },
});