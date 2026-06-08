import React from "react";
import { View, useWindowDimensions } from "react-native";

const AuthContainer = ({ children }) => {
  const { height } = useWindowDimensions();

  return (
    <View
      style={{
        marginTop: -30,
        minHeight: height * 0.75,
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
    >
      {children}
    </View>
  );
};

export default AuthContainer;