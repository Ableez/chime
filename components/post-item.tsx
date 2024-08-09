import { EllipsisVertical } from "lucide-react-native";
import React, { memo } from "react";
import { Image, Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import PostMedia from "./post-media";
import { MediaType, PostType } from "@/utils/th";
import PostActions from "./post-actions";
import { formatChatTime } from "@/utils/timeFormater";
import { UserType } from "@/utils/user";

type Props = {
  user: UserType;
  item: PostType;
};

const PostItem = memo(({ item, user }: Props) => {
  const { colors, dark } = useTheme();
  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: dark ? "#222" : "#EAEAEA",
        gap: 24,
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
            <Image
              source={{ uri: user?.profilePicture }}
              style={{ width: 44, height: 44, borderRadius: 100 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
                gap: 8,
              }}
            >
              <Text variant="titleMedium">{user?.username}</Text>
              <Text variant="bodySmall">{formatChatTime(item.createdAt)}</Text>
            </View>
          </View>

          <Pressable>
            <EllipsisVertical size={18} color={colors.onBackground} />
          </Pressable>
        </View>
        <View style={{ paddingLeft: 54, paddingRight: 10, gap: 24 }}>
          <Text variant="bodyMedium">
            {item.caption?.plainText ? item.caption.plainText : "Wassup"}
          </Text>
        </View>
      </View>

      {item.media ? <PostMedia item={item.media as MediaType[]} /> : null}
      <PostActions />
    </View>
  );
});

export default PostItem;
