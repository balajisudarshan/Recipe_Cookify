import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Header from "../components/Header";
import ScreenWrapper from "../components/ScreenWrapper";
import AuthContainer from "../components/AuthContainer";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/apiRoute";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken, token: authToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      const { user, token } = response.data;

      setUser(user);
      setToken(token);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Toast.show({
        type: "success",
        text1: "Login successful",
      });

      navigation.replace("MainTabs");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: message,
      });
      console.log("ERROR RESPONSE:", error?.response?.data);
      console.log("ERROR STATUS:", error?.response?.status);
      console.log("ERROR MESSAGE:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authToken) {
      navigation.replace("MainTabs");
    }
  }, [authLoading, authToken]);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <Header />

        {/* <View
          style={{
            marginTop: -30,
            minHeight: height * 0.75,
            backgroundColor: "#fff",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        > */}
        <AuthContainer>
          <View
            style={{
              marginTop: height * 0.05,
              paddingHorizontal: width * 0.08,
            }}
          >
            <Text
              style={{
                color: "#FF7A00",
                fontWeight: "700",
                fontSize: width * 0.075,
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                color: "#7A7A7A",
                fontSize: width * 0.04,
                marginTop: 8,
              }}
            >
              Login to Continue
            </Text>

            <View
              style={{
                marginTop: 35,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: height * 0.07,
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  marginBottom: 20,
                }}
              >
                <Feather
                  name="mail"
                  size={width * 0.05}
                  color="#999"
                  style={{ marginRight: 12 }}
                />

                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  style={{
                    flex: 1,
                    fontSize: width * 0.04,
                    color: "#333",
                  }}
                />
              </View>

              <View
                style={{
                  width: "100%",
                  height: height * 0.07,
                  borderWidth: 1,
                  borderColor: "#E5E5E5",
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 15,
                }}
              >
                <Feather
                  name="lock"
                  size={width * 0.05}
                  color="#999"
                  style={{ marginRight: 12 }}
                />

                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={{
                    flex: 1,
                    fontSize: width * 0.04,
                    color: "#333",
                  }}
                />
              </View>

              <TouchableOpacity
                style={{
                  marginTop: 15,
                  alignSelf: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: "#FF7A00",
                    fontSize: width * 0.035,
                    fontWeight: "600",
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  backgroundColor: "#FF7A00",
                  height: 55,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 25,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: width * 0.042,
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading" : "Login"}
                </Text>
              </TouchableOpacity>

              {/* <Text style={{
                textAlign:"center",
                fontSize:width*0.04,
                fontWeight:"bold"
              }}>Or</Text> */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 25,
                }}
              >
                <Text
                  style={{
                    color: "#777",
                    fontSize: width * 0.038,
                  }}
                >
                  Don't have an account?
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text
                    style={{
                      color: "#FF7A00",
                      fontWeight: "700",
                      marginLeft: 5,
                      fontSize: width * 0.038,
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* </View> */}
        </AuthContainer>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;
