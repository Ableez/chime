import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { XIcon } from "lucide-react-native";

const XBackHeader = () => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity onPress={() => router.back()}>
        <View style={{ padding: 12, borderRadius: 36 }}>
          <XIcon size={24} color={colors.onBackground} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default XBackHeader;
