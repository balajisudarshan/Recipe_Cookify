import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../const/COLORS";

const { width } = Dimensions.get("window");

const CHIP_WIDTH = Math.min(65, width * 0.18);

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
    color: COLORS.primary,
    icon: "egg-outline",
  },
  "Non Veg": {
    color: "#EF4444",
    icon: "food-drumstick-outline",
  },
  All: {
    color: "#6366F1",
    icon: "silverware-fork-knife",
  },
};

export default function CategoryChip({
  title,
  active,
  onPress,
}) {
  const theme = categoryThemes[title] || {
    color: "#3B82F6",
    icon: "silverware-fork-knife",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      <View
        style={[
          styles.chip,
          active && styles.activeChip,
        ]}
      >
        <MaterialCommunityIcons
          name={theme.icon}
          size={24}
          color={active ? "#FFF" : theme.color}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.text,
          active && styles.activeText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: CHIP_WIDTH,
  },

  chip: {
    width: CHIP_WIDTH,
    height: 44,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.surface,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#EEF2F7",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 2,
  },

  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 6,
  },

  text: {
    marginTop: 6,

    fontSize: 13,
    fontWeight: "600",

    textAlign: "center",

    color: COLORS.textSecondary,
  },

  activeText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});