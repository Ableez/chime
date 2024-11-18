import AsteriskIcon from "@/components/asterisk";
import { Header } from "@/components/create-post-header";
import { ImageList } from "@/components/image-list";
import LoginSheet from "@/components/login-sheet";
import { ActionButtons } from "@/components/post-action-buttons";
import { PostButton } from "@/components/post-button";
import { Content } from "@/components/post-content";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import { useNewPostLogic } from "@/hook/useNewPostLogic";
import { useStyles } from "@/utils/styles/style";
import { useAuth } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import React, { useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const NewPost: React.FC = () => {
  const {
    user,
    postText,
    selectedImages,
    keyboardVisible,
    handleImagePick,
    handleCameraLaunch,
    removeImage,
    handlePost,
    createPostMutation,
    setPostText,
  } = useNewPostLogic();

  const { isSignedIn, isLoaded, signOut } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { postStyles } = useStyles();

  return (
    <SafeAreaView style={postStyles.safeArea}>
      {isSignedIn && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={postStyles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
        >
          <Header />
          <View>
            <Content
              user={user}
              postText={postText}
              setPostText={setPostText}
            />

            <ImageList
              selectedImages={selectedImages}
              removeImage={removeImage}
            />
            <ActionButtons
              handleImagePick={handleImagePick}
              handleCameraLaunch={handleCameraLaunch}
            />
          </View>
          <PostButton
            keyboardVisible={keyboardVisible}
            handlePost={handlePost}
            isDisabled={!postText && selectedImages.length === 0}
            isPending={createPostMutation.isPending}
          />
        </KeyboardAvoidingView>
      )}

      {isLoaded && !isSignedIn && (
        <View>
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.navigate("/")
            }
            style={postStyles.backButton}
          >
            <X size={26} color={"#000"} />
          </Pressable>
          <ThemedView
            style={{
              height: Dimensions.get("window").height,
              padding: 16,
              gap: 24,
              paddingTop: 84,
            }}
          >
            <AsteriskIcon />
            <Text
              variant="displayMedium"
              style={{ textAlign: "center", fontWeight: "700" }}
            >
              Sign in to your account
            </Text>

            <Button
              onPress={() => {
                router.navigate("/login");
                signOut();
              }}
              title="Sign in"
              style={{ marginTop: 32 }}
            />
          </ThemedView>

          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.navigate("/")
            }
            style={postStyles.backButton}
          >
            <X size={26} color={"#000"} />
          </Pressable>
          <View
            style={{
              padding: 10,
              flex: 1,
              alignItems: "center",
              gap: 32,
            }}
          >
            <Text variant="displayMedium">Sign in to post</Text>
            <Button
              title="Login"
              onPress={() => bottomSheetRef.current?.present()}
            />
          </View>
        </View>
      )}
      <LoginSheet bottomSheetRef={bottomSheetRef} />
    </SafeAreaView>
  );
};

export default NewPost;
