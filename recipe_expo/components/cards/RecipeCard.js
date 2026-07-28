import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const RecipeCard = ({ recipe, showDeleteButton = false, onDelete }) => {
  const navigation = useNavigation();

  const getDietaryIcon = (dietaryType) => {
    switch (dietaryType) {
      case "VEGAN":
        return { icon: "sprout", color: "#16A34A" };
      case "VEGETARIAN":
        return { icon: "leaf", color: "#22C55E" };
      case "EGGETARIAN":
        return { icon: "egg", color: "#F59E0B" };
      case "NON_VEG":
        return { icon: "food-drumstick", color: "#EF4444" };
      default:
        return { icon: "help-circle", color: "#999999" };
    }
  };

  const dietaryIconData = getDietaryIcon(recipe.dietaryType);

  return (
    <TouchableOpacity
      key={recipe.id}
      style={styles.profileRecipeCard}
      onPress={() => navigation.navigate("Home", { 
        screen:"ViewRecipe",
        params:{
          recipeId:recipe.id
        } 
      })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

      {showDeleteButton && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete?.(recipe.id)} activeOpacity={0.8}>
          <Feather name="trash-2" size={13} color="#fff" />
        </TouchableOpacity>
      )}

      {recipe.dietaryType && (
        <View style={styles.dietaryBadge}>
          <MaterialCommunityIcons name={dietaryIconData.icon} size={width * 0.045} color={dietaryIconData.color} />
        </View>
      )}

      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text style={styles.recipeCuisine}>{recipe.cuisine}</Text>

        <View style={styles.bottomRow}>
          <Text style={[styles.badge, styles.nonVegBadge]}>{recipe.mealType}</Text>
          <View style={styles.likesBox}>
            <Feather name="heart" size={12} color="#F43F5E" />
            <Text style={styles.likesText}>13</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileRecipeCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F4E8DD",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  recipeImage: {
    width: "100%",
    height: width * 0.26,
  },
  recipeContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  recipeCuisine: {
    marginTop: 4,
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF1E6",
    color: "#F97316",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
  },
  nonVegBadge: {
    backgroundColor: "#FFF1E6",
    color: "#F97316",
  },
  likesBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#F43F5E",
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
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  deleteButton: {
    position: "absolute",
    top: width * 0.02,
    left: width * 0.02,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    backgroundColor: "rgba(239, 68, 68, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});

export default RecipeCard;
