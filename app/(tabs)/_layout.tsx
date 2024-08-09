import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, useTheme } from "react-native-paper";

import { Icon } from "@/components/navigation/TabBarIcon";
import { Image, TextInput, View } from "react-native";
import { currentUser } from "@/utils/mockAuth";
import { Home, Plus, Search } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { useSession, useUser } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { colors, dark } = useTheme();
  const { isSignedIn } = useSession();
  const [_, setShowHeader] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  }, []);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveTintColor: colors.onBackground,
        tabBarHideOnKeyboard: true,
        headerShadowVisible: false,
        headerShown: false,
        tabBarStyle: {
          height: 58,
          borderTopColor: dark ? "#222" : "#fff",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="(main)"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Home size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerShown: true,
          header: () => (
            <SafeAreaView style={{ backgroundColor: "#fff" }}>
              <ThemedView style={{ padding: 16, paddingTop: 24 }}>
                <Text
                  variant="headlineMedium"
                  style={{ fontWeight: "800", marginBottom: 12 }}
                >
                  Explore
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 18,
                    gap: 8,
                    borderRadius: 16,
                    backgroundColor: "#eee",
                  }}
                >
                  <Search size={18} color={"#999"} />
                  <TextInput
                    style={{
                      paddingRight: 18,
                      paddingVertical: 6,
                      fontSize: 16,
                      flex: 1,
                    }}
                    placeholder="Search"
                  />
                </View>
              </ThemedView>
            </SafeAreaView>
          ),
          title: "Explore",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Icon
              size={28}
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Newpost/index"
        options={{
          tabBarStyle: {
            display: "none",
          },
          title: "New Post",
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 14,
                backgroundColor: dark ? "#222" : "#eee",
                borderWidth: 2,
                borderColor: focused ? "#ddd" : "transparent",
              }}
            >
              <Plus size={24} color={dark ? "#ccc" : "#222"} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Icon
              size={28}
              name={focused ? "chatbubble" : "chatbubble-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused, size }) =>
            isSignedIn ? (
              <View
                style={{
                  borderWidth: 2,
                  borderColor: focused ? "#000" : colors.background,
                  borderRadius: 100,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: user?.imageUrl ?? currentUser.profilePicture }}
                  style={{ width: 28, height: 28 }}
                />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#EDF1FF",
                  padding: 7,
                  borderRadius: 24,
                  borderWidth: focused ? 2 : 1,
                  borderColor: focused ? "#BCC6E0" : "#aCC6E0",
                }}
              >
                <Icon
                  size={18}
                  name={focused ? "person" : "person-outline"}
                  color={color}
                />
              </View>
            ),
        }}
      />
    </Tabs>
  );
}
