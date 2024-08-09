import React, { useEffect, useRef } from "react";
import { usePostsStore } from "@/store/zustand";
import { Asterisk } from "lucide-react-native";
import { View, Animated, Easing } from "react-native";
import { useTheme } from "react-native-paper";

const HeadLogo = () => {
  const { dark } = useTheme();
  const { isPosting } = usePostsStore();
  // const isPosting = true;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation: Animated.CompositeAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.elastic(0.4),
        useNativeDriver: true,
      })
    );

    if (isPosting) {
      animation.start();
    } else {
      spinValue.setValue(0);
      animation.stop();
    }

    return () => {
      animation.stop();
    };
  }, [isPosting, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Asterisk size={68} color={dark ? "#fff" : "#000"} />
      </Animated.View>
    </View>
  );
};

export default HeadLogo;
