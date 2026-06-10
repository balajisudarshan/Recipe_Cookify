import { View, Text, Image, FlatList, StyleSheet,ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import SearchBar from "../components/SearchBar";
import { getUsers } from "../api/apiRoute";

// import { getAllUsers } from '../../Recipe_Backend_V2/controller/profile.controller'

const SearchScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        console.log(response.data);
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <View style={styles.container}>
      <ScreenHeader title="Search" subtitle="Find Chefs" />

      <SearchBar placeholder="Search users" />

      {/* <View>
        <View>
          <View>
            <Image source = {users.avatar}/>
          </View>
          <View></View>
          <View></View>
        </View>
      </View> */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF7A00"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri:
                      item.avatar ||
                      `https://ui-avatars.com/api/?name=${item.username}`,
                  }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.usernameText}>@{item.username}</Text>
                <Text style={styles.bioText} numberOfLines={1}>
                  {item.bio || "No bio added yet"}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No chefs found</Text>
          }
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbfe",
  },
  avatarImage: {
    width: 70,
    height: 70,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it a perfect circle
    backgroundColor: "#eee",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  bioText: {
    fontWeight: "300",
    color: "#8b8b8b",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
    fontSize: 15,
  },
});

export default SearchScreen;
