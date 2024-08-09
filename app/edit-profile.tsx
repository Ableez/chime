import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";

import { ThemedView } from "@/components/ThemedView";
import { PenSquare } from "lucide-react-native";
import Button from "@/components/ui/button";
import { BACKEND_ENDPOINT } from "@/constants/Colors";
import { blobToDataURL } from "@/utils/helpers/blobtobase64";
import { CUserPublicMetadata } from "@/type";

const EditProfile: React.FC = () => {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const { dark } = useTheme();

  const [userInfo, setUserInfo] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: (user?.publicMetadata.bio as string) || "",
    profilePicture: user?.imageUrl || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate("/login");
    }
  }, []);

  const [originalUserInfo] = useState(userInfo);

  // Check if there are changes
  const hasChanges =
    userInfo.firstName !== originalUserInfo.firstName ||
    userInfo.lastName !== originalUserInfo.lastName ||
    userInfo.username !== originalUserInfo.username ||
    userInfo.bio !== originalUserInfo.bio ||
    userInfo.profilePicture !== originalUserInfo.profilePicture;

  const updateUserPublicMetadataMutation = useMutation({
    mutationFn: async (data: CUserPublicMetadata) => {
      await fetch(`${BACKEND_ENDPOINT}/trpc/user.updatePublicMetadata`, {
        body: JSON.stringify({ userId: user?.id, data }),
        method: "POST",
      });
    },
  });

  const handleInputChange = (field: keyof typeof userInfo, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!user) return;

    if (!hasChanges) return;

    setLoading(true);

    try {
      const updates: Partial<typeof userInfo> = {};
      Object.entries(userInfo).forEach(([key, value]) => {
        if (value !== user[key as keyof typeof user]) {
          updates[key as keyof typeof userInfo] = value;
        }
      });

      if (Object.keys(updates).length > 0) {
        await user.update({
          firstName: updates.firstName,
          lastName: updates.lastName,
          username: updates.username,
        });

        if (userInfo.bio !== originalUserInfo.bio) {
          updateUserPublicMetadataMutation.mutate({ bio: userInfo.bio });
        }

        await user.reload();
        await user.reload();
        await user.reload();

        router.canGoBack() ? router.back() : router.navigate("/");
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const base64 = await blobToDataURL(blob);
        await user?.setProfileImage({ file: base64 });
        await user?.reload();
        if (!result.assets[0]) {
          Alert.alert("", "No image was selected");
          return;
        }
        setUserInfo((prev) => ({
          ...prev,
          profilePicture: result.assets[0]!.uri,
        }));

        router.canGoBack() ? router.back() : router.navigate("/");
      } catch (error) {
        console.error("Error updating profile image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderInput = (label: string, field: keyof typeof userInfo) => (
    <View>
      <Text variant="labelMedium" style={styles.label}>
        {label}
      </Text>
      <TextInput
        value={userInfo[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        style={styles.input}
        cursorColor={dark ? "#fff" : "#000"}
        multiline={field === "bio"}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: dark ? "#000" : "#fff" }]}
    >
      <ScrollView>
        <ThemedView style={styles.content}>
          <View style={styles.card}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: userInfo.profilePicture }}
                style={styles.profileImage}
              />
              <TouchableNativeFeedback onPress={handleUpdateProfilePicture}>
                <View
                  style={{
                    padding: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                  }}
                >
                  <PenSquare size={20} color={"#000"} />
                  <Text>Change Image</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            {renderInput("Username", "username")}
            {renderInput("First Name", "firstName")}
            {renderInput("Last Name", "lastName")}
            {renderInput("Bio", "bio")}
            <Button
              onPress={handleUpdate}
              loading={updateUserPublicMetadataMutation.isPending || loading}
              title="Update"
              disabled={
                updateUserPublicMetadataMutation.isPending || !hasChanges
              }
            />
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  card: {
    padding: 16,
    borderWidth: 0.8,
    borderColor: "#ddd",
    borderRadius: 24,
    gap: 18,
  },
  profileImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  label: { padding: 4 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    fontSize: 16,
  },
});

export default EditProfile;
