import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { StyleSheet } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { getMyRecipes } from "../api/apiRoute";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation()
  const { user, loading } = useAuth();
  // const getMyRecipes =  getMyRecipes()
  // const userId = route
  const getMyRecipes = async()=>{
    try {
      const response = await getMyRecipes()
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    console.log(user);
    getMyRecipes()
  },[]);
  // const handleLogOut = ()=>{
  //   AsyncStorage.removeItem("user");
  //   AsyncStorage.removeItem("token")
  //   navigation.navigate("LoginScreen")
  // }

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FF7A00" style={styles.loader} />
    );
  }

  if (!user) {
    return <Text style={styles.errorText}>Please log in</Text>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="My Kitchen Profile" />

      <View style={styles.profileHero}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.username}`,
            }}
            style={styles.avatarImage} // 👈 Added the mandatory image styling here
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.usernameText}>@{user.username}</Text>

          <Text>{user.bio}</Text>
        </View>
        <View style={styles.statContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
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
          <View style={styles.divider} />
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Feather
              name="edit-3"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnText}>Edit Kitchen Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Feather
              name="share-2"
              size={18}
              color="#FF7A00"
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>LogOut</Text>
          </TouchableOpacity>
        </View>

        <View>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbfe", // 👈 Added the missing '#' here
  },
  details: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  profileHero: {
    alignItems: "center",
    marginTop: 30,
  },
  avatarContainer: {
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  avatarImage: {
    width: 120, // 👈 Explicit width (Mandatory)
    height: 120, // 👈 Explicit height (Mandatory)
    borderRadius: 60, // Perfect circle (half of width/height)
    borderWidth: 3,
    borderColor: "#FF7A00", // Matches Cookify orange
    backgroundColor: "#eee", // Background color while image loads
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginTop: 15,
  },
  statContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 25,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    alignItems: "center",
  },
  statBox: { flex: 1, alignItems: "center" },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#eee",
  },
  editButton: {
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    paddingVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 30,
    flex:1
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  shareBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    backgroundColor: "#FFF0E0",
    borderWidth: 1,
    borderColor: "#FF7A00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 20,
    gap: 12,
    alignItems:"center"
  },
});

export default ProfileScreen;
