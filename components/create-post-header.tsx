import React from "react";
import { View, Pressable } from "react-native";
import { X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useStyles } from "@/utils/styles/style";

export const Header: React.FC = () => {
  const router = useRouter();
  const { postStyles } = useStyles();
  return (
    <View style={postStyles.header}>
      <Pressable
        onPress={() =>
          router.canGoBack() ? router.back() : router.navigate("/")
        }
        style={postStyles.backButton}
      >
        <X size={26} color={"#000"} />
      </Pressable>
    </View>
  );
};
