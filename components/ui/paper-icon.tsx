import React from "react";
import { Icon, useTheme } from "react-native-paper";
import { IconSourceNames } from "@/type";

const PaperIcon = ({
  source,
  color,
  size,
}: {
  source: IconSourceNames;
  color?: string;
  size?: number;
}) => {
  const { colors } = useTheme();
  return (
    <Icon
      size={size ?? 24}
      source={source}
      color={color ?? colors.onBackground}
      allowFontScaling={true}
    />
  );
};

export default PaperIcon;
