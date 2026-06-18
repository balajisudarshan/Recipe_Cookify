import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
          size={24}
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
            size={22}
            color="#FF7A00"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={onMore}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={22}
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
    top: 40,
    left: 16,
    right: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    zIndex: 100,
  },

  rightActions: {
    flexDirection: "row",
    gap: 12,
  },

  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 24,

    backgroundColor: "rgba(255, 255, 255, 0.88)",

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