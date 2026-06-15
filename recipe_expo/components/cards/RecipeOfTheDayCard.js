import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../../api/apiRoute";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Seperator from "../Seperator";

const RecipeOfTheDayCard = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getRecipes = async () => {
    try {
      setIsLoading(true);

      const today = new Date().toDateString();

      const cachedDate = await AsyncStorage.getItem("recipe_date");
      const cachedRecipe = await AsyncStorage.getItem("recipe_of_the_day");

      if (cachedDate === today && cachedRecipe) {
        setRecipe(JSON.parse(cachedRecipe));
        return;
      }

      const response = await getAllRecipes();
      const recipes = response.data.recipes;

      const randomRecipe =
        recipes[Math.floor(Math.random() * recipes.length)];

      setRecipe(randomRecipe);

      await AsyncStorage.setItem("recipe_date", today);
      await AsyncStorage.setItem(
        "recipe_of_the_day",
        JSON.stringify(randomRecipe)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={18}
            color="#F97316"
          />
          <Text style={styles.headerText}>RECIPE OF THE DAY</Text>
        </View>

        <View style={styles.badge}>
          <MaterialCommunityIcons
            name="fire"
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF8A00" />
        </View>
      ) : recipe ? (
        <>
          <Image source={{ uri: recipe.image }} style={styles.image} />

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {recipe.title}
            </Text>

            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{recipe.cuisine}</Text>
              </View>

              <View style={styles.tag}>
                <Text style={styles.tagText}>{recipe.course}</Text>
              </View>
            </View>

            <Seperator/>

            <View style={styles.bottomRow}>
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statText}>❤️ 120</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statText}>⏱ 20 min</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>No recipe available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginVertical: 10,
  },

  header: {
    backgroundColor: "#FFF6F1",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE4D1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    marginLeft: 8,
    color: "#F97316",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF8A00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },

  image: {
    width: "100%",
    height: 190,
  },

  content: {
    padding: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 30,
  },

  tagsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },

  tag: {
    backgroundColor: "#FFF4EE",
    borderWidth: 1,
    borderColor: "#FFD8C2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  tagText: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "700",
  },

  bottomRow: {
    // marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stats: {
    flexDirection: "row",
  },

  statItem: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },

  statText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#FF8A00",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  loaderContainer: {
    paddingVertical: 50,
  },

  errorText: {
    textAlign: "center",
    padding: 20,
    color: "#6B7280",
  },
  
});

export default RecipeOfTheDayCard;