import { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../api/apiRoute";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log("Error removing auth storage:", e?.message);
    }
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
      console.log("Token validation status:", status, "error:", validationError?.message);

      if (status === 401 || status === 403) {
        console.log("Token invalid or expired - clearing auth session");
        await handleLogout();
      } else {
        console.log("Network or server error during token validation; keeping current session");
      }
    }
  }, [handleLogout]);

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
            // Restore local session immediately so app opens without delay
            setToken(savedToken);
            setUser(parsedUser);
            setLoading(false);

            // Run backend token validation in background (non-blocking)
            validateStoredSession(savedToken);
            return;
          }
        }

        setToken(null);
        setUser(null);
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

