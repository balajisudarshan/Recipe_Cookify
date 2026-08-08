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
    if (!savedToken || savedToken === "null" || savedToken === "undefined" || savedToken.trim() === "") {
      await handleLogout();
      return;
    }

    try {
      const response = await getMe();
      if (response?.data?.user) {
        const freshUser = response.data.user;
        setUser(freshUser);
        await AsyncStorage.setItem("user", JSON.stringify(freshUser));
      } else {
        await handleLogout();
      }
    } catch (validationError) {
      const status = validationError?.response?.status;
      const msg = validationError?.response?.data?.message || validationError?.response?.data?.error || "";
      console.log("Token validation status:", status, "error:", validationError?.message);

      if (
        status === 401 ||
        status === 403 ||
        status === 400 ||
        (typeof msg === "string" && /invalid|unauthorized|jwt|token|not found/i.test(msg))
      ) {
        console.log("Token invalid - clearing auth session");
        await handleLogout();
      } else {
        console.log("Network or server error during token validation; keeping current session");
      }
    }
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

        const isValidTokenStr =
          savedToken &&
          typeof savedToken === "string" &&
          savedToken !== "null" &&
          savedToken !== "undefined" &&
          savedToken.trim() !== "";

        if (isValidTokenStr && savedUser) {
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

        // Clean up invalid or orphaned storage items
        await handleLogout();
      } catch (error) {
        console.log("Auth loading error:", error?.message);
        await handleLogout();
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
  }, [validateStoredSession, handleLogout]);

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

