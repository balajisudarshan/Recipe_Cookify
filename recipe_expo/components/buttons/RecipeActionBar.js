import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../const/COLORS";
import { StyleSheet } from "react-native";
import { useLikeRecipe } from "../../hooks/useLikeRecipe";

const RecipeActionBar = ({ recipeId, recipe, setRecipe }) => {
  const { handleLike } = useLikeRecipe();
  const isLiked = Boolean(recipe?.isLiked);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cookingModeBtn}>
        <View style={styles.leftContent}>
          <MaterialCommunityIcons name="chef-hat" size={22} color="#fff" />

          <Text style={styles.cookingText}>Start Cooking Mode</Text>
        </View>

        <Ionicons name="arrow-forward" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.actionBtnHolder}>
        <TouchableOpacity style={styles.btn} onPress={() => handleLike(recipeId, setRecipe)}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={22}
            color={isLiked ? "#ff4d4d" : COLORS.primary}
          />

          <Text style={styles.txt}>{isLiked ? "Liked" : "Like"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.primary} />

          <Text style={styles.txt}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 20,
  },

  cookingModeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  cookingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
  },

  actionBtnHolder: {
    flexDirection: "row",
    gap: 12,
  },

  btn: {
    backgroundColor: "#fff",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",

    alignItems: "center",
    paddingVertical:10,
    justifyContent:"center",
    gap:10,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  txt: {
    // marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
});
export default RecipeActionBar;
