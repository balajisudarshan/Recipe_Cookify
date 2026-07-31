import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.72;

const COLLECTIONS = [
  {
    id: "1",
    title: "Healthy & Fresh Bowls 🥗",
    subtitle: "Nutritious, low-calorie greens & salads",
    tag: "Clean Eating",
    tagColor: "#10B981",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
    cuisineParam: "ALL",
  },
  {
    id: "2",
    title: "Italian Delights 🍕",
    subtitle: "Authentic pasta, wood-fired pizzas & risottos",
    tag: "Trending Now",
    tagColor: "#EF4444",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    cuisineParam: "ITALIAN",
  },
  {
    id: "3",
    title: "Indian Heritage Spices 🍲",
    subtitle: "Rich curries, biryanis & traditional gravies",
    tag: "Top Rated",
    tagColor: "#F59E0B",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
    cuisineParam: "INDIAN",
  },
  {
    id: "4",
    title: "Asian & Chinese Bites 🍜",
    subtitle: "Dim sums, noodles & sizzlers",
    tag: "Chef Special",
    tagColor: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    cuisineParam: "CHINESE",
  },
  {
    id: "5",
    title: "Sweet Cravings 🍰",
    subtitle: "Decadent desserts, cakes & icy delights",
    tag: "Must Try",
    tagColor: "#EC4899",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600",
    cuisineParam: "ALL",
  },
];

const SeasonalCollections = () => {
  const navigation = useNavigation();

  const handleSelectCollection = (collection) => {
    navigation.navigate("ViewAllRecipes", {
      initialCuisine: collection.cuisineParam,
    });
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.titleWithBadge}>
            <MaterialCommunityIcons name="bookshelf" size={20} color="#FF6B00" />
            <Text style={styles.sectionTitle}>Curated Collections</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Handpicked recipes for every mood & craving</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ViewAllRecipes")}
          style={styles.seeAllBtn}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="arrow-forward" size={14} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* Cards Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollTrack}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
      >
        {COLLECTIONS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.cardWrapper}
            onPress={() => handleSelectCollection(item)}
          >
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              {/* Gradient Overlay for Text Visibility */}
              <LinearGradient
                colors={["transparent", "rgba(15, 23, 42, 0.75)", "rgba(15, 23, 42, 0.95)"]}
                style={styles.gradientOverlay}
              />

              {/* Tag Badge */}
              <View style={[styles.tagBadge, { backgroundColor: item.tagColor }]}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.cardSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>

                <View style={styles.exploreRow}>
                  <Text style={styles.exploreText}>Explore Recipes</Text>
                  <View style={styles.exploreIconCircle}>
                    <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  titleWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B00",
  },
  scrollTrack: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 185,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    backgroundColor: "#1E293B",
  },
  card: {
    flex: 1,
    position: "relative",
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  tagBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardContent: {
    position: "absolute",
    bottom: 14,
    left: 16,
    right: 16,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: "#E2E8F0",
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  exploreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exploreText: {
    color: "#FFB074",
    fontSize: 12,
    fontWeight: "600",
  },
  exploreIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF6B00",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SeasonalCollections;
