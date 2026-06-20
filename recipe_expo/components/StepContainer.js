import { View, Text } from 'react-native'
import React from 'react'

const StepContainer = ({recipe}) => {
  return (
    <View>
        {recipe.steps.map((step)=>(
            <Text>{step}</Text>
        ))}
    </View>
  )
}

export default StepContainer