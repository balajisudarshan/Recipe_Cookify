import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../api/apiRoute";

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
        // const response = await getMe()
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if(savedToken){
          const response = await getMe()

          if(response && response.data && response.data.user){
            const freshUser = response.data.user

            setUser(freshUser)

            await AsyncStorage.setItem("user",JSON.stringify(freshUser))
          }
        }
        // setUser(response.data.user)

        // await AsyncStorage.setItem(
        //   "user",
        //   JSON.stringify(response.data.user)
        // )
      } catch (error) {
        console.log("Auth initialization token verification failed:", error);
        
        // Optional: If token is expired or invalid (401 error), clear storage
        if (error?.response?.status === 401) {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };


    loadAuth();
  }, []);

  const handleLogout = async()=>{
    await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          setToken(null);
          setUser(null);
  }

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