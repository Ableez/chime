import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
  const { dark } = useTheme();

  const postStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: dark ? "#000" : "#fff",
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    backButton: {
      padding: 8,
      marginLeft: 10,
    },
    headerTitle: {
      fontWeight: "700",
    },
    scrollViewContent: {
      paddingBottom: 100, // Ensure space for the post button
    },
    contentContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 12,
    },
    profilePic: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    inputContainer: {
      flex: 1,
    },
    characterCount: {
      fontSize: 10,
      color: "#999",
      alignSelf: "flex-end",
    },
    characterCountExceeded: {
      color: "#eb0000",
    },
    input: {
      fontWeight: "400",
      fontSize: 16,
      paddingVertical: 8,
      color: dark ? "#fff" : "#000",
    },
    imageList: {
      paddingLeft: 72,
      paddingTop: 16,
    },
    imageContainer: {
      width: 200,
      height: 300,
      borderRadius: 16,
      marginRight: 16,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "#ccc",
    },
    removeButton: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 12,
      padding: 4,
    },
    actionContainer: {
      paddingLeft: 68,
      paddingTop: 16,
      flexDirection: "row",
    },
    actionButton: {
      padding: 8,
    },
    postButtonContainer: {
      position: "absolute",
      bottom: 20,
      left: 16,
      right: 16,
    },
    postButtonContainerKeyboardVisible: {
      bottom: 5,
    },
    postButton: {
      backgroundColor: "#007eed",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 24,
      alignItems: "center",
      width: "50%",
      alignSelf: "flex-end",
    },
    postButtonText: {
      color: "#fff",
      fontWeight: "600",
    },
    videoContainer: {
      width: 200,
      height: 300,
      marginRight: 16,
      overflow: "hidden",
    },
    video: {
      width: 200,
      height: 300,
      aspectRatio: 2 / 3,
      backgroundColor: "#000",
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "#ccc",
    },
    inputHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  return { postStyles };
};
