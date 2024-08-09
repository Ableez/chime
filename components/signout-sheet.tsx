import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Button from "./ui/button";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useAuth } from "@clerk/clerk-expo";

type Props = {};

const SignoutSheet = (props: Props) => {
  const signoutSheetRef = useRef<BottomSheetModal>(null);
  const { signOut } = useAuth();

  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <Button
        variant="destructive_ghost"
        title="Sign out"
        onPress={() => signoutSheetRef.current?.present()}
      />

      <BottomSheetModal
        ref={signoutSheetRef}
        index={0}
        snapPoints={["70%"]}
        animateOnMount={true}
        enablePanDownToClose={true}
      >
        <BottomSheetView
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <Text variant="headlineSmall">Are you sure?</Text>
            </View>

            <View style={{ gap: 8 }}>
              <Button
                variant="destructive_outline"
                onPress={() => signOut({ redirectUrl: "/login" })}
                title={"Yes sign out"}
              />
              <Button
                variant="ghost"
                onPress={() => signoutSheetRef.current?.close()}
                title={"Close"}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default SignoutSheet;

const styles = StyleSheet.create({
  container: {
    gap: 38,
    padding: 16,
    paddingTop: 40,
    height: "100%",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 0.4,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lastInputContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  firstInputContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  label: {
    color: "#444",
    fontSize: 12,
  },
  input: {
    fontSize: 17,
  },
  backButton: {
    padding: 12,
    borderRadius: 100,
    position: "absolute",
    top: 8,
    left: 16,
    backgroundColor: "#fff",
  },
});
