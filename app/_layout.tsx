import React, { useEffect, useMemo } from "react";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Text,
  Button,
  BottomNavigation,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView, View, useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import "react-native-reanimated";
import { ThemedView } from "@/components/ThemedView";
import { Icon } from "@/components/navigation/TabBarIcon";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme = useMemo(() => {
    const baseTheme =
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light };

    return colorScheme === "dark"
      ? { ...baseTheme, colors: { ...baseTheme.colors, background: "#000" } }
      : baseTheme;
  }, [colorScheme, theme]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={paperTheme.colors.background} />
      <PaperProvider theme={paperTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const Header = () => {
  return (
    <ThemedView
      style={{
        flex: 1,
        paddingHorizontal: 12,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text variant="headlineMedium" style={{ fontWeight: 700 }}>
            Chats
          </Text>
          <Button mode="contained-tonal" onPress={() => console.log("Pressed")}>
            <Icon name="add" />
          </Button>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};
