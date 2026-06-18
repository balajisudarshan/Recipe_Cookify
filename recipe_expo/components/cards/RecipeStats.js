import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const RecipeStats = ({
  likes = 0,
  comments = 0,
  saves = 0,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Ionicons
          name="heart"
          color="#EF4444"
          size={width * 0.07}
        />
        <Text style={styles.count}>
          {likes}
        </Text>
        <Text style={styles.label}>
          Likes
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.stat}>
        <Ionicons
          name="chatbubble-outline"
          color="#3B82F6"
          size={width * 0.07}
        />
        <Text style={styles.count}>
          {comments}
        </Text>
        <Text style={styles.label}>
          Comments
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.stat}>
        <MaterialCommunityIcons
          name="bookmark"
          color="#FF7A00"
          size={width * 0.07}
        />
        <Text style={styles.count}>
          {saves}
        </Text>
        <Text style={styles.label}>
          Saves
        </Text>
      </View>
    </View>
  );
};

export default RecipeStats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF7F1",
    marginTop: height * 0.02,
    borderRadius: width * 0.05,
    paddingVertical: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  separator: {
    width: 1,
    height: height * 0.06,
    backgroundColor: "#E5E7EB",
  },

  count: {
    fontSize: width * 0.045,
    fontWeight: "700",
    marginTop: 4,
  },

  label: {
    fontSize: width * 0.032,
    color: "#6B7280",
    marginTop: 2,
  },
});