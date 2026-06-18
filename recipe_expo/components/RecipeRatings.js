import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const RecipeRatings = ({ rating = 5, totalRating = 0 }) => {
  return (
    <View style={{flexDirection:"row",alignItems:"center",marginTop:0}}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={17}
          color="#ff6600"
          style={{ marginRight: 2 }}
        />
      ))}

      <Text style={{
          marginLeft: 6,
          color: "#666",
          fontSize: 16,
        }}>
        ({totalRating})
      </Text>
    </View>
  );
};

export default RecipeRatings;
