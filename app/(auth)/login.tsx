import {
  TextInput,
  View,
  Pressable,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import {
  isClerkAPIResponseError,
  useSession,
  useSignIn,
} from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Text, useTheme } from "react-native-paper";
import React, { useCallback, useEffect, useState } from "react";
import AsteriskIcon from "@/components/asterisk";
import Button from "@/components/ui/button";

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const { isSignedIn } = useSession();

  useEffect(() => {
    if (isSignedIn) {
      router.navigate("/");
    }
  }, [isSignedIn, router]);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.navigate("/");
      } else {
        Alert.alert(
          "Login Error",
          "Unable to log in. Please check your credentials."
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        err.errors.map((e) => {
          Alert.alert("", e.message, undefined, { cancelable: true });
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <KeyboardAvoidingView>
      <View
        style={{
          minHeight: Dimensions.get("window").height,
          backgroundColor: dark ? "#000" : "#fff",
        }}
      >
        <AsteriskIcon />
        <ThemedView
          style={{
            gap: 12,
            padding: 16,
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
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
                source={require("@/assets/images/google.png")}
                width={30}
                height={30}
                style={{ width: 30, height: 30, borderRadius: 100 }}
              />
              <Text
                variant="titleSmall"
                style={{ color: dark ? "#000" : "#333" }}
              >
                Sign in with Google
              </Text>
            </Pressable>
          </View>
          <Text style={{ marginVertical: 16, textAlign: "center" }}>Or</Text>
          <View style={{ gap: 12 }}>
            <TextInput
              style={{
                overflow: "hidden",
                paddingHorizontal: 24,
                height: 52,
                borderWidth: 0.3,
                borderColor: "#ccc",
                borderRadius: 10,
              }}
              autoCapitalize="none"
              cursorColor={dark ? "#fff" : "#000"}
              importantForAutofill="yes"
              autoComplete="email"
              value={emailAddress}
              enterKeyHint="next"
              placeholder="you@mail.com"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
            />
            <TextInput
              style={{
                overflow: "hidden",
                paddingHorizontal: 24,
                height: 52,
                borderWidth: 0.3,
                borderColor: "#ccc",
                borderRadius: 10,
              }}
              autoComplete="password"
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              enterKeyHint="send"
              onChangeText={setPassword}
            />
            <Button onPress={onSignInPress} loading={loading} title="Login" />
          </View>
          <Button
            onPress={() => router.navigate("/register")}
            title="Don't have an account? Sign up"
            variant="ghost"
          />
          <Button
            onPress={() => router.push("/forgot-password")}
            variant="ghost"
            title="Forgot password?"
          />
        </ThemedView>
      </View>
    </KeyboardAvoidingView>
  );
}
