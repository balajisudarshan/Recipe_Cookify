import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/cards/RecipeCard";
import { getAllRecipes } from "../api/apiRoute";
const { width, height } = Dimensions.get("window");

const HEADER_HEIGHT = height * 0.22;
const CONTENT_TOP_PADDING = Math.max(height * 0.14, 110);
const cuisineOptions = [
  { label: "All", value: "ALL" },
  { label: "Indian", value: "INDIAN" },
  { label: "South Indian", value: "SOUTH_INDIAN" },
  { label: "North Indian", value: "NORTH_INDIAN" },
  { label: "Italian", value: "ITALIAN" },
  { label: "Chinese", value: "CHINESE" },
  { label: "Mexican", value: "MEXICAN" },
  { label: "Continental", value: "CONTINENTAL" },
  { label: "Thai", value: "THAI" },
  { label: "American", value: "AMERICAN" },
  { label: "Japanese", value: "JAPANESE" },
  { label: "Mediterranean", value: "MEDITERRANEAN" },
  { label: "Middle Eastern", value: "MIDDLE_EASTERN" },
  { label: "Spanish", value: "SPANISH" },
  { label: "French", value: "FRENCH" },
];

const mealTypeOptions = [
  { label: "Breakfast", value: "BREAKFAST" },
  { label: "Lunch", value: "LUNCH" },
  { label: "Dinner", value: "DINNER" },
  { label: "Snack", value: "SNACK" },
];

const ViewAllRecipesScreen = () => {
  const [selectedCuisine, setSelectedCuisine] = useState("ALL");
  const [recipes, setRecipes] = useState({
    BREAKFAST: [],
    LUNCH: [],
    DINNER: [],
    SNACK: [],
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecipes = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const cuisineParam = selectedCuisine === "ALL" ? null : selectedCuisine;
      const responses = await Promise.all(
        mealTypeOptions.map(({ value }) =>
          getAllRecipes(null, cuisineParam, value, 1, 6)
        )
      );

      const groupedRecipes = {};
      mealTypeOptions.forEach(({ value }, index) => {
        groupedRecipes[value] = responses[index]?.data?.recipes || [];
      });

      setRecipes(groupedRecipes);
    } catch (error) {
      console.log("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [selectedCuisine]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      <LinearGradient
        colors={["#F97316", "#FB923C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { height: HEADER_HEIGHT }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>All Recipes</Text>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: CONTENT_TOP_PADDING },
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchRecipes(false);
        }}
      >
        <View style={styles.sheet}>
          <SearchBar placeholder="Search Recipes" />

          <View style={styles.badgeSection}>
            <Text style={styles.badgeTitle}>Cuisines</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgeRow}
            >
              {cuisineOptions.map((item) => {
                const isActive = selectedCuisine === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.85}
                    style={[styles.badge, isActive && styles.activeBadge]}
                    onPress={() => setSelectedCuisine(item.value)}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isActive && styles.activeBadgeText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.contentContainer}>
            {loading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#F97316" />
              </View>
            ) : (
              mealTypeOptions.map(({ label, value }) => (
                <View key={value} style={styles.recipeContainer}>
                  <Text style={styles.heading}>{label}</Text>

                  {recipes[value]?.length > 0 ? (
                    <View style={styles.recipeGrid}>
                      {recipes[value].map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyText}>
                      No {label.toLowerCase()} recipes found.
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewAllRecipesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F97316",
  },

  header: {
    paddingTop: Platform.OS === "ios" ? 38 : 44,
    paddingHorizontal: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: width < 380 ? 22 : 26,
    fontWeight: "700",
  },

  scroll: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  content: {
    paddingBottom: 30,
    // paddingHorizontal: 6,
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 900,
    padding: 20,
  },

  badgeSection: {
    marginTop: 16,
    marginBottom: 8,
  },

  badgeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 8,
  },

  badgeRow: {
    paddingRight: 4,
    gap: 8,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F3C49B",
    backgroundColor: "#FFF7ED",
    marginRight: 8,
  },

  activeBadge: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },

  badgeText: {
    color: "#C2410C",
    fontSize: 13,
    fontWeight: "600",
  },

  activeBadgeText: {
    color: "#FFF",
  },

  card: {
    height: 100,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    color: "#2D3748",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 15,
  },

  recipeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },

  emptyText: {
    marginTop: 10,
    color: "#64748B",
    fontSize: 13,
  },

  loader: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
