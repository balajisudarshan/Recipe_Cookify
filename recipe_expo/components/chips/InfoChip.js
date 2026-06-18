import { View, Text } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

const InfoChip = ({label,type}) => {
    let icon = "tag";
let color = "#666";
let backgroundColor = "#F5F5F5";

if (type === "course") {
  icon = "silverware-fork-knife";
  color = "#1976D2";
  backgroundColor = "#E3F2FD";
}

if (type === "cuisine") {
  icon = "earth";
  color = "#8E24AA";
  backgroundColor = "#F3E5F5";
}

if (type === "meal") {
  icon = "clock-outline";
  color = "#FB8C00";
  backgroundColor = "#FFF3E0";
}

if (type === "dietary") {
  switch (label) {
    case "VEGETARIAN":
      icon = "leaf";
      color = "#4CAF50";
      backgroundColor = "#E8F5E9";
      break;

    case "VEGAN":
      icon = "sprout";
      color = "#2E7D32";
      backgroundColor = "#E8F5E9";
      break;

    case "EGGETARIAN":
      icon = "egg";
      color = "#F9A825";
      backgroundColor = "#FFF8E1";
      break;

    case "NON_VEG":
      icon = "food-drumstick";
      color = "#E53935";
      backgroundColor = "#FFEBEE";
      break;
  }
}
  return (
    <View style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor,

    }} >
      <MaterialCommunityIcons 
        name={icon}
        size={18}
        color={color}/>

        <Text style={[styles.label],{color}}>  {label.replaceAll("_", " ")} </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },
})
export default InfoChip