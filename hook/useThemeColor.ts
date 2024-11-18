import { useTheme } from "react-native-paper";

export function useThemeColor() {
  const theme = useTheme();

  return theme.colors;
}
