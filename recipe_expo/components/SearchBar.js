import { View, Text } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput } from "react-native-gesture-handler";
const SearchBar = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        marginHorizontal: 20,

        paddingHorizontal: 18,

        height: 60,

        borderRadius:20,
        marginTop:20,

        // elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        // borderRadius: 40,
      }}
    >
      <Ionicons
        name="search"
        size={20}
        color="#6B7280"
        style={{ marginRight: 8 }}
      />
      <TextInput placeholder="Search for your Favourite Recipe" />
    </View>
  );
};

export default SearchBar;
