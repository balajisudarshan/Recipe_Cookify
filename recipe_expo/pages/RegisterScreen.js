import React, { useState } from "react";
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
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
const RegisterScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useAuth();

  const handleRegister = async () => {
    try {
      const payload = {
        username: userName,
        email,
        password,
      };

      const response = await registerUser(payload)
      const { user, token } = response.data

      setUser(user)
      setToken(token)

      await AsyncStorage.setItem("token", token)
      await AsyncStorage.setItem("user", JSON.stringify(user))

      Toast.show({
        type: "success",
        text1: "Register success",
      })

      setTimeout(() => {
        navigation.replace("MainTabs")
      }, 1000)
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed"
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: message,
      })
      console.error(error)
    }
  }

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
              Welcome To Cookify!!
            </Text>

            <Text
              style={{
                color: "#7A7A7A",
                fontSize: width * 0.04,
                marginTop: 8,
              }}
            >
              Create an Account to Continue
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
                  name="user"
                  size={width * 0.05}
                  color="#999"
                  style={{ marginRight: 12 }}
                />

                <TextInput
                  placeholder="UserName "
                  placeholderTextColor="#999"
                  style={{
                    flex: 1,
                    fontSize: width * 0.04,
                    color: "#333",
                  }}
                  value={userName}
                  onChangeText={(text) => setUserName(text)}
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
                  style={{
                    flex: 1,
                    fontSize: width * 0.04,
                    color: "#333",
                  }}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
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
                  style={{
                    flex: 1,
                    fontSize: width * 0.04,
                    color: "#333",
                  }}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
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
                style={{
                  backgroundColor: "#FF7A00",
                  height: 55,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 25,
                }}
                onPress={handleRegister}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: width * 0.042,
                  }}
                >
                  Register
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
                  Already Have An Account ?
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text
                    style={{
                      color: "#FF7A00",
                      fontWeight: "700",
                      marginLeft: 5,
                      fontSize: width * 0.038,
                    }}
                  >
                    Sign In
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

export default RegisterScreen;
