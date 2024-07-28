import React, { useEffect, useMemo } from "react";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenSans: require("@/assets/fonts/OpenSans.ttf"),
  });

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  // const { success, error } = useMigrations(offlineDb, migrations);

  const paperTheme = useMemo(() => {
    const baseTheme =
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light };

    return colorScheme === "dark"
      ? { ...baseTheme, colors: { ...baseTheme.colors, background: "#000" } }
      : { ...baseTheme, colors: { ...baseTheme.colors, background: "#fff" } };
  }, [colorScheme, theme]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  // console.log("MIGRATION SUCCESS", success);
  // console.log("MIGRATION ERROR", error);

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      >
        <ClerkLoaded>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider
              theme={paperTheme}
              settings={{
                rippleEffectEnabled: true,
              }}
            >
              <BottomSheetModalProvider>
                <Stack
                  screenOptions={{
                    animationTypeForReplace: "push",
                    animation: "default",
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                    statusBarAnimation: "slide",
                    headerTitle: "",
                    customAnimationOnGesture: true,
                    animationDuration: 100,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen
                    name="chats-screen/index"
                    options={{
                      headerShown: true,
                      headerTitle: "Chat",
                      animation: "slide_from_right",
                      headerBackButtonMenuEnabled: true,
                      gestureDirection: "horizontal",
                      animationTypeForReplace: "pop",
                      gestureEnabled: true,
                      customAnimationOnGesture: true,
                      animationDuration: 50,
                    }}
                  />
                </Stack>
              </BottomSheetModalProvider>
            </PaperProvider>
          </GestureHandlerRootView>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
