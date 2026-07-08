import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../api/apiRoute";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Validate token with server
          try {
            const response = await getMe();
            if (response && response.data && response.data.user) {
              const freshUser = response.data.user;
              setUser(freshUser);
              await AsyncStorage.setItem("user", JSON.stringify(freshUser));
            }
          } catch (validationError) {
            // Token is invalid/expired (401, 403, etc.) - clear auth
            console.log("Token validation failed:", validationError?.response?.status);
            setToken(null);
            setUser(null);
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.log("Auth loading error:", error?.message);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
