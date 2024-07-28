import React from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  View,
} from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

type ButtonVariant =
  | "default"
  | "outline"
  | "destructive"
  | "destructive_outline"
  | "destructive_ghost"
  | "ghost";

interface ButtonProps {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  style,
  disabled,
  loading,
  title,
  variant = "default",
}) => {
  const { dark } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 20,
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      opacity: loading || disabled ? 0.7 : 1,
    };

    switch (variant) {
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.3)",
        };
      case "destructive":
        return {
          ...baseStyle,
          backgroundColor: "#eb0000",
        };
      case "destructive_outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "rgba(250,0,0,0.3)",
        };
      case "destructive_ghost":
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: dark ? "#000" : "#fff",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: dark ? "#006eed" : "#007eed",
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case "outline":
        return dark ? "#fff" : "#000";
      case "destructive":
        return "#fff";
      case "destructive_outline":
      case "destructive_ghost":
        return "#eb0000";
      case "ghost":
        return dark ? "#fff" : "#000";
      default:
        return "#fff";
    }
  };

  const getRippleColor = (): string => {
    switch (variant) {
      case "outline":
        return dark ? "#222" : "rgba(0,0,0,0.06)";
      case "destructive":
      case "destructive_outline":
      case "destructive_ghost":
        return dark ? "#222" : "rgba(250,0,0,0.06)";
      case "ghost":
        return dark ? "#222" : "rgba(0,0,0,0.06)";
      default:
        return dark ? "#ddd" : "#009eed";
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        android_ripple={{ color: getRippleColor() }}
        style={getVariantStyles()}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} animating={true} />
        ) : (
          <>
            {title && (
              <Text variant="titleSmall" style={{ color: getTextColor() }}>
                {title}
              </Text>
            )}
            {children}
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
});

export default Button;
