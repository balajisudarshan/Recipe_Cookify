import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import IngredientContainer from "../components/IngredientContainer";
import StepContainer from "../components/StepContainer";

const { width, height } = Dimensions.get("window");

const ViewRecipe = () => {
  const route = useRoute();
  const { recipeId } = route.params;

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState("ingredients");

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
    <ScrollView>
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

          <View style={styles.aboutRecipeContainer}>
            <Text style={styles.headingTxt}>About this Recipe</Text>
            <Text style={styles.secondaryTxt}>{recipe.description}</Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "ingredients" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("ingredients")}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={selectedTab === "ingredients" ? "#fff" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "ingredients" && styles.activeTabText,
                ]}
              >
                Ingredients
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === "steps" && styles.activeTab]}
              onPress={() => setSelectedTab("steps")}
            >
              <Ionicons
                name="restaurant-outline"
                size={16}
                color={selectedTab === "steps" ? "#fff" : "#666"}
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "steps" && styles.activeTabText,
                ]}
              >
                Steps
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingr, index) => (
              <View key={index}>
                <View style={styles.ingredientRow}>
                  <View style={styles.leftSection}>
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#22C55E"
                    />

                    <Text style={styles.ingredientName}>{ingr.name}</Text>
                  </View>

                  <Text style={styles.quantity}>{ingr.quantity}</Text>
                </View>

                {index !== recipe.ingredients.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View> */}
          {selectedTab === "ingredients" ? (
            <IngredientContainer recipe={recipe} />
          ) : (
            <StepContainer recipe={recipe}/>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewRecipe;

const styles = StyleSheet.create({
  headingTxt: {
    fontWeight: "800",
    fontSize: width * 0.06,
    color: "#4b4b4b",
  },
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
    padding: width * 0.06,
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
  aboutRecipeContainer: {
    marginTop: height * 0.03,
    gap: 3,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 30,
    padding: 4,
    marginVertical: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: "#ff7a00",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 14,
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },
  // ingredientsContainer: {
  //   backgroundColor: "#fff",
  //   borderRadius: 20,
  //   // marginTop: 1,
  //   // padding: 11,
  // },

  // ingredientRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingVertical: 12,
  // },

  // leftSection: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   flex: 1,
  // },

  // ingredientName: {
  //   marginLeft: 10,
  //   fontSize: 16,
  //   fontWeight: "500",
  //   color: "#222",
  // },

  // quantity: {
  //   fontSize: 15,
  //   color: "#666",
  //   fontWeight: "600",
  // },

  // separator: {
  //   height: 1,
  //   backgroundColor: "#F1F1F1",
  // },
});
