import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import ScreenHeader from "../components/ScreenHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

const ProfileScreen = () => {
  const { user, setUser, setToken } = useAuth();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      setUser(null);
      setToken(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="Profile" />

      <View
        style={{
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://ui-avatars.com/api/?name=" + user?.username,
          }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
          }}
        />

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginTop: 15,
          }}
        >
          {user?.username}
        </Text>

        <Text
          style={{
            color: "#777",
            marginTop: 5,
          }}
        >
          {user?.email}
        </Text>
      </View>

      <View
        style={{
          marginTop: 40,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#F7F7F7",
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
          }}
        >
          <Text style={{ color: "#888" }}>User ID</Text>
          <Text style={{ fontWeight: "600" }}>{user?.id}</Text>
        </View>

        <View
          style={{
            backgroundColor: "#F7F7F7",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#888" }}>Bio</Text>
          <Text>{user?.bio || "No bio added yet"}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 40,
          marginHorizontal: 20,
          backgroundColor: "#FF4D4F",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;