import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const CategoryChip = ({ title, active, onPress }) => {
  // Define our base color themes for each category
  let themeColor;

  if (title === "Veg") {
    themeColor = "#22C55E"; // Fresh Green
  } else if (title === "Non Veg") {
    themeColor = "#FF7A00"; // Cookify Orange
  } else if (title === "Desserts") {
    themeColor = "#EAB308"; // Golden Yellow
  } else {
    themeColor = "#3B82F6"; // Action Blue (for + Add Recipe)
  }

  
  const chipStyle = [
    styles.chipBase,
    {
      backgroundColor: active ? themeColor : `${themeColor}15`, 
      borderColor: active ? themeColor : `${themeColor}40`,     
      borderWidth: active ? 0 : 1,
    },
    active && styles.activeShadow 
  ];

  const textStyle = [
    styles.textBase,
    {
      color: active ? "#FFFFFF" : themeColor,
      fontWeight: active ? "700" : "600",
    }
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={chipStyle}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chipBase: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25, 
    alignItems: "center",
    justifyContent: "center",
  },
  textBase: {
    fontSize: 15,
    letterSpacing: 0.3,
  },
  activeShadow: {
    // Android Shadow
    elevation: 6,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  }
});

export default CategoryChip;