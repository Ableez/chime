import { Slot } from "expo-router";
import React from "react";
import BottomSheetProtectedLayout from "@/components/protected-bottomsheet-layout";

const Screen = () => {
  return <BottomSheetProtectedLayout slot={<Slot />} />;
};

export default Screen;
