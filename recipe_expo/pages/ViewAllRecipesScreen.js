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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
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

// Lightweight shimmer-style skeleton card — no extra deps, no extra re-renders.
// Purely presentational; does not touch data flow.
const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonLineWide} />
    <View style={styles.skeletonLineNarrow} />
  </View>
);

const SkeletonSection = () => (
  <View style={styles.recipeSection}>
    <View style={styles.skeletonHeaderLine} />
    <View style={styles.recipeGrid}>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  </View>
);

const ViewAllRecipesScreen = () => {
  const navigation = useNavigation();
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
    if (showLoader) setLoading(true);

    try {
      const cuisineParam = selectedCuisine === "ALL" ? null : selectedCuisine;
      const responses = await Promise.all(
        mealTypeOptions.map(({ value }) => getAllRecipes(null, cuisineParam, value, 1, 6)),
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
        colors={["#EA580C", "#FB923C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { height: HEADER_HEIGHT }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>All Recipes</Text>

          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.6}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: CONTENT_TOP_PADDING }]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          fetchRecipes(false);
        }}
      >
        <View style={styles.sheet}>
          <SearchBar placeholder="Search recipes, cuisines..." />

          <View style={styles.badgeSection}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.badgeTitle}>Choose a cuisine</Text>
              <Text style={styles.sectionHint}>
                {selectedCuisine === "ALL" ? "All cuisines" : selectedCuisine}
              </Text>
            </View>

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
                    activeOpacity={0.7}
                    style={[styles.badge, isActive && styles.activeBadge]}
                    onPress={() => setSelectedCuisine(item.value)}
                  >
                    <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.contentContainer}>
            {loading ? (
              <>
                <SkeletonSection />
                <SkeletonSection />
              </>
            ) : (
              mealTypeOptions.map(({ label, value }) => {
                const list = recipes[value] || [];

                return (
                  <View key={value} style={styles.recipeSection}>
                    <View style={styles.sectionHeaderRow}>
                      <View>
                        <Text style={styles.heading}>{label}</Text>
                        <Text style={styles.sectionSubtext}>
                          {list.length > 0 ? `${list.length} dishes ready` : "Fresh picks coming soon"}
                        </Text>
                      </View>

                      {list.length > 0 && (
                        <View style={styles.countPill}>
                          <Text style={styles.countPillText}>{list.length}</Text>
                        </View>
                      )}
                    </View>

                    {list.length > 0 ? (
                      <View style={styles.recipeGrid}>
                        {list.map((recipe) => (
                          <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <View style={styles.emptyIconWrap}>
                          <Ionicons name="restaurant-outline" size={22} color="#EA580C" />
                        </View>
                        <Text style={styles.emptyTitle}>No {label.toLowerCase()} recipes yet</Text>
                        <Text style={styles.emptyText}>Try another cuisine or pull down to refresh.</Text>
                      </View>
                    )}
                  </View>
                );
              })
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
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 38 : 44,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: width < 380 ? 20 : 24,
    fontWeight: "700",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    justifyContent: "center",
    alignItems: "center",
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
    paddingBottom: 32,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    minHeight: height * 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 6,
  },
  badgeSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 0.1,
  },
  sectionHint: {
    fontSize: 12,
    color: "#EA580C",
    fontWeight: "600",
  },
  badgeRow: {
    paddingRight: 4,
    paddingBottom: 4,
  },
  badge: {
    minHeight: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: "#EA580C",
    borderColor: "#EA580C",
    shadowColor: "#EA580C",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  badgeText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "600",
  },
  activeBadgeText: {
    color: "#FFF",
  },
  contentContainer: {
    marginTop: 8,
  },
  recipeSection: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 0.1,
  },
  sectionSubtext: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  countPill: {
    backgroundColor: "#FFF1E6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countPillText: {
    color: "#EA580C",
    fontSize: 12,
    fontWeight: "700",
  },
  recipeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  emptyState: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FAFAFA",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 4,
  },
  emptyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF1E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  // ---- Skeleton loading state ----
  skeletonHeaderLine: {
    width: 120,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
    marginBottom: 12,
  },
  skeletonCard: {
    width: (width - 40 - 12) / 2,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 10,
    marginBottom: 16,
  },
  skeletonImage: {
    width: "100%",
    height: 100,
    borderRadius: 14,
    backgroundColor: "#F1F1F1",
    marginBottom: 10,
  },
  skeletonLineWide: {
    width: "80%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F1F1F1",
    marginBottom: 6,
  },
  skeletonLineNarrow: {
    width: "50%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F5F5F5",
  },
}); 