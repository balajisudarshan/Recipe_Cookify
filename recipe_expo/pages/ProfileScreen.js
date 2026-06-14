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
                <View key={recipe.id} style={styles.profileRecipeCard}>
                  <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipeImage}
                  />
                  <View style={styles.dietaryBadge}>
                    <MaterialCommunityIcons
                      name={
                        recipe.dietaryType === "VEGAN"
                          ? "sprout"
                          : recipe.dietaryType === "VEGETARIAN"
                            ? "leaf"
                            : recipe.dietaryType === "EGGETARIAN"
                              ? "egg"
                              : "food-drumstick"
                      }
                      size={width * 0.045}
                      color={
                        recipe.dietaryType === "VEGAN"
                          ? "#16A34A"
                          : recipe.dietaryType === "VEGETARIAN"
                            ? "#22C55E"
                            : recipe.dietaryType === "EGGETARIAN"
                              ? "#F59E0B"
                              : "#EF4444"
                      }
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={styles.recipeContent}>
                      <Text style={styles.recipeTitle} numberOfLines={1}>
                        {recipe.title}
                      </Text>
                      <Text style={styles.recipeCuisine}>{recipe.cuisine}</Text>

                      <Text style={[styles.badge, styles.nonVegBadge]}>
                        {recipe.mealType}
                      </Text>
                    </View>
                    <View
                      style={{ flex: "1", marginRight: "5%", marginTop: "5%" }}
                    >
                      <Feather name="heart" size={15} color="red" />
                      <Text style={{ fontWeight: "800", color: "red" }}>
                        13
                      </Text>
                    </View>
                  </View>
                </View>
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

  profileRecipeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  profileRecipeContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  recipeImage: {
    width: "100%",
    height: width * 0.25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },
  recipeCuisine: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0E0",
    color: "#FF7A00",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },
  vegBadge: {
    backgroundColor: "#DCFCE7",
    color: "#15803D",
  },

  nonVegBadge: {
    backgroundColor: "#FFEDD5",
    color: "#EA580C",
  },
  editButton: {
    backgroundColor: "#FF7A00",
    flexDirection: "row",
    height: height * 0.055, // Heights tied strictly to screen runtime heights
    borderRadius: 12,
    flex: 2, // Takes up twice the space of the share block
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  fullWidthButton: {
    width: "90%",
  },
  dietaryBadge: {
    position: "absolute",
    top: width * 0.02,
    right: width * 0.02,

    width: width * 0.08,
    height: width * 0.08,

    borderRadius: width * 0.04,
    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
});

export default ProfileScreen;
