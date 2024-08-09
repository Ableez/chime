import React from "react";
import { View, Image, TextInput } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useStyles } from "@/utils/styles/style";
import { UserResource } from "@/type";

interface ContentProps {
  user: UserResource | null | undefined;
  postText: string;
  setPostText: (text: string) => void;
}

export const Content: React.FC<ContentProps> = ({
  user,
  postText,
  setPostText,
}) => {
  const { dark } = useTheme();
  const { postStyles } = useStyles();

  return (
    <View style={postStyles.contentContainer}>
      <Image source={{ uri: user?.imageUrl }} style={postStyles.profilePic} />
      <View style={postStyles.inputContainer}>
        <View style={postStyles.inputHeader}>
          <Text variant="titleMedium">{user?.username}</Text>
          <Text
            style={[
              postStyles.characterCount,
              postText.trim().length > 249 && postStyles.characterCountExceeded,
            ]}
          >
            {postText.trim().length} / 250
          </Text>
        </View>
        <TextInput
          multiline
          onChangeText={setPostText}
          cursorColor={dark ? "#fff" : "#000"}
          maxLength={250}
          placeholder="What's new?"
          value={postText}
          style={postStyles.input}
          placeholderTextColor={dark ? "#666" : "#ccc"}
        />
      </View>
    </View>
  );
};
