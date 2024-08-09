import AsteriskIcon from "@/components/asterisk";
import SignoutSheet from "@/components/signout-sheet";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/button";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MessageCircleMore,
  MessagesSquare,
  Users2Icon,
} from "lucide-react-native";
import React from "react";
import { Dimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {};

const ProfileMenuDrawer = (props: Props) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={{ height: Dimensions.get("window").height, padding: 12 }}
    >
      <View style={{ marginBottom: 44 }}>
        <AsteriskIcon />
      </View>

      <View style={{ marginBottom: 24 }}>
        <Button
          variant="ghost"
          title="Liked"
          icon={<Heart color={colors.onBackground} size={22} />}
        />
        <Button
          variant="ghost"
          title="Saved"
          icon={<Bookmark color={colors.onBackground} size={22} />}
        />
        <Button
          variant="ghost"
          title="Comments"
          icon={<MessagesSquare color={colors.onBackground} size={22} />}
        />
        <Button
          variant="ghost"
          title="Direct Messages"
          icon={<MessageCircle color={colors.onBackground} size={22} />}
        />
        <Button
          variant="ghost"
          title="Your Connections"
          icon={<Users2Icon color={colors.onBackground} size={22} />}
        />
      </View>

      <SignoutSheet />
      <Text variant="bodySmall" style={{ textAlign: "center", marginTop: 44 }}>
        Version 1.92.3
      </Text>
    </ThemedView>
  );
};

export default ProfileMenuDrawer;
