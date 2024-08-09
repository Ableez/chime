import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useTheme } from "react-native-paper";
import { useAuth } from "@clerk/clerk-expo";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type Props = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
};
const LoginSheet = ({ bottomSheetRef }: Props) => {
  const { dark } = useTheme();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      bottomSheetRef.current?.present();
    }
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={["73", "90"]}
      enablePanDownToClose={true}
      animateOnMount={true}
    >
      <BlurView style={styles.blurView} intensity={100} tint="systemMaterial">
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
          </View>
        </BottomSheetView>
      </BlurView>
    </BottomSheetModal>
  );
};

export default LoginSheet;

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
    marginTop: 64,
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
