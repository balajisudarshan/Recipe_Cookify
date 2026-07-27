import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const RecipeRatings = ({ rating = 0, totalRating = 0 }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 0 }}>
      
      {[1, 2, 3, 4, 5].map((star) => {
        let icon = "star-outline";

        if (rating >= star) {
          icon = "star";
        } else if (rating >= star - 0.5) {
          icon = "star-half";
        }
        return (
          <Ionicons
            key={star}
            name={icon}
            size={17}
            color="#ff6600"
            style={{ marginRight: 2 }}
          />
        );
      })}
      <Text style={{
        color:"#c56b22",
        fontWeight:"bold",
        fontSize:16
      }}>
        {rating}
      </Text>

      <Text
        style={{
          marginLeft: 6,
          color: "#666",
          fontSize: 16,
        }}
      >
        ({totalRating})
      </Text>
    </View>
  );
};

export default RecipeRatings;
