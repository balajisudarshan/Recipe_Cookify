import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { getRecipe } from "../api/apiRoute";
import Toast from "react-native-toast-message";
import RecipeTopActions from "../components/buttons/TopButtons";
import { Ionicons } from "@expo/vector-icons";
import CardActionContainer from "../components/cards/CardActionContainer";
import RecipeRatings from "../components/RecipeRatings";
import InfoChip from "../components/chips/InfoChip";

const ViewRecipe = () => {
  const route = useRoute();
  const { recipeId } = route.params;

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // setIsLoading(true);

        const response = await getRecipe(recipeId);

        console.log(response.data);

        setRecipe(response.data.recipe);

        Toast.show({
          type: "success",
          text1: "Successfully fetched recipe",
        });
      } catch (error) {
        console.log("Error fetching recipe:", error);

        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <RecipeTopActions />
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <CardActionContainer />
        <Text style={styles.title}>{recipe.title}</Text>
        <RecipeRatings />

        {/* <Text style={styles.author}>By {recipe.author?.username}</Text> */}
        <View style={styles.userHolder}>
          <Image
            source={{
              uri:
                recipe.author.avatar ||
                `https://ui-avatars.com/api/?name=${recipe.author.username}`,
            }}
            style={styles.avatar}
          />
          <View style={styles.authorContent}>
            <Text style={styles.primaryTxt}>{recipe.author.username}</Text>
            <Text style={styles.secondaryTxt}>12 Recipes Shared</Text>
          </View>
        </View>

        {/* <Text style={styles.description}>{recipe.description}</Text> */}
        <View style={{
          flexDirection:"row",
          flexWrap:"wrap",
          gap:8,
          marginTop:10
        }}>
          <InfoChip type='dietary' label={recipe.dietaryType} />
          <InfoChip type='course' label={recipe.course}/>
          <InfoChip type='meal' label={recipe.mealType}/>
          <InfoChip type='cuisine' label={recipe.cuisine}/>
        </View>
      </View>
    </View>
  );
};

export default ViewRecipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 16,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: "#fff",
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  userHolder: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  authorContent: {
    marginLeft: 20,
  },
  primaryTxt: {
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "capitalize",
  },
  secondaryTxt: {
    color: "grey",
    fontWeight: "400",
  },
});
