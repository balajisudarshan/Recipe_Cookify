import { View, Text, Dimensions } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const ProfileStat = ({loadingRecipes,userRecipes}) => {
  return (
    <View style={styles.statContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>
          {loadingRecipes ? "..." : userRecipes?.length}
        </Text>
        <Text style={styles.statLabel}>Recipes</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>2</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>26</Text>
        <Text style={styles.statLabel}>Following</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  statContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: width * 0.88, // Uniform box alignment regardless of display limits
    marginTop: height * 0.03,
    paddingVertical: height * 0.018,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "#111",
  },
  statLabel: {
    fontSize: width * 0.03,
    color: "#777",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: height * 0.035,
    backgroundColor: "#eee",
  },
});

export default ProfileStat;
