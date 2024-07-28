import {
  TextInput,
  View,
  Pressable,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import {
  isClerkAPIResponseError,
  useSession,
  useSignUp,
} from "@clerk/clerk-expo";
import { useCallback, useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "@/env";

import { ThemedView } from "@/components/ThemedView";
import {
  PENDING_EMAIL_VERIFICATION_DATA_KEY,
  PENDING_EMAIL_VERIFICATION_KEY,
  SIGNUP_OBJECT_KEY,
} from "@/constants/AsyncStorageKeys";
import AsteriskIcon from "@/components/asterisk";
import { useMutation } from "@tanstack/react-query";
import { BACKEND_ENDPOINT } from "@/constants/Colors";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useSession();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const [{ emailAddress, username, password }, setFormData] = useState({
    username: "",
    emailAddress: "",
    password: "",
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: {
      userId: string;
      email: string;
      username: string;
    }) => {
      return fetch(
        `${BACKEND_ENDPOINT}/trpc/user.createUser` ||
          "http:localhost:4005/trpc/user.createUser",
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );
    },
  });

  // // AsyncStorage business
  // useEffect(() => {
  //   const fn = async () => {
  //     const awaitingVerification = await AsyncStorage.getItem(
  //       PENDING_EMAIL_VERIFICATION_KEY
  //     );

  //     console.log("[AWAITING VERIFICATION]", awaitingVerification);

  //     const awaitingVerificationData = await AsyncStorage.getItem(
  //       PENDING_EMAIL_VERIFICATION_DATA_KEY
  //     );

  //     if (awaitingVerificationData) {
  //       const { emailAddress } = JSON.parse(awaitingVerificationData) as {
  //         emailAddress: string;
  //       };
  //       if (awaitingVerification) {
  //         Alert.alert(
  //           "Verify your account",
  //           `Seems like you have registered an account here already, is this your email? ${emailAddress}?`,
  //           [
  //             {
  //               text: "No",
  //               style: "cancel",
  //               onPress: async () => {
  //                 await AsyncStorage.removeItem(PENDING_EMAIL_VERIFICATION_KEY);
  //                 await AsyncStorage.removeItem(
  //                   PENDING_EMAIL_VERIFICATION_DATA_KEY
  //                 );
  //                 await AsyncStorage.removeItem(SIGNUP_OBJECT_KEY);
  //               },
  //             },
  //             {
  //               text: "Yes, verify",
  //               onPress: () => router.navigate("/verify"),
  //               isPreferred: true,
  //             },
  //           ]
  //         );
  //       }
  //     }
  //   };

  //   fn();
  // }, []);

  useEffect(() => {
    if (isSignedIn) {
      router.navigate("/");
    }
  }, [isSignedIn, router]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const createUser = await signUp.create({
        emailAddress: emailAddress,
        password: password,
      });

      createUserMutation.mutate({
        email: emailAddress,
        userId: createUser.id || ("user112" as string),
        username: createUser.username || ("user112" as string),
      });

      console.log("[CRDB]", createUserMutation);

      if (createUserMutation.isSuccess) {
        await createUser.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        // setPendingVerification(true);
      } else {
        Alert.alert("", "Something went wrong, please try again");
        console.log(createUserMutation);
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((e) => {
          return Alert.alert(
            "",
            e.code === "form_param_unknown"
              ? "You passed an invalid parameter"
              : e.longMessage,
            undefined,
            { cancelable: true }
          );
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormDataValid = () => {
    return (
      emailAddress.trim() !== "" &&
      username.trim() !== "" &&
      password.trim() !== ""
    );
  };

  const onPressVerify = async () => {
    if (!isLoaded || code.length !== 6) return;
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        await AsyncStorage.multiRemove([
          PENDING_EMAIL_VERIFICATION_KEY,
          PENDING_EMAIL_VERIFICATION_DATA_KEY,
          SIGNUP_OBJECT_KEY,
        ]);

        const createDBuser = await createUserMutation.mutateAsync({
          email: emailAddress,
          userId: completeSignUp.createdUserId as string,
          username: completeSignUp.username as string,
        });

        console.log("[CREATE USER ON DB]", createDBuser);

        Alert.alert("Success", "Your account has been verified!");
        router.replace("/");
      } else {
        Alert.alert("Error", "Verification incomplete. Please try again.");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((e) => {
          Alert.alert(
            "Verification Error",
            e.longMessage || "An unknown error occurred"
          );
        });
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred during verification"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = useCallback(async () => {
    if (!isLoaded || resendTimer > 0) return;
    setLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setResendTimer(60);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signUp, resendTimer]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {!pendingVerification ? (
          <View>
            <View
              style={{
                height: Keyboard.isVisible()
                  ? Dimensions.get("window").height +
                    Keyboard.metrics()?.height!
                  : Dimensions.get("window").height,
                backgroundColor: dark ? "#000" : "#fff",
              }}
            >
              <AsteriskIcon />
              <ThemedView
                style={{
                  gap: 12,
                  padding: 16,
                  justifyContent: "space-between",
                  // flex: 1,
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
                      Continue with Google
                    </Text>
                  </Pressable>
                </View>
                <Text style={{ marginVertical: 16, textAlign: "center" }}>
                  Or
                </Text>
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
                    autoComplete="username"
                    value={username}
                    placeholder="username"
                    enterKeyHint="next"
                    onChangeText={(username) =>
                      setFormData((p) => ({ ...p, username }))
                    }
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
                    autoCapitalize="none"
                    cursorColor={dark ? "#fff" : "#000"}
                    importantForAutofill="yes"
                    autoComplete="email"
                    value={emailAddress}
                    placeholder="you@mail.com"
                    keyboardType="email-address"
                    enterKeyHint="next"
                    onChangeText={(emailAddress) =>
                      setFormData((p) => ({ ...p, emailAddress }))
                    }
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
                    cursorColor={dark ? "#fff" : "#000"}
                    placeholder="Password"
                    secureTextEntry={true}
                    enterKeyHint="go"
                    onChangeText={(password) =>
                      setFormData((p) => ({ ...p, password }))
                    }
                  />
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
                        color: dark ? "#ddd" : "#009eed",
                      }}
                      style={{
                        backgroundColor: dark ? "#fff" : "#007eed",
                        borderRadius: 20,
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        overflow: "hidden",
                        height: 50,
                        alignContent: "center",
                        opacity: loading ? 0.7 : 1,
                      }}
                      onPress={() => {
                        setLoading((p) => !p);
                        onSignUpPress();
                      }}
                      disabled={loading || !isFormDataValid()}
                    >
                      {loading ? (
                        <ActivityIndicator
                          hidesWhenStopped
                          color="#fff"
                          animating={true}
                        />
                      ) : null}
                      {/* {loading ? <Loader2 width={20} color={"#fff"} /> : null} */}
                      <Text
                        variant="titleSmall"
                        style={{ color: dark ? "#000" : "#fff" }}
                      >
                        Sign Up
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "flex-end",
                    marginTop: 20,
                  }}
                >
                  <Pressable
                    android_ripple={{
                      color: dark ? "#333" : "#ddd",
                    }}
                    style={{
                      backgroundColor: dark ? "#000" : "#fff",
                      borderRadius: 20,
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      height: 50,
                      borderWidth: 1,
                      borderColor: dark ? "#333" : "#EDF1FF",
                    }}
                    onPress={() => router.navigate("/login")}
                    disabled={loading}
                  >
                    <Text
                      variant="titleSmall"
                      style={{ color: dark ? "#fff" : "#000" }}
                    >
                      Login
                    </Text>
                  </Pressable>
                </View>
              </ThemedView>
            </View>
          </View>
        ) : (
          <View>
            <ThemedView style={{ padding: 16, gap: 24 }}>
              <View>
                <Text variant="displayMedium" style={{ fontWeight: "600" }}>
                  6-digit code
                </Text>
                <Text variant="bodyMedium">
                  Please enter the code we've sent to{" "}
                  <Text variant="labelLarge">{emailAddress}</Text> to confirm
                  your account
                </Text>
              </View>
              <TextInput
                value={code}
                placeholder="123456"
                onChangeText={setCode}
                keyboardType="number-pad"
                style={{
                  height: 54,
                  paddingHorizontal: 16,
                  borderWidth: 0.4,
                  borderColor: "#ccc",
                  fontSize: 24,
                  letterSpacing: 10,
                  borderRadius: 16,
                  width: "100%",
                }}
              />
              <View
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Pressable
                  android_ripple={{ color: dark ? "#ddd" : "#009eed" }}
                  style={{
                    backgroundColor: dark ? "#fff" : "#007eed",
                    borderRadius: 20,
                    width: "100%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onPress={onPressVerify}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" animating={true} />
                  ) : (
                    <Text
                      variant="titleSmall"
                      style={{ color: dark ? "#000" : "#fff" }}
                    >
                      Confirm
                    </Text>
                  )}
                </Pressable>
              </View>
              <Text variant="bodyMedium" style={{ marginTop: 20 }}>
                Didn't receive the code?
              </Text>
              <View
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <Pressable
                  android_ripple={{ color: dark ? "#333" : "#ddd" }}
                  style={{
                    backgroundColor: dark ? "#000" : "#fff",
                    borderRadius: 20,
                    width: "100%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: dark ? "#333" : "#EDF1FF",
                    opacity: resendTimer > 0 || loading ? 0.5 : 1,
                  }}
                  onPress={handleResendCode}
                  disabled={resendTimer > 0 || loading}
                >
                  <Text
                    variant="titleSmall"
                    style={{ color: dark ? "#fff" : "#000" }}
                  >
                    {resendTimer > 0
                      ? `Resend code (${resendTimer}s)`
                      : "Resend code"}
                  </Text>
                </Pressable>
              </View>
            </ThemedView>
          </View>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
