import { View, Text,Image } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
const UserCard = ({ item }) => {
  return (
    <View style={styles.userCard}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              item.avatar ||
              `https://ui-avatars.com/api/?name=${item.username}`,
          }}
          style={styles.avatarImage}
        />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.usernameText}>@{item.username}</Text>
        <Text style={styles.bioText} numberOfLines={1}>
          {item.bio || "No bio added yet"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 9,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it a perfect circle
    backgroundColor: "#eee",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  bioText: {
    fontWeight: "300",
    color: "#8b8b8b",
  },
  avatarImage: {
    width: 70,
    height: 70,
  },
})

export default UserCard;
