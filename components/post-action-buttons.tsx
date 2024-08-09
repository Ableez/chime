import React from "react";
import { View, Pressable } from "react-native";
import { Images, Camera } from "lucide-react-native";
import { useStyles } from "@/utils/styles/style";

interface ActionButtonsProps {
  handleImagePick: () => void;
  handleCameraLaunch: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleImagePick,
  handleCameraLaunch,
}) => {
  const { postStyles } = useStyles();
  return (
    <View style={postStyles.actionContainer}>
      <Pressable onPress={handleImagePick} style={postStyles.actionButton}>
        <Images size={32} strokeWidth={1.5} color="#ccc" opacity={0.67} />
      </Pressable>
      <Pressable onPress={handleCameraLaunch} style={postStyles.actionButton}>
        <Camera size={32} strokeWidth={1.5} color="#ccc" opacity={0.67} />
      </Pressable>
    </View>
  );
};
