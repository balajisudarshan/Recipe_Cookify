import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RadioGroup = ({ label, options, selectedValue, onSelect }) => {
  return (
    <View style={styles.col}>
      {label && <Text style={styles.inputTxt}>{label}</Text>}
      
      <View style={styles.radioRow}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <TouchableOpacity
              key={option}
              style={styles.radioContainer}
              onPress={() => onSelect(option)}
              activeOpacity={0.7}
            >
              {/* Outer circle layout frame */}
              <View style={[styles.radioOuterCircle, isSelected && styles.radioOuterCircleSelected]}>
                {/* Inner selection accent indicator core dot */}
                {isSelected && <View style={styles.radioInnerCircle} />}
              </View>
              
              <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  col: { flexDirection: "column", gap: 6 },
  inputTxt: {
    paddingLeft: 4,
    fontWeight: "bold",
    fontSize: 15,
    color: "#4A5568",
  },
  radioRow: {
    flexDirection: "row",
    gap: 24,
    paddingLeft: 4,
    marginTop: 6,
    flexWrap:"wrap"
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuterCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#A0AEC0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioOuterCircleSelected: {
    borderColor: "#FF7A00", // Your premium brand accent color
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF7A00",
  },
  radioLabel: {
    fontSize: 15,
    color: "#4A5568",
    fontWeight: "500",
  },
  radioLabelSelected: {
    color: "#2D3748",
    fontWeight: "700",
  },
});

export default RadioGroup;