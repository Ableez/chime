import React, { useState, useCallback, useEffect } from "react";
import {
  TextInput,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Text, useTheme } from "react-native-paper";
import Button from "@/components/ui/button";

export default function ResetPasswordCodeScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputCode, setInputCode] = useState<boolean>(false);
  const [passMatch, setPassMatch] = useState<"nan" | "yes" | "no">("nan");

  useEffect(() => {
    if (newPassword && confirmPassword) {
      setPassMatch(newPassword === confirmPassword ? "yes" : "no");
    } else {
      setPassMatch("nan");
    }
  }, [newPassword, confirmPassword]);

  const onResetPasswordPress = useCallback(async () => {
    if (!isLoaded) return;

    if (!code) {
      Alert.alert("Enter a code");
      return;
    }

    if (passMatch !== "yes") {
      Alert.alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        Alert.alert(
          "Password Reset Successful",
          "Your password has been reset successfully.",
          [{ text: "OK", onPress: () => router.push("/login") }]
        );
      } else {
        console.error("Unexpected result status:", result.status);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      if (err.errors[0].message) {
        Alert.alert("Error", err.errors[0].message, [
          {
            text: "Retry",
            onPress() {
              setInputCode(false);
              setCode("");
              setConfirmPassword("");
              setPassMatch("nan");
              setNewPassword("");
            },
          },
        ]);
      }
      Alert.alert("Error", err.errors[0].message)
    } finally {
      setLoading(false);
    }
  }, [isLoaded, code, newPassword, passMatch, signIn, router]);

  const getInputStyle = (fieldType: "new" | "confirm") => {
    if (fieldType === "new" && confirmPassword.length < 4) return styles.input;

    return {
      ...styles.input,
      backgroundColor:
        passMatch === "yes"
          ? "rgba(0, 255, 67, 0.08)"
          : passMatch === "no"
          ? "rgba(255, 0, 0, 0.08)"
          : "transparent",
      borderColor:
        passMatch === "yes"
          ? "rgba(0, 253, 25, 0.5)"
          : passMatch === "no"
          ? "rgba(255, 0, 0, 0.6)"
          : "#ccc",
    };
  };

  return (
    <KeyboardAvoidingView>
      <View
        style={[styles.container, { backgroundColor: dark ? "#000" : "#fff" }]}
      >
        <ThemedView style={styles.content}>
          <Text variant="headlineLarge" style={styles.title}>
            We just sent you an email
          </Text>
          <Text style={styles.description}>
            Enter the code sent to your email and your new password.
          </Text>
          <View style={styles.inputContainer}>
            {!inputCode ? (
              <View>
                <TextInput
                  value={code}
                  placeholder="123456"
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    {
                      fontSize: 24,
                      letterSpacing: 10,
                    },
                  ]}
                />
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                <Text
                  variant="labelSmall"
                  style={{
                    textAlign: "right",
                    position: "absolute",
                    bottom: -20,
                    right: 10,
                    color:
                      passMatch === "yes"
                        ? "rgba(0, 166, 87, 0.6)"
                        : passMatch === "no"
                        ? "rgba(235, 0, 0, 0.71)"
                        : "transparent",
                  }}
                >
                  {passMatch === "yes"
                    ? "password matches"
                    : passMatch === "no"
                    ? "Password does not match"
                    : "transparent"}
                </Text>
                <TextInput
                  style={getInputStyle("new")}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                />
                <TextInput
                  style={getInputStyle("confirm")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                />
              </View>
            )}

            <Button
              onPress={() => {
                if (!inputCode) {
                  if (code && code.length === 6) {
                    setLoading(true);
                    setTimeout(() => {
                      setInputCode(true);
                      setLoading(false);
                    }, 700);
                  } else {
                    Alert.alert(
                      "",
                      "Enter the code sent to your email to continue."
                    );
                  }
                } else {
                  onResetPasswordPress();
                }
              }}
              loading={loading}
              title="Continue"
              style={{ marginTop: 24 }}
              disabled={
                !code || code.length !== 6 || (inputCode && passMatch !== "yes")
              }
            />
          </View>

          {!inputCode && (
            <>
              <Button
                onPress={() => router.push("/forgot-password")}
                title="Resend Code"
                variant="ghost"
              />
              <Button
                onPress={() => router.push("/login")}
                title="Back to Login"
                variant="ghost"
              />
            </>
          )}
        </ThemedView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get("window").height,
  },
  content: {
    gap: 20,
    padding: 16,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  title: {
    fontWeight: "700",
    fontFamily: "OpenSans",
  },
  description: {
    marginBottom: 20,
    paddingRight: 10,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    overflow: "hidden",
    paddingHorizontal: 24,
    height: 52,
    borderWidth: 0.3,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});
