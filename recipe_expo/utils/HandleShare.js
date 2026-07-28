import { Share } from "react-native";
import * as Linking from "expo-linking"


export const shareRecipe = async (recipe) => {
  try {
    const deepLink = Linking.createURL(`recipe/${recipe.id}`)
    await Share.share({
      title: recipe.title,
      message: `🍽️ ${recipe.title}

${recipe.description}

⭐ ${recipe.averageRating} (${recipe.ratingsCount} ratings)

Open in reciPi:
${deepLink}`
    });
  } catch (error) {
    console.log(error);
  }
};
