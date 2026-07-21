import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
import { Feather } from "@expo/vector-icons";
import { ENUM_TO_LABEL } from "../../const/DIETARY_TYPES";


const RecipeCard = ({ recipe, showDeleteButton = false, onDelete }) => {
  // Defensive rendering for dietary type
  const getDietaryIcon = (dietaryType) => {
    switch(dietaryType) {
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
    <View key={recipe.id} style={styles.profileRecipeCard}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      {showDeleteButton && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete?.(recipe.id)}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={14} color="#fff" />
        </TouchableOpacity>
      )}
      {recipe.dietaryType && (
        <View style={styles.dietaryBadge}>
          <MaterialCommunityIcons
            name={dietaryIconData.icon}
            size={width * 0.045}
            color={dietaryIconData.color}
          />
        </View>
      )}
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
        <View style={{ flex: "1", marginRight: "5%", marginTop: "5%" }}>
          <Feather name="heart" size={15} color="red" />
          <Text style={{ fontWeight: "800", color: "red" }}>13</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    }
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
})

export default RecipeCard;
