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
import { Dimensions } from "react-native";
import RecipeStats from "../components/cards/RecipeStats";

const { width, height } = Dimensions.get("window");

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
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 10,
          }}
        >
          <InfoChip type="dietary" label={recipe.dietaryType} />
          <InfoChip type="course" label={recipe.course} />
          <InfoChip type="meal" label={recipe.mealType} />
          <InfoChip type="cuisine" label={recipe.cuisine} />
        </View>
        <RecipeStats
          likes={recipe._count.likes}
          comments={recipe._count.comments}
          saves={recipe._count.saves}
        />
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
    height: height * 0.32,
  },
  content: {
    padding: width * 0.03,
    borderTopRightRadius: width * 0.08,
    borderTopLeftRadius: width * 0.08,
    backgroundColor: "#fff",
    marginTop: -width * 0.05,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: "700",
    marginBottom: width * 0.02,
  },
  author: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: width * 0.03,
  },
  description: {
    fontSize: width * 0.038,
    lineHeight: width * 0.06,
    color: "#444",
  },
  avatar: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: width * 0.065,
  },
  userHolder: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: width * 0.03,
  },
  authorContent: {
    marginLeft: width * 0.04,
  },
  primaryTxt: {
    fontWeight: "700",
    fontSize: width * 0.04,
    textTransform: "capitalize",
  },
  secondaryTxt: {
    color: "grey",
    fontWeight: "400",
    fontSize: width * 0.032,
  },
});
