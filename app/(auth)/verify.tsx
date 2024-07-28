import { ThemedView } from "@/components/ThemedView";
import {
  PENDING_EMAIL_VERIFICATION_DATA_KEY,
  PENDING_EMAIL_VERIFICATION_KEY,
  SIGNUP_OBJECT_KEY,
} from "@/constants/AsyncStorageKeys";
import { useSession, useSignUp } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, TextInput, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

type Props = {};

const VerifyEmail = (props: Props) => {
  const { dark, colors } = useTheme();
  const { isLoaded, setActive, signUp } = useSignUp();
  const [{ emailAddress, username, password }, setFormData] = useState({
    username: "",
    emailAddress: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [resendTimer, setResendTimer] = useState(0);
  const { session } = useSession();

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // AsyncStorage business
  useEffect(() => {
    const fn = async () => {
      const awaitingVerification = await AsyncStorage.getItem(
        PENDING_EMAIL_VERIFICATION_KEY
      );

      if (awaitingVerification) {
        const awaitingVerificationData = await AsyncStorage.getItem(
          PENDING_EMAIL_VERIFICATION_DATA_KEY
        );

        if (awaitingVerificationData) {
          const { username, password, emailAddress } = JSON.parse(
            awaitingVerificationData
          ) as {
            username: string;
            emailAddress: string;
            password: string;
          };

          setFormData({ username, password, emailAddress });
        }
      }
    };

    fn();
  }, []);

  // useEffect(() => {
  //   if (signUp?.status === null || signUp?.status === "abandoned") {
  //     return router.back();
  //   }
  // }, []);

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      console.log(signUp.status);

      if (
        signUp.status === "abandoned" ||
        signUp.status === "missing_requirements"
      ) {
        // const completeSignUp = await signUp.create({
        //   emailAddress: emailAddress,
        //   password: password,
        // });

        console.log("CODE", code);

        await signUp.attemptEmailAddressVerification({
          code,
        });

        if (username) {
          await signUp.update({ username: username });
        }

        await setActive({ session: signUp.createdSessionId });

        await AsyncStorage.removeItem(PENDING_EMAIL_VERIFICATION_KEY);
        await AsyncStorage.removeItem(PENDING_EMAIL_VERIFICATION_DATA_KEY);
        await AsyncStorage.removeItem(SIGNUP_OBJECT_KEY);
        router.replace("/");
      }
    } catch (err) {
      console.error(err);

      Alert.alert("Error", "Error during verification pro");
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

  //   return (
  //     <View>
  //       <ThemedView style={{ padding: 16, gap: 24 }}>
  //         <View>
  //           <Text variant="displayMedium" style={{ fontWeight: "600" }}>
  //             6-digit code
  //           </Text>
  //           <Text variant="bodyMedium">
  //             Please enter the code we've sent to{" "}
  //             <Text variant="labelLarge">{emailAddress}</Text> to confirm your
  //             account
  //           </Text>
  //         </View>
  //         <TextInput
  //           value={code}
  //           placeholder="123456"
  //           onChangeText={setCode}
  //           keyboardType="number-pad"
  //           style={{
  //             height: 54,
  //             paddingHorizontal: 16,
  //             borderWidth: 0.4,
  //             borderColor: "#ccc",
  //             fontSize: 24,
  //             letterSpacing: 10,
  //             borderRadius: 16,
  //             width: "100%",
  //           }}
  //         />
  //         <View
  //           style={{
  //             borderRadius: 20,
  //             overflow: "hidden",
  //             width: "100%",
  //           }}
  //         >
  //           <Pressable
  //             android_ripple={{ color: dark ? "#ddd" : "#009eed" }}
  //             style={{
  //               backgroundColor: dark ? "#fff" : "#007eed",
  //               borderRadius: 20,
  //               width: "100%",
  //               height: 50,
  //               justifyContent: "center",
  //               alignItems: "center",
  //               opacity: loading ? 0.7 : 1,
  //             }}
  //             onPress={onPressVerify}
  //             disabled={loading}
  //           >
  //             {loading ? (
  //               <ActivityIndicator color="#fff" animating={true} />
  //             ) : (
  //               <Text
  //                 variant="titleSmall"
  //                 style={{ color: dark ? "#000" : "#fff" }}
  //               >
  //                 Confirm
  //               </Text>
  //             )}
  //           </Pressable>
  //         </View>
  //         <Text variant="bodyMedium" style={{ marginTop: 20 }}>
  //           Didn't receive the code?
  //         </Text>
  //         <View
  //           style={{
  //             borderRadius: 20,
  //             overflow: "hidden",
  //             width: "100%",
  //           }}
  //         >
  //           <Pressable
  //             android_ripple={{ color: dark ? "#333" : "#ddd" }}
  //             style={{
  //               backgroundColor: dark ? "#000" : "#fff",
  //               borderRadius: 20,
  //               width: "100%",
  //               height: 50,
  //               justifyContent: "center",
  //               alignItems: "center",
  //               borderWidth: 1,
  //               borderColor: dark ? "#333" : "#EDF1FF",
  //               opacity: resendTimer > 0 || loading ? 0.5 : 1,
  //             }}
  //             onPress={handleResendCode}
  //             disabled={resendTimer > 0 || loading}
  //           >
  //             <Text
  //               variant="titleSmall"
  //               style={{ color: dark ? "#fff" : "#000" }}
  //             >
  //               {resendTimer > 0
  //                 ? `Resend code (${resendTimer}s)`
  //                 : "Resend code"}
  //             </Text>
  //           </Pressable>
  //         </View>
  //       </ThemedView>
  //     </View>
  //   );
};

export default VerifyEmail;
