import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import vegDelight from "../assets/vegdelights.png";
import nonVegDelight from "../assets/nonvegdelights.png";
import dessertDelight from "../assets/dessertdelight.png";
import PopularRecipe from "../components/PopularRecipe";
const { width } = Dimensions.get("window");

// 1. CHANGE THIS: Use 'navigation' instead of 'navigate'
const HomeScreen = ({ navigation }) => {
  const logoSize = width * 0.45;
  const [category, setCategory] = useState("Veg");

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.curveView,
          {
            backgroundColor:
              category === "Veg"
                ? "#FF7A00"
                : category === "Non Veg"
                  ? "#e9281a"
                  : "#3ca7ff",
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {category === "Veg"
                ? "Veg Delights"
                : category === "Non Veg"
                  ? "Non-Veg"
                  : "Dessert Delights"}
            </Text>
            <Text style={styles.subtitle}>Discover delicious recipes</Text>
          </View>
        </View>

        <Image
          source={
            category === "Veg"
              ? vegDelight
              : category === "Non Veg"
                ? nonVegDelight
                : dessertDelight
          }
          style={{
            width: logoSize,
            height: logoSize,
            position: "absolute",
            right: width * 0.02,
            bottom: -(logoSize * 0.35),
            resizeMode: "contain",
          }}
        />
      </View>
      <SearchBar />
      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          marginHorizontal: 20,
          gap: 10,
          justifyContent: "center",
        }}
      >
        {/* <CategoryChip title={"Veg"} active={category === "Veg"} onPress={() => setCategory("Veg")}/>
        <CategoryChip title={"Non Veg"} active={category === "Non Veg"} onPress={() => setCategory("Non Veg")}/>
        <CategoryChip title={"Desserts"} active={category === "Desserts"} onPress={() => setCategory("Desserts")}/> */}

        {/* 2. CHANGE THIS: Use 'navigation.navigate' */}
        {/* <CategoryChip title={"+ Add Recipe"} active={category === "Add"} onPress={() => navigation.navigate("AddRecipe")}/> */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Hides the ugly scrollbar
          style={{ marginTop: 20 }}
          contentContainerStyle={{
            paddingHorizontal: 20, // Use padding instead of margin so it scrolls cleanly off the edge
            gap: 10,
            alignItems: "center",
          }}
        >
          <CategoryChip
            title={"Veg"}
            active={category === "Veg"}
            onPress={() => setCategory("Veg")}
          />
          <CategoryChip
            title={"Non Veg"}
            active={category === "Non Veg"}
            onPress={() => setCategory("Non Veg")}
          />
          <CategoryChip
            title={"Desserts"}
            active={category === "Desserts"}
            onPress={() => setCategory("Desserts")}
          />

          <CategoryChip
            title={"+ Add Recipe"}
            active={category === "Add"}
            onPress={() => navigation.navigate("AddRecipe")}
          />
        </ScrollView>
      </View>
      <PopularRecipe />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F2" },
  curveView: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flex: 1, paddingRight: width * 0.25 },
  title: { color: "#FFFFFF", fontSize: width * 0.085, fontWeight: "800" },
  subtitle: { color: "#FFE5D0", fontSize: width * 0.04, marginTop: 8 },
  category:{
    color:"#f3f3f3"
  }
});

export default HomeScreen;
