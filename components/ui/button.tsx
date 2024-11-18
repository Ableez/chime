import React from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  View,
  type FlexAlignType,
} from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import PaperIcon from "./paper-icon";
import { IconSourceNames } from "@/type";

type ButtonVariant =
  | "default"
  | "outline"
  | "destructive"
  | "destructive_outline"
  | "destructive_ghost"
  | "ghost";

type ButtonAlignment =
  | "flex-start"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "center"
  | "space-evenly";

interface ButtonProps {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  variant?: ButtonVariant;
  icon?: React.ReactNode | IconSourceNames;
  align?: ButtonAlignment;
  iconPosition?: "right" | "left";
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  style,
  disabled = false,
  loading = false,
  title,
  icon,
  align,
  variant = "default",
  iconPosition,
}) => {
  const { dark } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      height: 42,
      flex: 1,
      justifyContent: align ? align : icon && title ? "flex-start" : "center",
      alignItems: (align as FlexAlignType | undefined) ?? "center",
      opacity: loading || disabled ? 0.7 : 1,
      flexDirection: icon && title ? "row" : "column",
      paddingHorizontal: 16,
      gap: 8,
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      default: { backgroundColor: dark ? "#006eed" : "#007eed" },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.3)",
      },
      destructive: { backgroundColor: "#eb0000" },
      destructive_outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "rgba(250,0,0,0.3)",
      },
      destructive_ghost: { backgroundColor: dark ? "#000" : "#fff" },
      ghost: { backgroundColor: dark ? "#000" : "#fff" },
    };

    return { ...baseStyle, ...variantStyles[variant] };
  };

  const getColor = (): string => {
    const colors: Record<ButtonVariant, string> = {
      default: "#fff",
      outline: dark ? "#fff" : "#000",
      destructive: "#fff",
      destructive_outline: "#eb0000",
      destructive_ghost: "#eb0000",
      ghost: dark ? "#fff" : "#000",
    };
    return colors[variant];
  };

  const getRippleColor = (): string => {
    const rippleColors: Record<ButtonVariant, string> = {
      default: dark ? "#ddd" : "#009eed",
      outline: dark ? "#222" : "rgba(0,0,0,0.06)",
      destructive: dark ? "#222" : "rgba(250,0,0,0.06)",
      destructive_outline: dark ? "#222" : "rgba(250,0,0,0.06)",
      destructive_ghost: dark ? "#222" : "rgba(250,0,0,0.06)",
      ghost: dark ? "#222" : "rgba(0,0,0,0.06)",
    };
    return rippleColors[variant];
  };

  const renderIcon = () => {
    const color = getColor();
    if (icon && typeof icon === "string") {
      return (
        <PaperIcon size={20} source={icon as IconSourceNames} color={color} />
      );
    }
    return icon;
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getColor()} animating={true} />;
    }

    return (
      <>
        {iconPosition === "left" && renderIcon()}
        {!iconPosition && renderIcon()}
        {title && (
          <Text variant="titleSmall" style={{ color: getColor() }}>
            {title}
          </Text>
        )}
        {iconPosition === "right" && renderIcon()}
        <Text>{children}</Text>
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        android_ripple={{ color: getRippleColor() }}
        style={getVariantStyles()}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {renderContent()}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
  },
});

export default Button;
