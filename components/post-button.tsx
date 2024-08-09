import { useStyles } from "@/utils/styles/style";
import React from "react";
import { View, TouchableHighlight, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";

interface PostButtonProps {
  keyboardVisible: boolean;
  handlePost: () => void;
  isDisabled: boolean;
  isPending: boolean;
}

export const PostButton: React.FC<PostButtonProps> = ({
  keyboardVisible,
  handlePost,
  isDisabled,
  isPending,
}) => {
  const { postStyles } = useStyles();
  return (
    <View
      style={[
        postStyles.postButtonContainer,
        keyboardVisible && postStyles.postButtonContainerKeyboardVisible,
      ]}
    >
      <TouchableHighlight
        activeOpacity={0.6}
        style={postStyles.postButton}
        onPress={handlePost}
        disabled={isDisabled || isPending}
      >
        {isPending ? (
          <ActivityIndicator color={"#fff"} />
        ) : (
          <Text style={postStyles.postButtonText}>Post</Text>
        )}
      </TouchableHighlight>
    </View>
  );
};
