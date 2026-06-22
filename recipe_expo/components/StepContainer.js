import { View, Text } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { COLORS } from "../const/COLORS";
const StepContainer = ({ recipe }) => {
  // const [count,setCount] = useState(1)
  return (
    <View>
      {recipe.steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
          </View>

          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
  flexDirection: "row",
  alignItems: "flex-start",
  paddingVertical: 12,
},

stepBadge: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: COLORS.primary,

  justifyContent: "center",
  alignItems: "center",

  marginRight: 12,
  marginTop: 2,
},

stepNumber: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "700",
},

stepText: {
  flex: 1,
  fontSize: 15,
  color: COLORS.text,
  lineHeight: 24,
},
});
export default StepContainer;
