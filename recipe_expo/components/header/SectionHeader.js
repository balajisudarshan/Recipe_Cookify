import { View, Text, TouchableOpacity,StyleSheet} from "react-native";
import React from "react";
import { COLORS } from "../../const/COLORS";
import { useNavigation } from "@react-navigation/native";
const SectionHeader = ({mainTxt,HighlightedText,link,category}) => {
  const navigation = useNavigation()
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.mainHeading}>
        {mainTxt}<Text style={{ color: COLORS.primary }}>{" "}{HighlightedText}</Text>
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={()=>navigation.navigate("ViewAllRecipes",{category})}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingRight: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary || "#FF6B6B",
  },
  mainHeading: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 20,
    // marginBottom: 15,
    letterSpacing: -0.5,
  },
})

export default SectionHeader;
