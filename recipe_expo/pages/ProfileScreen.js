import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ScreenHeader from "../components/ScreenHeader";
import { Feather } from "@expo/vector-icons";
import { getMyRecipes } from "../api/apiRoute";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProfileStat from "../components/profile/ProfileStat";
import ProfileActionButtons from "../components/profile/ProfileActionButtons";
import RecipeCard from "../components/cards/RecipeCard";
// 1. Establish Responsive Scale Anchors based on Device Dimensions
const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, loading, handleLogout } = useAuth();

  const [userRecipes, setUserRecipes] = useState([]);
  const [userRecipeCount, setUserRecipeCount] = useState(0);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const fetchUserRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const response = await getMyRecipes();
      if (response && response.data && response.data.recipes) {
        setUserRecipes(response.data.recipes);
        setUserRecipeCount(response.data.count);
      }
      console.log(response.data.recipes);
    } catch (error) {
      console.log("Error loading recipes:", error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRecipes();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Please log in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="My Kitchen Profile" />

      <View style={styles.profileHero}>
        {/* Dynamic Avatar Container Scaled proportionally */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.username}`,
            }}
            style={styles.avatarImage}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.usernameText}>@{user.username}</Text>
          <Text style={styles.bioText}>{user.bio || "No bio added yet"}</Text>
        </View>

        {/* Responsive Performance Metric Row Matrix */}
        <ProfileStat loadingRecipes={loadingRecipes} userRecipes={userRecipes}/>

        {/* Flexible Control Actions Grid Interface */}
        <ProfileActionButtons/>

        {loadingRecipes ? (
          <View style={{ marginTop: height * 0.02 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={styles.yourRecipeContainer}>
              <Text style={styles.headingTxt}>
                Your Recipes - {userRecipeCount}
              </Text>
            </View>

            <View style={styles.profileRecipeContainer}>
              {userRecipes.slice(0, 5).map((recipe) => (
               
                <RecipeCard recipe={recipe} key={recipe.id}/>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.editButton, styles.fullWidthButton]}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.btnText} numberOfLines={1}>
                View All
              </Text>
              <Feather
                name="arrow-right"
                size={width * 0.04}
                color="#fff"
                style={{ marginRight: 6 }}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbfe",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffbfe",
    paddingTop: height * 0.2,
  },
  details: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.06,
    marginTop: height * 0.02,
    gap: 4,
  },
  errorText: {
    textAlign: "center",
    fontSize: width * 0.04,
    color: "#666",
  },
  profileHero: {
    alignItems: "center",
    marginTop: height * 0.03,
  },
  avatarContainer: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  avatarImage: {
    // Scales dynamically to occupy exactly 30% of standard phone widths
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 3,
    borderColor: "#FF7A00",
    backgroundColor: "#eee",
  },
  usernameText: {
    fontSize: width * 0.055, // Fluid Typography Scaling
    fontWeight: "700",
    color: "#111",
  },
  bioText: {
    fontSize: width * 0.036,
    color: "#555",
    textAlign: "center",
    lineHeight: width * 0.05,
  },
  
  
  yourRecipeContainer: {
    marginTop: height * 0.02,
    width: width * 0.88,
    alignSelf: "center",
  },
  headingTxt: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6b6b6b",
    textAlign: "left",
  },

  
  profileRecipeContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: width * 0.036,
  },
  
});

export default ProfileScreen;
