import { View, type ViewProps } from "react-native";

import { useTheme } from "react-native-paper";

export function ThemedView({ style, ...otherProps }: ViewProps) {
  const { colors, dark } = useTheme();

  return (
    <View
      style={[style, { backgroundColor: dark ? "#000" : "#fff" }]}
      {...otherProps}
    />
  );
}
