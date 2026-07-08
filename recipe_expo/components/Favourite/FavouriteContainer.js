import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

const FavouriteContainer = ({ recipes }) => {
  return (
    <View style={styles.container}>
      {recipes.map((recipe) => (
        <TouchableOpacity
          onClick={() =>
            navigation.navigate("ViewRecipe", {
              recipeId: recipes.id,
            })
          }
        >
          <View key={recipe.id} style={styles.card}>
            <Image source={{ uri: recipe.image }} style={styles.image} />

            <View style={styles.content}>
              <Text numberOfLines={1} style={styles.title}>
                {recipe.title}
              </Text>

              <Text
                style={styles.description}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {recipe.description}
              </Text>

              <View style={styles.metaRow}>
                <Text style={styles.meta} numberOfLines={1}>
                  {recipe.cuisine} · {recipe.mealType}
                </Text>
                <Text style={styles.likes}>❤️ {recipe._count.likes}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FavouriteContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
  },

  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  description: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
    lineHeight: 17,
    flexShrink: 1,
    flexWrap: "wrap",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  meta: {
    fontSize: 12,
    color: "#B0B0B0",
    flexShrink: 1,
    marginRight: 8,
    textTransform: "capitalize",
  },

  likes: {
    fontSize: 13,
    color: "#FF6B00",
  },
});
