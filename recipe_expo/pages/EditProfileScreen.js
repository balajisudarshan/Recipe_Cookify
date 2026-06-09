import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile } from "../api/apiRoute";
import { useAuth } from "../context/AuthContext";
import ScreenWrapper from "../components/ScreenWrapper";
import ScreenHeader from "../components/ScreenHeader";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();

  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  useEffect(() => {
    setBio(user?.bio || "");
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bio", bio);

      if (avatar) {
        formData.append("avatar", {
          uri: avatar.uri,
          name: "avatar.jpg",
          type: "image/jpeg",
        });
      }

      const response = await updateProfile(formData);
      const updatedUser = response.data?.user || response.data;

      if (updatedUser) {
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      }

      navigation.goBack();
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loaderText}>Updating profile...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScreenHeader
          title="Edit Profile"
          subtitle="Update your kitchen profile details"
        />

        <View style={styles.card}>
          <TouchableOpacity style={styles.avatarButton} onPress={pickImage}>
            <Image
              source={{
                uri:
                  avatar?.uri ||
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.username || "Chef"}`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.avatarText}>Change Avatar</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Write a short bio about your kitchen"
              placeholderTextColor="#999"
              style={styles.input}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Updating..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  avatarButton: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FF7A00",
    marginBottom: 12,
    backgroundColor: "#f3f3f3",
  },
  avatarText: {
    color: "#FF7A00",
    fontWeight: "700",
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#FBFBFB",
  },
  saveButton: {
    backgroundColor: "#FF7A00",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});

export default EditProfileScreen;