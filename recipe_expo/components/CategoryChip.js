import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const categoryThemes = {
  Veg: {
    color: "#22C55E",
    icon: "leaf",
  },
  Vegan: {
    color: "#10B981",
    icon: "sprout",
  },
  Eggetarian: {
    color: "#F59E0B",
    icon: "egg-outline",
  },
  "Non Veg": {
    color: "#EF4444",
    icon: "food-drumstick-outline",
  },
  All:{
    color: "#6366F1",
    icon: "silverware-fork-knife",
  }
};

const CategoryChip = ({ title, active, onPress }) => {
  const theme = categoryThemes[title] || {
    color: "#3B82F6",
    icon: "silverware-fork-knife",
  };

  const chipStyle = [
    styles.chip,
    {
      backgroundColor: active ? theme.color : `${theme.color}12`,
      borderColor: active ? theme.color : `${theme.color}40`,
    },
    active && styles.activeShadow,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={chipStyle}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={theme.icon}
        size={20}
        color={active ? "#FFF" : theme.color}
      />
{active && (
      <Text
        style={[
          styles.text,
          {
            color: active ? "#FFF" : theme.color,
            fontWeight: active ? "700" : "600",
          },
        ]}
      >
        {title}
      </Text>
)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 16,
    paddingVertical: 12,

    borderRadius: 999,

    borderWidth: 1,

    gap: 8,
  },

  text: {
    fontSize: 15,
    letterSpacing: 0.3,
  },

  activeShadow: {
    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
});

export default CategoryChip;