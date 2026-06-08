import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreenHeader({
  title,
  subtitle,
  rightComponent,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#FFFDF9",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "700",
              color: "#1E1E1E",
            }}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                marginTop: 4,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightComponent}
      </View>
    </View>
  );
}