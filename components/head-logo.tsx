import { Asterisk } from "lucide-react-native";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const HeadLogo = () => {
  const { dark } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <Asterisk size={68} color={dark ? "#fff" : "#000"} style={{}} />
    </View>
  );
};

export default HeadLogo;
