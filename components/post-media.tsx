import { Media } from "@/new-types";
import { shrinkSizeNumber } from "@/utils/helpers/shrinkImage";
import { memo } from "react";
import { FlatList, Image, ListRenderItem, View } from "react-native";

const PostMedia = ({ item }: { item: Media[] }) => {
  const MemoizedMedia = memo(
    ({ item, index }: { item: Media; index: number }) => {
      if ("image" === "image") {
        // replace with "item.type" if video is integrated
        return (
          <View
            style={{
              width: shrinkSizeNumber([
                parseInt(item.originalWidth) < 1000
                  ? parseInt(item.originalWidth) - 70
                  : parseInt(item.originalWidth),
                parseInt(item.originalHeight),
              ])[0],
              height:
                shrinkSizeNumber([
                  parseInt(item.originalWidth),
                  parseInt(item.originalHeight),
                ])[1] || 500,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
              borderRadius: 14,
              overflow: "hidden",
              aspectRatio:
                parseInt(item.originalWidth) / parseInt(item.originalHeight),
            }}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 14,
                borderWidth: 0.4,
                borderColor: "#ccc",
              }}
              source={{
                uri: item.url,
              }}
            />
          </View>
        );
      }
      // if (item.type === "video") {
      //   return (
      //     <View
      //       style={{
      //         width: 280,
      //         height: 280,
      //         alignItems: "center",
      //         justifyContent: "center",
      //         marginRight: 16,
      //         borderRadius: 28,
      //       }}
      //     >
      //       {/* <Video
      //         ref={video}
      //         source={{
      //           uri: "https://rylrfqafxnyqkktzpdcr.supabase.co/storage/v1/object/public/buck/videos/rc04.mp4",
      //         }}
      //         useNativeControls
      //         resizeMode={ResizeMode.CONTAIN}
      //         isLooping
      //         onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      //         onError={(e) => console.error("ERROR PLAYING VIDEO", e)}
      //       /> */}
      //     </View>
      //   );
      // }
    }
  );

  const renderMedia: ListRenderItem<Media> = ({ item, index }) => (
    <MemoizedMedia item={item} index={index} />
  );

  return (
    <FlatList
      horizontal
      data={item}
      contentContainerStyle={{
        paddingLeft: 68,
      }}
      scrollEnabled={true}
      keyExtractor={(e) => e.id}
      renderItem={renderMedia}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default PostMedia;
