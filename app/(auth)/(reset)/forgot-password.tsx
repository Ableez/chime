import React, { useState, useCallback } from "react";
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

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const onResetPasswordPress = useCallback(async () => {
    if (!isLoaded) return;
    if (!emailAddress) {
      Alert.alert("", "Please enter your email address first");
      return;
    }

    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      // Alert.alert(
      //   "Password Reset Email Sent",
      //   "Please check your email for instructions to reset your password.",
      //   [{ text: "OK", onPress: () => router.push("/enter-reset-code") }]
      // );

      router.push("/enter-reset-code");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, emailAddress, signIn, router]);

  return (
    <KeyboardAvoidingView>
      <View
        style={[styles.container, { backgroundColor: dark ? "#000" : "#fff" }]}
      >
        {/* <AsteriskIcon /> */}
        <ThemedView style={styles.content}>
          <Text variant="displayMedium" style={styles.title}>
            Forgot Password
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: dark ? "#cccc" : "#666",
              },
            ]}
          >
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              cursorColor={dark ? "#fff" : "#000"}
              importantForAutofill="yes"
              autoComplete="email"
              value={emailAddress}
              enterKeyHint="send"
              placeholder="you@mail.com"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
            />
            <Button
              onPress={onResetPasswordPress}
              loading={loading}
              title="Reset Password"
            />
          </View>
          <Button
            onPress={() => router.push("/login")}
            title="Back to Login"
            variant="ghost"
          />
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
    fontWeight: "800",
  },
  description: {
    marginBottom: 20,
    paddingRight: 28,
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
