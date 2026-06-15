import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../../api/apiRoute";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const colors = {
  primary: "#FF8A00",
  primaryDark: "#F97316",
  lightOrange: "#FFF4EE",
  borderOrange: "#FFD8C2",
  orangeText: "#F97316",
  white: "#FFFFFF",
};

const RecipeOfTheDayCard = () => {
  const [recipe, setRecipe] = useState([]);
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
      console.log("sendig api req");
      const recipes = response.data.recipes;
      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      setRecipe([randomRecipe]);
      AsyncStorage.setItem("recipe_date", today);
      AsyncStorage.setItem("recipe_of_the_day", JSON.stringify(randomRecipe));
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
            style={{ color: "white" }}
            size={15}
          />
          <Text style={styles.badgeText}>Featured Today </Text>
        </View>
      </View>
      {isLoading && <ActivityIndicator />}

      <View key={recipe._id}>
        <Image source={{ uri: recipe.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>

          <Text style={styles.category}>
            {recipe.cuisine} -- {recipe.course}
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.stats}>
              <Text>❤️ 120</Text>
              <Text>⏱ 20 mins</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFF6F1",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE4D1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom:30
  },
  card: {
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 24,

    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius:20,
    marginTop:-20
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF8A00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  headerText: {
    color: "#F97316",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // content: {},
});
export default RecipeOfTheDayCard;
