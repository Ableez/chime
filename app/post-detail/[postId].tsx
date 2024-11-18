import { Image, Pressable, TouchableOpacity, View } from "react-native";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import { useAuth } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { formatChatTime } from "@/utils/timeFormater";
import { Ellipsis } from "lucide-react-native";
import PostMedia from "@/components/post-media";
import { Media } from "@/new-types";
import PostActions from "@/components/post-actions";
import { usePostsStore } from "@/store/zustand";
import { ThemedView } from "@/components/ThemedView";
import PaperIcon from "@/components/ui/paper-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const PostDetail = () => {
  const { colors, dark } = useTheme();
  const { userId } = useAuth();
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const { posts } = usePostsStore();
  const currPost = posts?.find((p) => p.post.id === postId);

  if (!currPost) {
    return (
      <ThemedView style={{ padding: 36 }}>
        <Text>Post not found</Text>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: dark ? "#000" : "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity style={{ padding: 14 }} onPress={() => router.back()}>
          <PaperIcon source={"arrow-left"} />
        </TouchableOpacity>

        {/* #TODO: WHATSAPP DM FEATURE */}
        <TouchableOpacity style={{ padding: 14 }}>
          <PaperIcon source={"send"} />
        </TouchableOpacity>
      </View>
      <ThemedView
        style={{
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: dark ? "#222" : "#EAEAEA",
          gap: 18,
        }}
      >
        <View
          style={{
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              maxWidth: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  currPost.user.id === userId
                    ? router.push(`/profile`)
                    : router.push(`/profile/${currPost.user.id}`);
                }}
              >
                <Image
                  source={{ uri: currPost.user.profilePicture }}
                  style={{ width: 36, height: 36, borderRadius: 100 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                  gap: 8,
                }}
              >
                <Text variant="titleMedium">{currPost.user?.username}</Text>
                <Text variant="bodySmall">
                  {formatChatTime(currPost.post.createdAt)}
                </Text>
              </View>
            </View>

            <Pressable>
              <Ellipsis size={18} color={colors.onBackground} />
            </Pressable>
          </View>
          {currPost.post.postText && (
            <View style={{ paddingLeft: 54, paddingRight: 10, gap: 24 }}>
              <Text variant="bodyMedium">{currPost.post.postText}</Text>
            </View>
          )}
        </View>

        {currPost.media ? <PostMedia item={currPost.media as Media[]} /> : null}
        <PostActions item={currPost} />
      </ThemedView>
      <ThemedView style={{ padding: 14 }}>
        <Text variant="titleSmall">Comments</Text>
      </ThemedView>
    </SafeAreaView>
  );
};

export default PostDetail;
