import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

import logo from "../assets/logo.png";
import broccoli from "../assets/brocolli.png";
import tomato from "../assets/tomato.png";
import onion from "../assets/onion.png";
// import chilli from "../assets/chilli.png";
// import leaf from "../assets/leaf.png";

export default function Header() {
  return (
    <LinearGradient
      colors={["#FF7A00", "#FFB300"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={[styles.foodShadow, styles.tomato]}>
        <Image source={tomato} style={styles.foodImage} />
      </View>

      <View style={[styles.foodShadow, styles.broccoli]}>
        <Image source={broccoli} style={styles.foodImage} />
      </View>
{/* 
      <View style={[styles.foodShadow, styles.onion]}>
        <Image source={broccoli} style={styles.foodImage} />
      </View> */}

      <View style={[styles.foodShadow, styles.chilli]}>
        <Image source={broccoli} style={styles.foodImage} />
      </View>

      <View style={[styles.foodShadow, styles.leaf1]}>
        <Image source={onion} style={styles.foodImage} />
      </View>

      <View style={[styles.foodShadow, styles.leaf2]}>
        <Image source={broccoli} style={styles.foodImage} />
      </View>

      <View style={[styles.foodShadow, styles.leaf3]}>
        <Image source={broccoli} style={styles.foodImage} />
      </View>

      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Cookify</Text>

        <Text style={styles.subtitle}>
          Discover delicious recipes{"\n"}
          that everyone will love!
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: height * 0.45,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
    overflow: "hidden",
    position: "relative",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  logo: {
    width: width * 0.18,
    height: width * 0.18,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: width * 0.13,
    fontWeight: "900",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#fff",
    fontSize: width * 0.045,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 28,
    paddingHorizontal: 20,
  },

  foodImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  foodShadow: {
    position: "absolute",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,

    elevation: 15,
  },

  tomato: {
    width: width * 0.15,
    height: width * 0.15,
    top: height * 0.08,
    left: width * 0.05,
  },

  broccoli: {
    width: width * 0.18,
    height: width * 0.18,
    top: height * 0.08,
    right: width * 0.05,
    transform: [{ rotate: "15deg" }],
  },

  onion: {
    width: width * 0.14,
    height: width * 0.14,
    top: height * 0.2,
    left: width * 0.02,
    transform: [{ rotate: "-20deg" }],
  },

  chilli: {
    width: width * 0.18,
    height: width * 0.18,
    bottom: height * 0.05,
    right: width * 0.02,
    transform: [{ rotate: "25deg" }],
  },

  leaf1: {
    width: width * 0.08,
    height: width * 0.08,
    top: height * 0.18,
    right: width * 0.18,
    transform: [{ rotate: "25deg" }],
  },

  leaf2: {
    width: width * 0.08,
    height: width * 0.08,
    bottom: height * 0.12,
    left: width * 0.1,
    transform: [{ rotate: "-20deg" }],
  },

  leaf3: {
    width: width * 0.08,
    height: width * 0.08,
    top: height * 0.3,
    right: width * 0.05,
    transform: [{ rotate: "45deg" }],
  },
});