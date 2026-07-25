import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const SearchBar = ({ placeholder, value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#F97316" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 50,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FDE7CF",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
  },
});

export default SearchBar;
