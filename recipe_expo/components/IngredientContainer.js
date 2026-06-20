import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const IngredientContainer = ({recipe}) => {
    // console.log("Recipe"+recipe)
  return (
    <View style={styles.ingredientsContainer}>
      {recipe.ingredients.map((ingr, index) => (
        
        <View key={index}>
          <View style={styles.ingredientRow}>
            <View style={styles.leftSection}>
              <Ionicons name="checkmark-circle" size={22} color="#22C55E" />

              <Text style={styles.ingredientName}>{ingr?.name}</Text>
            </View>

            <Text style={styles.quantity}>{ingr.quantity}</Text>
          </View>

          {index !== recipe.ingredients.length - 1 && (
            <View style={styles.separator} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
     ingredientsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    // marginTop: 1,
    // padding: 11,
  },

  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  ingredientName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },

  quantity: {
    fontSize: 15,
    color: "#666",
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F1F1",
  },
})

export default IngredientContainer;
