import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CategoryChip = ({ title, active, onPress }) => {
  let bgColor;

  if (title === "Veg") {
    bgColor = active ? "#22C55E" : "rgba(34,197,94,0.15)";
    
  } else if (title === "Non Veg") {
    bgColor = active ? "#FF7A00" : "rgba(255,122,0,0.15)";
  } else {
    bgColor = active ? "#FFE5B4" : "rgba(255,229,180,0.4)";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: bgColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
      }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryChip