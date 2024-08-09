import { useState, useEffect, useCallback } from "react";
import { Keyboard } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { BACKEND_ENDPOINT } from "@/constants/Colors";
import { uploadFile } from "@/utils/helpers/uploadFile";

export const useNewPostLogic = () => {
  const [selectedImages, setSelectedImages] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);
  const [postText, setPostText] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { todo } = useLocalSearchParams();
  const { user } = useUser();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (todo === "upload_image") {
      handleImagePick();
    } else if (todo === "open_camera") {
      handleCameraLaunch();
    }
  }, [todo]);

  const handleImagePick = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      orderedSelection: true,
      base64: true,
      quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
    });

    if (!result.canceled && selectedImages.length < 5) {
      setSelectedImages((prev) => [...prev, ...result.assets].slice(0, 5));
    }
  }, [selectedImages]);

  const handleCameraLaunch = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      orderedSelection: true,
      base64: true,
      quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
    });

    if (!result.canceled && selectedImages.length < 5) {
      setSelectedImages((prev) => [...prev, result.assets[0]!].slice(0, 5));
    }
  }, [selectedImages]);

  const removeImage = useCallback((uri: string) => {
    setSelectedImages((prev) => prev.filter((image) => image.uri !== uri));
  }, []);

  const createPostMutation = useMutation({
    mutationFn: async (images: string[]) => {
      const response = await fetch(`${BACKEND_ENDPOINT}/trpc/post.create`, {
        body: JSON.stringify({
          userId: user?.id,
          postText: postText,
          images,
        }),
        method: "POST",
      });
      if (!response.ok) {
        console.log(await response.json());
      }
      return response.json();
    },
  });

  const handlePost = async () => {
    if (!postText && selectedImages.length === 0) {
      return;
    }
    const imagesUrl: string[] = [];

    for (let idx = 0; idx < selectedImages.length; idx++) {
      const media = selectedImages[idx];

      if (!media?.base64) {
        console.log("[ERROR]🐞", "BASE64 NULL");
        return;
      }

      try {
        const url = await uploadFile({
          uid: user?.id,
          bucket: "post_images",
          media: media,
        });

        if (url) imagesUrl.push(url);
      } catch (err) {
        console.error(JSON.stringify(err));
      }
    }

    try {
      const create = await createPostMutation.mutateAsync(imagesUrl);

      console.log(create);

      if (create.result.data.statusCode === "201") {
        setPostText("");
        setSelectedImages([]);
        router.replace("/");
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      console.error(error);
    }
  };

  return {
    user,
    postText,
    selectedImages,
    keyboardVisible,
    handleImagePick,
    handleCameraLaunch,
    removeImage,
    handlePost,
    createPostMutation,
    setPostText,
  };
};
