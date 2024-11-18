import { Ellipsis } from "lucide-react-native";
import React, { memo } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import PostMedia from "./post-media";
import PostActions from "./post-actions";
import { formatChatTime } from "@/utils/timeFormater";
import { Media, Timeline } from "@/new-types";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

type Props = {
  item: Timeline;
};

const PostItem = memo(({ item }: Props) => {
  const { colors, dark } = useTheme();
  const { userId } = useAuth();

  return (
    <Pressable onPress={() => router.push(`/post-detail/${item.post.id}`)}>
      <View
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
                  item.user.id === userId
                    ? router.push(`/profile`)
                    : router.push(`/profile/${item.user.id}`);
                }}
              >
                <Image
                  source={{ uri: item.user.profilePicture }}
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
                <Text variant="titleMedium">{item.user?.username}</Text>
                <Text variant="bodySmall">
                  {formatChatTime(item.post.createdAt)}
                </Text>
              </View>
            </View>

            <Pressable>
              <Ellipsis size={18} color={colors.onBackground} />
            </Pressable>
          </View>
          {item.post.postText && (
            <View style={{ paddingLeft: 54, paddingRight: 10, gap: 24 }}>
              <Text variant="bodyMedium">{item.post.postText}</Text>
            </View>
          )}
        </View>

        {item.media ? <PostMedia item={item.media as Media[]} /> : null}
        <PostActions item={item} />
      </View>
    </Pressable>
  );
});

export default PostItem;
