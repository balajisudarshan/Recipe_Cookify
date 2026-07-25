import { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../api/apiRoute";

const AuthContext = createContext();
const AUTH_RESTORE_TIMEOUT_MS = 1500;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const validateStoredSession = useCallback(async (savedToken) => {
    if (!savedToken) return;

    try {
      const response = await getMe();
      if (response?.data?.user) {
        const freshUser = response.data.user;
        setUser(freshUser);
        await AsyncStorage.setItem("user", JSON.stringify(freshUser));
      }
    } catch (validationError) {
      const status = validationError?.response?.status;
      const message = validationError?.response?.data?.message || validationError?.message || "Unknown error";
      console.log("Token validation error status:", status, "message:", message);

      if (status === 401 || status === 403 || status === 404) {
        console.log("Token invalid or session could not be verified - clearing auth");
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      } else {
        console.log("Network or server error during token validation; keeping current session until the backend is reachable");
      }
    }
  }, []);

  useEffect(() => {
    globalThis.__authLogoutHandler = handleLogout;

    return () => {
      if (globalThis.__authLogoutHandler === handleLogout) {
        globalThis.__authLogoutHandler = null;
      }
    };
  }, [handleLogout]);

  useEffect(() => {
    let isMounted = true;

    const loadAuth = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
        ]);

        if (!isMounted) return;

        if (savedToken && savedUser) {
          let parsedUser = null;

          try {
            parsedUser = JSON.parse(savedUser);
          } catch (parseError) {
            console.log("Failed to parse saved user", parseError?.message);
          }

          if (parsedUser) {
            setToken(savedToken);
            setUser(parsedUser);
          } else {
            setToken(null);
            setUser(null);
          }

          await Promise.race([
            validateStoredSession(savedToken),
            new Promise((resolve) => setTimeout(resolve, AUTH_RESTORE_TIMEOUT_MS)),
          ]);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.log("Auth loading error:", error?.message);
        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAuth();

    return () => {
      isMounted = false;
    };
  }, [validateStoredSession]);

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
