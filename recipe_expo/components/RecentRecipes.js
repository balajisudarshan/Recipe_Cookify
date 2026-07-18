import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getRecentRecipes } from "../api/apiRoute";
import { StyleSheet } from "react-native";
import { COLORS } from "../const/COLORS";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import SectionHeader from "./header/SectionHeader";
import { useLikeRecipe } from "../hooks/useLikeRecipe";
const { width } = Dimensions.get("window");

const RecentRecipes = ({ dietaryType = null, category = "All" }) => {
  const { handleLike } = useLikeRecipe();
  const [recentRecipe, setRecentRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const getRecentRecipe = async () => {
      try {
        setLoading(true);
        const recipes = await getRecentRecipes(dietaryType);
        setRecentRecipe(recipes.data);
        console.log("Recennt Recipes", recipes.data);
      } catch (error) {
        console.log("Recent Error", error);
      } finally {
        setLoading(false);
      }
    };
    getRecentRecipe();
  }, [dietaryType]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.headerContainer}>
        <Text style={styles.mainHeading}>
          Recent<Text style={{ color: COLORS.primary }}> Recipes</Text>
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View> */}

      <SectionHeader mainTxt={"Recent"} HighlightedText={"Recipes"}  category={category}/>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Discovering fresh recipes...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {recentRecipe.map((recipe) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ViewRecipe", {
                  recipeId: recipe.id,
                })
              }
            >
              <Image source={{ uri: recipe.image }} style={styles.image} />
              {/* <TouchableOpacity
                style={[
                  styles.favoriteBtn,
                  recipe.isLiked && styles.favoriteBtnActive,
                ]}
                onPress={() => handleLike(recipe.id, setRecentRecipe)}
              >
                <Ionicons
                  name={recipe.isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={recipe.isLiked ? "#ff4d4f" : "#ff4d4f"}
                />
              </TouchableOpacity> */}
              <View style={styles.content}>
                <Text style={styles.title}>{recipe.title}</Text>
                <View style={styles.timeRow}>
                  <Ionicons name="time-outline" size={18} color="#666" />
                  <Text style={styles.time}>20 min</Text>
                </View>
                <View style={styles.badges}>
                  <View style={styles.cuisineBadge}>
                    <Text style={styles.cuisineText}>{recipe.cuisine}</Text>
                  </View>
                  {recipe.dietaryType ? (
                    <View style={[styles.dietaryBadge, styles[`${recipe.dietaryType.toLowerCase()}Badge`]]}>
                      <Text style={[styles.dietaryText, styles[`${recipe.dietaryType.toLowerCase()}Text`]]}>
                        {recipe.dietaryType}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },

  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 5,
    paddingBottom: 15, // Leaves space for the shadow drops
    gap: 20,
  },
  loadingContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary || "#666",
  },
  card: {
    width: width * 0.47,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: width * 0.32,
    borderRadius: 18,
  },
  favoriteBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 79, 0.18)",
  },
  favoriteBtnActive: {
    backgroundColor: "rgba(255, 237, 238, 0.98)",
    borderColor: "rgba(255, 77, 79, 0.25)",
    transform: [{ scale: 1.04 }],
  },

  content: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 6,
  },
  cuisineBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFE8D1",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  cuisineText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  dietaryBadge: {
    alignSelf: "flex-start",
    marginLeft: 8,
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  dietaryText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#4F4F4F",
  },
  vegBadge: {
    backgroundColor: "#E8F5E9",
  },
  vegText: {
    color: "#2E7D32",
  },
  veganBadge: {
    backgroundColor: "#E0F2F1",
  },
  veganText: {
    color: "#00796B",
  },
  nonvegBadge: {
    backgroundColor: "#FFEBEE",
  },
  nonvegText: {
    color: "#C62828",
  },
  pescatarianBadge: {
    backgroundColor: "#E3F2FD",
  },
  pescatarianText: {
    color: "#1565C0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#525252",
    marginTop: 4,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  time: {
    marginLeft: 4,
    fontSize: 13,
    color: "#666",
  },
  meta: {
    color: COLORS.primary || "#FF6B6B",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  // title: {
  //   fontSize: 16,
  //   fontWeight: "700",
  //   color: COLORS.text || "#1A1A1A",
  //   lineHeight: 20,
  // },
  badges: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  vegBadge: {
    backgroundColor: "#E8F5E9",
  },
  vegText: {
    color: "#2E7D32",
  },
  veganBadge: {
    backgroundColor: "#E0F2F1",
  },
  veganText: {
    color: "#00695C",
  },
  nonVegBadge: {
    backgroundColor: "#FFEBEE",
  },
  nonVegText: {
    color: "#C62828",
  },
  courseBadge: {
    backgroundColor: "#FFF3E0",
  },
  courseText: {
    color: "#EF6C00",
  },
  badges:{
    flexDirection:"row",
    alignItems:"center",

  },  
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});

export default RecentRecipes;
