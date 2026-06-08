import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import RecipeCard from "./cards/RecipeCard";

const PopularRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        console.log("Fetching recipes...");
        const response = await axios.get(
          "https://dishcover-plo9.onrender.com/api/recipe/getAllRecipes",
        );
        console.log(response.data);
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);
  return (
    <View
      style={{
        marginTop: 40,
        marginLeft: 20,
        flex:1
      }}
    >
      <View
        style={{
          // display:"flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          PopularRecipe
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              color: "#FF7A00",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>
      {loading && <Text>Loading...</Text>}
      <FlatList
            data={recipes}
            renderItem={({item}) => (<RecipeCard recipe={item} />)}
            keyExtractor={(item, index) => item.id || item._id || index.toString()}
            removeClippedSubviews={false}
          />
    </View>
  );
};

export default PopularRecipe;
