import { View, Text } from 'react-native'
import React from 'react'
import SectionHeader from './header/SectionHeader'

const TopChefs = () => {
  return (
    <View>
      <SectionHeader mainTxt={"Top"} HighlightedText={"Chefs"}/>
    </View>
  )
}

export default TopChefs