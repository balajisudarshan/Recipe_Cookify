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
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

const RecipeOfTheDayCard = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = Dimensions.get("window");

  const CARD_WIDTH = width * 0.95;
  const CARD_HEIGHT = width * 0.6;
  const navigation = useNavigation();

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

      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

      setRecipe(randomRecipe);

      await AsyncStorage.setItem("recipe_date", today);
      await AsyncStorage.setItem(
        "recipe_of_the_day",
        JSON.stringify(randomRecipe),
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
     

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF8A00" />
        </View>
      ) : recipe ? (
        <>
          <View style={styles.heroCard}>
            <Image source={{ uri: recipe.image }} style={styles.heroImage} />

            <LinearGradient
              colors={[
                "rgba(0,0,0,0.95)",
                "rgba(0,0,0,0.8)",
                "rgba(0,0,0,0.4)",
                "rgba(0,0,0,0)",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.overlay}
            />

            <View style={styles.heroContent}>
              <Text style={styles.recipeLabel}>✦ RECIPE OF THE DAY</Text>

              <Text style={styles.heroTitle} numberOfLines={2}>
                {recipe.title}
              </Text>

              <View style={styles.heroMeta}>
                <Text style={styles.heroMetaText}>⏱ 20 min</Text>

                <Text style={styles.heroMetaText}>• Easy</Text>
              </View>

              

              <TouchableOpacity
                style={styles.heroButton}
                onPress={() =>
                  navigation.navigate("ViewRecipe", {
                    recipeId: recipe.id,
                  })
                }
              >
                <Text style={styles.heroButtonText}>View Recipe</Text>
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
    marginVertical: 12,
  },

  heroCard: {
    width: "100%",
    height: 240,

    borderRadius: 28,
    overflow: "hidden",

    backgroundColor: "#000",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,

    elevation: 8,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  heroContent: {
    position: "absolute",

    top: 24,
    left: 20,

    width: "55%",
  },

  recipeLabel: {
    color: "#FF7A00",

    fontSize: 12,
    fontWeight: "800",

    letterSpacing: 1.2,

    textTransform: "uppercase",
  },

  heroTitle: {
    color: "#FFFFFF",

    fontSize: 24,
    fontWeight: "800",

    lineHeight: 30,

    marginTop: 10,
  },

  heroMeta: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 12,
  },

  heroMetaText: {
    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "600",

    marginRight: 12,
  },

  heroButton: {
    marginTop: 18,

    backgroundColor: "#FF7A00",

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 14,

    alignSelf: "flex-start",
  },

  heroButtonText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
  },

  loaderContainer: {
    height: 240,

    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    textAlign: "center",

    color: "#6B7280",

    paddingVertical: 30,
  },
});

export default RecipeOfTheDayCard;
