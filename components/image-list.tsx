import React from "react";
import { FlatList, View, Image, Pressable } from "react-native";
import { X } from "lucide-react-native";
import { Video, ResizeMode } from "expo-av";
import { ImagePickerAsset } from "expo-image-picker";
import { useStyles } from "@/utils/styles/style";

interface ImageListProps {
  selectedImages: ImagePickerAsset[];
  removeImage: (uri: string) => void;
}

export const ImageList: React.FC<ImageListProps> = ({
  selectedImages,
  removeImage,
}) => {
  const { postStyles } = useStyles();

  const renderImage = ({ item }: { item: ImagePickerAsset }) =>
    item.type === "image" ? (
      <View style={postStyles.imageContainer}>
        <Image source={{ uri: item.uri }} style={postStyles.image} />
        <Pressable
          style={postStyles.removeButton}
          onPress={() => removeImage(item.uri)}
        >
          <X size={16} color="#fff" />
        </Pressable>
      </View>
    ) : (
      <View style={postStyles.videoContainer}>
        <Video
          source={{ uri: item.uri }}
          style={postStyles.video}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
          isMuted
        />
        <Pressable
          style={postStyles.removeButton}
          onPress={() => removeImage(item.uri)}
        >
          <X size={16} color="#fff" />
        </Pressable>
      </View>
    );

  return (
    <FlatList
      data={selectedImages}
      keyExtractor={(item) => item.uri}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={postStyles.imageList}
      renderItem={renderImage}
    />
  );
};
