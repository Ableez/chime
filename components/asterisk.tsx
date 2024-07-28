import { useRouter } from "expo-router";
import { Asterisk } from "lucide-react-native";
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  size?: number;
};
const AsteriskIcon = ({ size }: Props) => {
  const { colors, dark } = useTheme();
  const router = useRouter();

  return (
    <TouchableWithoutFeedback
      onPress={() => router.navigate("/")}
      style={{ width: "100%", borderWidth: 1, borderColor: "#222" }}
    >
      <View
        style={{
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Asterisk size={size ?? 84} color={colors.onBackground} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AsteriskIcon;
