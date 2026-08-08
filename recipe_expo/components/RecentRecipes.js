import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getRecentRecipes } from "../api/apiRoute";
import { StyleSheet } from "react-native";
import { COLORS } from "../const/COLORS";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import SectionHeader from "./header/SectionHeader";

const { width } = Dimensions.get("window");

const RecentRecipes = ({ dietaryType = null, category = "All", refreshKey = 0 }) => {
  const [recipes, setRecipes]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const navigation                = useNavigation();

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await getRecentRecipes(dietaryType);
      // API may return data as array directly or nested
      const data = Array.isArray(res.data) ? res.data : res.data?.recipes ?? res.data?.data ?? [];
      setRecipes(data);
    } catch (err) {
      console.log("RecentRecipes fetch error:", err?.message || err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [dietaryType]);

  // Re-fetch whenever the dietary filter or home-screen refresh key changes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes, refreshKey]);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.container}>
        <SectionHeader mainTxt="Recent" HighlightedText="Recipes" category={category} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Discovering fresh recipes…</Text>
        </View>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.container}>
        <SectionHeader mainTxt="Recent" HighlightedText="Recipes" category={category} />
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={40} color="#DDB870" />
          <Text style={styles.emptyTitle}>Couldn't load recipes</Text>
          <Text style={styles.emptySubtitle}>Check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchRecipes} activeOpacity={0.75}>
            <Ionicons name="refresh-outline" size={15} color="#fff" style={{ marginRight: 5 }} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Empty state ──────────────────────────────────────────────
  if (recipes.length === 0) {
    return (
      <View style={styles.container}>
        <SectionHeader mainTxt="Recent" HighlightedText="Recipes" category={category} />
        <View style={styles.center}>
          <Ionicons name="restaurant-outline" size={40} color="#DDB870" />
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptySubtitle}>
            {category === "All"
              ? "No recipes yet. Check back soon!"
              : `No ${category} recipes available right now.`}
          </Text>
        </View>
      </View>
    );
  }

  // ── List ─────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <SectionHeader mainTxt="Recent" HighlightedText="Recipes" category={category} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ViewRecipe", { recipeId: recipe.id })}
          >
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {recipe.title}
              </Text>
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.time}>20 min</Text>
              </View>
              <View style={styles.badges}>
                {recipe.cuisine ? (
                  <View style={styles.cuisineBadge}>
                    <Text style={styles.cuisineText}>{recipe.cuisine}</Text>
                  </View>
                ) : null}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  center: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: "#999",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: 2,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 15,
    gap: 16,
  },
  card: {
    width: width * 0.47,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: width * 0.32,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
  },
  content: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  cuisineBadge: {
    backgroundColor: "#FFE8D1",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  cuisineText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  dietaryBadge: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  dietaryText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#4F4F4F",
  },
  // dietary variant styles
  vegBadge:          { backgroundColor: "#E8F5E9" },
  vegText:           { color: "#2E7D32" },
  veganBadge:        { backgroundColor: "#E0F2F1" },
  veganText:         { color: "#00796B" },
  nonvegBadge:       { backgroundColor: "#FFEBEE" },
  nonvegText:        { color: "#C62828" },
  eggetarianBadge:   { backgroundColor: "#FFF8E1" },
  eggetarianText:    { color: "#F57F17" },
  pescatarianBadge:  { backgroundColor: "#E3F2FD" },
  pescatarianText:   { color: "#1565C0" },
});

export default RecentRecipes;
