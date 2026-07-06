import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../const/COLORS";
import { getRecentRecipes } from "../api/apiRoute";
import { getFavourites } from "../api/apiRoute";
import NoFavouriteFound from "../components/Loaders/NoFavouriteFoundLoader";
import NoFavouriteFoundLoader from "../components/Loaders/NoFavouriteFoundLoader";
const { width, height } = Dimensions.get("window");
const FavouriteScreen = () => {
  const [favourites,setFavourites] = useState([])
  const getFavouriteRecipes =async ()=>{
    try {
      const res = await getFavourites();

      console.log("Recent Recipe",res?.data)
      setFavourites(res.data?.recipes)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getFavouriteRecipes()
  },[])
  if(favourites.length <=0){
    return <NoFavouriteFoundLoader/>
  }
  return (
    <View style={styles.container}>
      {/* <ScreenHeader title="Favourites"/> */}
      <View style={styles.pageContainer}>
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTxt}>Favourites </Text>
            <Ionicons
              name="heart-outline"
              size={width * 0.07}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.headerPara}>
            Your favourite recipes, all in one place
          </Text>
        </View>

        {/* <View>4</View> --- neead to add  th efilter later */}


        <View>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageContainer: {
    marginTop: height * 0.07,
    marginHorizontal: width * 0.07,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTxt: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerPara: {
    color: COLORS.textSecondary,
    fontSize: width * 0.034,
  },
});
export default FavouriteScreen;
