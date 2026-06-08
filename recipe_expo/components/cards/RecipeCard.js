import { View, Text,Image } from 'react-native'
import React from 'react'

const RecipeCard = ({recipe}) => {
  return (
    <View>
      <Image source={{uri: recipe?.image}} style={{width: 100, height: 100}} />
      <Text>{recipe.title}</Text>
    </View>
  )
}

export default RecipeCard