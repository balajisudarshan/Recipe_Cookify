import { View, Text,TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import React from "react";

const CardActionContainer = () => {
  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="heart-outline" size={26} color="#ff7a00" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="bookmark-outline" size={26} color="#ff3300" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    actionContainer:{
    position:"absolute",
    top:"-20",
    right:"30",
    flexDirection:"row"
  },
  actionButton:{
    width:45,
    height:45,
    borderRadius:30,
    backgroundColor:"#ffff",
    justifyContent:"center",
    alignItems:"center",
    marginLeft:12,
    shadowColor:"#000",
    shadowOffset:{
      width:0,
      height:4
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 8,
  },
})

export default CardActionContainer;
