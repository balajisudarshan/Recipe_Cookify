import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./pages/HomeScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SearchScreen from "./pages/SearchScreen";
import FavouriteScreen from "./pages/FavouriteScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import EditProfileScreen from "./pages/EditProfileScreen";
import ViewAllRecipesScreen from "./pages/ViewAllRecipesScreen";
import AddRecipePage from "./pages/AddRecipePage"; // <-- Don't forget to import this!
import ViewRecipe from "./pages/ViewRecipe";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Toast from "react-native-toast-message";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import UserProfileScreen from "./pages/UserProfileScreen";
import { useEffect, useState } from "react";
import * as NotificationService from "./utils/NotificationService";
import { getRecentRecipes, getAppVersionInfo } from "./api/apiRoute";
import * as Updates from "expo-updates";
import AppUpdateModal from "./components/AppUpdateModal";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator(); // <-- Create the new Home stack

// --- NEW: This stack keeps AddRecipe INSIDE the Home Tab ---
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="AddRecipe" component={AddRecipePage} />
      <HomeStack.Screen name="ViewRecipe" component={ViewRecipe} />
      <HomeStack.Screen name="ViewAllRecipes" component={ViewAllRecipesScreen} />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Search") {
            iconName = "search";
          } else if (route.name === "Favorites") {
            iconName = "heart";
          } else if (route.name === "AddRecipe") {
            iconName = "add";
          } else {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Point the Home tab to the new Stack we created above */}
      <Tab.Screen name="Home" component={HomeStackNavigator} />

      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="AddRecipe" component={AddRecipePage} />
      <Tab.Screen name="Favorites" component={FavouriteScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {/* <Stack.Screen name="UserP" */}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.authLoadingContainer}>
        <View style={styles.authLoadingCard}>
          <Text style={styles.authLoadingTitle}>Cookify</Text>
          <Text style={styles.authLoadingVersion}>v1.0.0</Text>
          <Text style={styles.authLoadingSubtitle}>Preparing your kitchen...</Text>
          <ActivityIndicator size="small" color="#FF6B00" />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {token ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />

            {/* Note: AddRecipe is NO LONGER here, it's safe inside HomeStackNavigator */}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  authLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F2",
    paddingHorizontal: 24,
  },
  authLoadingCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  authLoadingTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF6B00",
    marginBottom: 2,
  },
  authLoadingVersion: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF6B00",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  authLoadingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  updateBanner: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 99999,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  updateBannerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  updateBannerText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  updatePercentText: {
    color: "#FF7A00",
    fontSize: 13,
    fontWeight: "700",
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FF7A00",
    borderRadius: 3,
  },
});

export default function App() {
  const [updateStatus, setUpdateStatus] = useState({
    downloading: false,
    message: "",
    progress: 0,
  });

  const [apkUpdate, setApkUpdate] = useState({
    visible: false,
    latestVersion: "1.1.0",
    updateUrl: "https://expo.dev/accounts/balajisudarshan/projects/recipi/builds",
    releaseNotes: "A major new version of Cookify is available.",
    isMandatory: false,
  });

  useEffect(() => {
    const checkOTAUpdates = async () => {
      // Check for remote native APK updates from backend configuration
      try {
        const res = await getAppVersionInfo();
        if (res?.data?.latestVersion && res.data.latestVersion !== "1.0.0") {
          setApkUpdate({
            visible: true,
            latestVersion: res.data.latestVersion,
            updateUrl: res.data.downloadUrl || "https://expo.dev/accounts/balajisudarshan/projects/recipi/builds",
            releaseNotes: res.data.releaseNotes || "Performance enhancements & new features.",
            isMandatory: res.data.isMandatory || false,
          });
        }
      } catch (_) {
        // Silently skip if config server route is not configured
      }

      if (__DEV__) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdateStatus({
            downloading: true,
            message: "New Cookify update found! Downloading...",
            progress: 0.2,
          });

          Toast.show({
            type: "info",
            text1: "Update Available 🚀",
            text2: "Downloading latest features in background...",
            autoHide: false,
          });

          const interval = setInterval(() => {
            setUpdateStatus((prev) => ({
              ...prev,
              progress: Math.min(prev.progress + 0.15, 0.85),
            }));
          }, 400);

          await Updates.fetchUpdateAsync();
          clearInterval(interval);

          setUpdateStatus({
            downloading: true,
            message: "Update ready! Reloading app...",
            progress: 1.0,
          });

          Toast.hide();
          Toast.show({
            type: "success",
            text1: "Update Downloaded! 🎉",
            text2: "Applying changes and refreshing...",
            autoHide: false,
          });

          await new Promise((resolve) => setTimeout(resolve, 1200));
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log("Update check error:", error);
        setUpdateStatus({ downloading: false, message: "", progress: 0 });
      }
    };

    checkOTAUpdates();

    const init = async () => {
      try {
        const granted = await NotificationService.requestPermission();
        if (!granted) {
          console.log("Notification permission denied");
          return;
        }

        // Try to fetch today's recipe name for the notification
        let recipeName = null;
        try {
          const res = await getRecentRecipes();
          const recipes = res?.data;
          if (Array.isArray(recipes) && recipes.length > 0) {
            // Pick a random one from the most recent batch
            const pick = recipes[Math.floor(Math.random() * recipes.length)];
            recipeName = pick?.title || null;
          }
        } catch (_) {
          // silently fall back to generic message
        }

        await NotificationService.scheduleDailyRecipeNotification(recipeName);
      } catch (err) {
        console.log("Notification init error:", err);
      }
    };
    init();
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar hidden />

        {updateStatus.downloading && (
          <View style={styles.updateBanner}>
            <View style={styles.updateBannerRow}>
              <ActivityIndicator size="small" color="#FF7A00" />
              <Text style={styles.updateBannerText}>{updateStatus.message}</Text>
              <Text style={styles.updatePercentText}>
                {Math.round(updateStatus.progress * 100)}%
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.round(updateStatus.progress * 100)}%` },
                ]}
              />
            </View>
          </View>
        )}

        <AppUpdateModal
          visible={apkUpdate.visible}
          latestVersion={apkUpdate.latestVersion}
          updateUrl={apkUpdate.updateUrl}
          releaseNotes={apkUpdate.releaseNotes}
          isMandatory={apkUpdate.isMandatory}
          onClose={() => setApkUpdate((prev) => ({ ...prev, visible: false }))}
        />

        <AuthProvider>
          <RootNavigator />
          <Toast />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}