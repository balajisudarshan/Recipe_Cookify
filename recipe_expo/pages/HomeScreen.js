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
import AllFoodIcon from "../icons/AllFoodIcon";
import CategoryCard from "../components/cards/CategoryCard";
import CATEGORIES from "../const/CATEGORIES";
import RecipeOfTheDayCard from "../components/cards/RecipeOfTheDayCard";
import RecentRecipes from "../components/RecentRecipes";
const { width, height } = Dimensions.get("window");

// const CATEGORIES = [
//   {
//     id: "1",
//     title: "All",
//     bg: "#FFF2E0",
//     border: "#FFD090",
//     icon: AllFoodIcon,
//   },
//   {
//     id: "2",
//     title: "Burger",
//     bg: "#FFEBEA",
//     border: "#FFC4C1",
//     icon: AllFoodIcon, // Replace with your Burger Icon later
//   },
//   {
//     id: "3",
//     title: "Sweets",
//     bg: "#FCEEFF",
//     border: "#EFAFFF",
//     icon: AllFoodIcon, // Replace with your Sweets/Cupcake Icon later
//   },
// ];

const HomeScreen = ({ navigation }) => {
  const logoSize = width * 0.42;
  const [category, setCategory] = useState("Veg");

  return (
    <ScrollView style={styles.container}>
      {/* Top Banner View */}
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
            bottom: -(logoSize * 0.28),
            resizeMode: "contain",
          }}
        />
      </View>

      {/* Search Bar section */}
      <View style={styles.searchContainer}>
        <SearchBar placeholder="Search Recipes" />
      </View>

      {/* Primary Toggle Chips */}
      <View style={styles.chipsContainer}>
        <CategoryChip
          title={"Veg"}
          icon={"leaf"}
          active={category === "Veg"}
          onPress={() => setCategory("Veg")}
        />
        <CategoryChip
          title={"Non Veg"}
          icon={"food-drumstick-outline"}
          active={category === "Non Veg"}
          onPress={() => setCategory("Non Veg")}
        />
      </View>
      <View style={{marginVertical:10}}>
        <RecipeOfTheDayCard />
      </View>
      <RecentRecipes/>

      {/* Horizontal Dynamic Cards Track */}
      <View style={styles.cardsContainerTrack}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {CATEGORIES.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.title}
              backgroundColor={item.bg}
              borderColor={item.border}
              Icon={item.icon}
              onPress={() => setCategory(item.title)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F2",
  },
  curveView: {
    paddingTop: height * 0.065,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.06,
    borderBottomLeftRadius: width * 0.1,
    borderBottomRightRadius: width * 0.1,
    overflow: "hidden",
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    paddingRight: width * 0.3,
  },
  title: {
    color: "#FFFFFF",
    fontSize: width * 0.075,
    fontWeight: "800",
  },
  subtitle: {
    color: "#FFE5D0",
    fontSize: width * 0.038,
    marginTop: 6,
  },
  searchContainer: {
    marginTop: height * 0.015,
  },
  chipsContainer: {
    flexDirection: "row",
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
    gap: width * 0.03,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  cardsContainerTrack: {
    height: 115,
    marginTop: height * 0.015,
    justifyContent: "center",
  },
  scrollContainer: {
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    gap: width * 0.032,
  },
  popularSectionContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
