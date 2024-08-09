import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const convertToWebPAndFile = async (
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

    let finalUri = uri;
    let finalMime = mime;

    if (type === "image") {
      // Convert image to WebP
      const manipulateResult = await ImageManipulator.manipulateAsync(
        uri,
        [], // no additional manipulations
        { format: ImageManipulator.SaveFormat.WEBP }
      );
      finalUri = manipulateResult.uri;
      finalMime = "image/webp";
    }

    // Read the file content
    const content = await FileSystem.readAsStringAsync(finalUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert Base64 to ArrayBuffer
    const binaryString = atob(content);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const buffer = bytes.buffer;

    // Create a File object
    const fileName = finalUri.split("/").pop() || "file";
    const file = new File([buffer], fileName, { type: finalMime });

    return file;
  } catch (error) {
    console.error("Error converting file to WebP and File:", error);
    return null;
  }
};

export const convertToWebPAndBlobLike = async (
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

    let finalUri = uri;
    let finalMime = mime;

    if (type === "image") {
      // Convert image to WebP
      const manipulateResult = await ImageManipulator.manipulateAsync(
        uri,
        [], // no additional manipulations
        { format: ImageManipulator.SaveFormat.WEBP }
      );
      finalUri = manipulateResult.uri;
      finalMime = "image/webp";
    }

    // Create a blob-like object
    const blobLike = {
      uri: finalUri,
      name: finalUri.split("/").pop() || "file",
      type: finalMime,
    };

    return blobLike;
  } catch (error) {
    console.error("Error converting file to WebP and blob-like object:", error);
    return null;
  }
};
