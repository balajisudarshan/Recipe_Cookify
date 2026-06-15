import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
const Seperator = () => {
  return <View style={styles.seperator} />;
};

const styles = StyleSheet.create({
    seperator:{
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0', 
    marginVertical: 10,
  }
})
export default Seperator;
