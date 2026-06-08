import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../api/authApi";

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

        if (savedToken) {
          setToken(savedToken);
        }
        const response = await getMe()
        // if (savedUser) {
        //   setUser(JSON.parse(savedUser));
        // }

        setUser(response.data.user)

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        )
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };


    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);