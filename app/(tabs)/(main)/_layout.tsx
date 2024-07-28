import { useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter } from "expo-router";
import { XIcon } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Animated } from "react-native";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { BlurView } from "expo-blur";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const Screen = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showTopBanner, setShowTopBanner] = useState(false);
  const { colors, dark } = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const topBannerHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setTimeout(() => {
        setShowBottomSheet(true);
      }, 6000);
    }
  }, [isLoaded, userId]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
      showTopBannerAnimated();
    }
  }, []);

  const showTopBannerAnimated = () => {
    setShowTopBanner(true);

    Animated.timing(topBannerHeight, {
      toValue: 50,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {showTopBanner ? (
        <View
          style={{
            marginTop: 32,
            borderBottomColor: "#eee",
            borderBottomWidth: 0.2,
          }}
        >
          <View
            style={{
              padding: 16,
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: "#fff",
            }}
          >
            <Pressable
              onPress={() => setShowTopBanner(false)}
              style={{
                borderRadius: 16,
                backgroundColor: "#EDF1FF",
                width: 30,
                height: 30,
                alignSelf: "flex-end",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <XIcon size={16} color={colors.onBackground} />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              backgroundColor: "#fff",
              paddingHorizontal: 16,
            }}
          >
            <Pressable
              onPress={() => router.navigate("/login")}
              android_ripple={{
                radius: 20,
                color: "#ddd",
              }}
              style={{
                backgroundColor: "#EDF1FF",
                borderWidth: 2,
                borderColor: "#DAE3F9",
                borderRadius: 20,
                // width: "100%",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 50,
              }}
            >
              <Text variant="titleMedium">Login</Text>
            </Pressable>
            <Pressable
              onPress={() => router.navigate("/register")}
              android_ripple={{
                radius: 20,
                color: "#ddd",
              }}
              style={{
                backgroundColor: "#007eed",
                borderRadius: 20,
                // width: "100%",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 50,
              }}
            >
              <Text variant="titleMedium" style={{ color: "#fff" }}>
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <Slot />

      {showBottomSheet && (
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={["34"]}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          animateOnMount={true}
        >
          <BlurView
            style={styles.blurView}
            intensity={100}
            tint="systemMaterial"
          >
            <BottomSheetView style={styles.contentContainer}>
              <View
                style={[
                  styles.bottomSheetContent,
                  { backgroundColor: dark ? "#000" : "#fff" },
                ]}
              >
                {/* Google login button */}

                <View
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <Pressable
                    style={[
                      styles.button,
                      { backgroundColor: dark ? "#fff" : "#007eed" },
                    ]}
                    onPress={() => router.navigate("/register")}
                    android_ripple={{ color: dark ? "#ddd" : "#009eed" }}
                  >
                    <Image
                      source={require("@/assets/images/google.png")}
                      style={styles.buttonIcon}
                    />
                    <Text style={{ color: dark ? "#000" : "#fff" }}>
                      Continue with Google
                    </Text>
                  </Pressable>
                </View>

                {/* Email login button */}

                <View
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    android_ripple={{
                      color: dark ? "#ddd" : "#EDF1FF",
                    }}
                    style={{
                      backgroundColor: dark ? "#fff" : "#EDF1FF",
                      borderRadius: 20,
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      borderWidth: 1,
                      borderColor: "#BCC6E0",
                      overflow: "hidden",
                      height: 50,
                    }}
                    onPress={() => router.navigate("/register")}
                  >
                    <Image
                      source={require("@/assets/images/mail.jpg")}
                      style={styles.buttonIcon}
                    />
                    <Text style={{ color: dark ? "#fff" : "#000" }}>
                      Continue with email
                    </Text>
                  </Pressable>
                </View>

                {/* Login button */}
                <View
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <Pressable
                    style={[
                      styles.button,
                      styles.loginButton,
                      { borderColor: dark ? "#333" : "#EDF1FF" },
                    ]}
                    onPress={() => router.navigate("/login")}
                    android_ripple={{ color: dark ? "#333" : "#ddd" }}
                  >
                    <Text style={{ color: dark ? "#fff" : "#000" }}>Login</Text>
                  </Pressable>
                </View>

                {/* Close button */}
                {/* <Pressable
                  style={[styles.button, styles.closeButton]}
                  onPress={() => bottomSheetRef.current?.close()}
                  android_ripple={{ color: dark ? "#333" : "#ddd" }}
                >
                  <Text style={{ color: dark ? "#fff" : "#000" }}>Close</Text>
                </Pressable> */}
              </View>
            </BottomSheetView>
          </BlurView>
        </BottomSheetModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  blurView: {
    height: "100%",
    width: "100%",
    zIndex: 100,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  bottomSheetContent: {
    width: "100%",
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    paddingVertical: 12,
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  button: {
    borderRadius: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    overflow: "hidden",
  },
  buttonIcon: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  loginButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  closeButton: {
    marginTop: 18,
  },
});

export default Screen;
