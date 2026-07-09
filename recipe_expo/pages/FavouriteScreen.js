import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavourites } from "../api/apiRoute";
import NoFavouriteFoundLoader from "../components/Loaders/NoFavouriteFoundLoader";
import Loading from "../components/Loaders/Loading";
import FavouriteContainer from "../components/Favourite/FavouriteContainer";
const { width, height } = Dimensions.get("window");

const FavouriteScreen = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFavouriteRecipes = async () => {
    try {
      setLoading(true);
      const res = await getFavourites();
      setFavourites(res.data?.recipes || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFavouriteRecipes();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }
  if (favourites.length <= 0) {
    return <NoFavouriteFoundLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Favourites</Text>
          <Text style={styles.headerPara}>
            {favourites.length} saved recipe{favourites.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <FavouriteContainer recipes={favourites} />
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
    flex: 1,
    marginTop: height * 0.07,
    marginHorizontal: width * 0.05,
  },
  header: {
    marginBottom: 18,
  },
  headerTxt: {
    fontSize: width * 0.065,
    fontWeight: "600",
    color: "#222",
  },
  headerPara: {
    color: "#999",
    fontSize: width * 0.032,
    marginTop: 2,
  },
});

export default FavouriteScreen;