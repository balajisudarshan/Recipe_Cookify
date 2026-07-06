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
        console.log("1");
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        console.log("2", savedToken);
        if (savedToken) {
          setToken(savedToken);
        }
        // const response = await getMe()
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedToken) {
          console.log("3 Before getMe");
          const response = await getMe();
          console.log("4 After getMe");


          if (response && response.data && response.data.user) {
            const freshUser = response.data.user;

            setUser(freshUser);

            await AsyncStorage.setItem("user", JSON.stringify(freshUser));
          }
        }
        console.log("5");
        // setUser(response.data.user)

        // await AsyncStorage.setItem(
        //   "user",
        //   JSON.stringify(response.data.user)
        // )
      } catch (error) {
        console.log("STATUS:", error?.response?.status);
        console.log("DATA:", error?.response?.data);
        console.log("MESSAGE:", error?.response?.data?.message);
        if(error?.response.status === 404 ||error?.response?.data?.message === "User not found" ){
          setToken(null)
          setUser(null)
        }
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
