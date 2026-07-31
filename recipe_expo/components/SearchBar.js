import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { getAllRecipes, getUsers } from "../api/apiRoute";

const SearchBar = ({
  placeholder = "Search recipes, chefs...",
  searchType = "all", // "all", "recipes", "users"
  value: externalValue,
  onChangeText: externalOnChangeText,
  containerStyle,
}) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState(externalValue || "");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState({ recipes: [], users: [] });

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (externalValue !== undefined && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleQueryChange = (text) => {
    setQuery(text);
    if (externalOnChangeText) {
      externalOnChangeText(text);
    }

    if (!text.trim()) {
      setShowDropdown(false);
      setLoading(false);
      setResults({ recipes: [], users: [] });
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      return;
    }

    setShowDropdown(true);
    setLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(text.trim());
    }, 350);
  };

  const performSearch = async (searchTerm) => {
    try {
      let fetchedRecipes = [];
      let fetchedUsers = [];

      if (searchType === "recipes" || searchType === "all") {
        const recipeRes = await getAllRecipes(null, null, null, 1, 6, searchTerm);
        if (recipeRes?.data?.recipes) {
          fetchedRecipes = recipeRes.data.recipes;
        }
      }

      if (searchType === "users" || searchType === "all") {
        const userRes = await getUsers({ query: searchTerm, limit: 6 });
        if (userRes?.data?.users) {
          fetchedUsers = userRes.data.users;
        }
      }

      setResults({ recipes: fetchedRecipes, users: fetchedUsers });
    } catch (err) {
      console.log("Search error:", err?.message);
      setResults({ recipes: [], users: [] });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowDropdown(false);
    setLoading(false);
    setResults({ recipes: [], users: [] });
    if (externalOnChangeText) {
      externalOnChangeText("");
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setShowDropdown(false);
    Keyboard.dismiss();
    navigation.navigate("ViewRecipe", { recipeId: recipe.id });
  };

  const handleSelectUser = (user) => {
    setShowDropdown(false);
    Keyboard.dismiss();
    navigation.navigate("UserProfile", {
      userId: user.id,
      userName: user.username,
    });
  };

  const totalResults = results.recipes.length + results.users.length;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={18} color="#F97316" style={styles.icon} />
        <TextInput
          placeholder={placeholder}
          value={query}
          onChangeText={handleQueryChange}
          onFocus={() => {
            if (query.trim().length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {showDropdown && query.trim().length > 0 && (
        <View style={styles.dropdownCard}>
          {loading ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="small" color="#F97316" />
              <Text style={styles.statusText}>Searching...</Text>
            </View>
          ) : totalResults === 0 ? (
            <View style={styles.statusBox}>
              <Ionicons name="search-outline" size={22} color="#9CA3AF" />
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            </View>
          ) : (
            <FlatList
              data={[
                ...(results.recipes.length > 0
                  ? [{ type: "header", title: "Recipes" }]
                  : []),
                ...results.recipes.map((r) => ({ ...r, _itemType: "recipe" })),
                ...(results.users.length > 0
                  ? [{ type: "header", title: "Chefs & Users" }]
                  : []),
                ...results.users.map((u) => ({ ...u, _itemType: "user" })),
              ]}
              keyExtractor={(item, index) =>
                item.type === "header"
                  ? `header-${item.title}-${index}`
                  : `${item._itemType}-${item.id}`
              }
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              style={{ maxHeight: 280 }}
              renderItem={({ item }) => {
                if (item.type === "header") {
                  return (
                    <Text style={styles.sectionHeader}>{item.title}</Text>
                  );
                }

                if (item._itemType === "recipe") {
                  return (
                    <TouchableOpacity
                      style={styles.resultRow}
                      onPress={() => handleSelectRecipe(item)}
                    >
                      <Image
                        source={{
                          uri:
                            item.image ||
                            "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400",
                        }}
                        style={styles.recipeThumb}
                      />
                      <View style={styles.resultInfo}>
                        <Text style={styles.recipeTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.recipeMeta} numberOfLines={1}>
                          {item.cuisine || item.dietaryType || "Recipe"}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  );
                }

                if (item._itemType === "user") {
                  return (
                    <TouchableOpacity
                      style={styles.resultRow}
                      onPress={() => handleSelectUser(item)}
                    >
                      <Image
                        source={{
                          uri:
                            item.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username)}`,
                        }}
                        style={styles.avatarThumb}
                      />
                      <View style={styles.resultInfo}>
                        <Text style={styles.usernameText} numberOfLines={1}>
                          @{item.username}
                        </Text>
                        {item.bio ? (
                          <Text style={styles.bioText} numberOfLines={1}>
                            {item.bio}
                          </Text>
                        ) : null}
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  );
                }

                return null;
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 9999,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 50,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FDE7CF",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
  },
  clearBtn: {
    padding: 4,
  },
  dropdownCard: {
    position: "absolute",
    top: 62,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingVertical: 4,
    maxHeight: 300,
    zIndex: 99999,
    elevation: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  statusText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: "#F8FAFC",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F1F5F9",
  },
  recipeThumb: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginRight: 12,
  },
  avatarThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E2E8F0",
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  recipeMeta: {
    fontSize: 12,
    color: "#F97316",
    marginTop: 2,
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  bioText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});

export default SearchBar;
