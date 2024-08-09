import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const convertToWebPAndBlob = async (
  uri: string,
  type: string,
  mime: string
) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      console.error("File does not exist:", uri);
      return null;
    }

    if (type === "image") {
      // Convert image to WebP
      const manipulateResult = await ImageManipulator.manipulateAsync(
        uri,
        [], // no additional manipulations
        { format: ImageManipulator.SaveFormat.WEBP }
      );

      // Read the WebP file
      const content = await FileSystem.readAsStringAsync(manipulateResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = new Blob([content], { type: "image/webp" });
      return blob;
    } else if (type === "video") {
      // For videos, we'll keep the original format
      const content = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = new Blob([content], { type: mime });
      return blob;
    }
  } catch (error) {
    console.error("Error converting file to WebP and blob:", error);
    return null;
  }
};
