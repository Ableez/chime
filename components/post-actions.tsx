import { BACKEND_ENDPOINT } from "@/constants/Colors";
import { Timeline } from "@/new-types";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { Bookmark } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import PaperIcon from "./ui/paper-icon";
import { queryClient } from "@/app/_layout";

const PostActions = ({ item }: { item: Timeline }) => {
  const { user } = useUser();
  const isLiked = item.post.likes.find((lik) => lik.userId === user?.id);

  const likeMutation = useMutation({
    mutationKey: ["posts", "timeline"],
    mutationFn: async () => {
      await fetch(
        `${BACKEND_ENDPOINT}/trpc/post.${isLiked ? "unlikePost" : "likePost"}`,
        {
          method: "POST",
          body: isLiked
            ? JSON.stringify({
                likeId: isLiked.id,
              })
            : JSON.stringify({
                postId: item.post.id,
                userId: user?.id,
              }),
        }
      );
    },
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 64,
        paddingRight: 14,
      }}
    >
      <View style={{ flexDirection: "row", gap: 16 }}>
        {/* #TODO: Like, comment, repost, & save feature  */}
        <TouchableOpacity
          onPress={async () => {
            // updatePosts((post) => {
            //   if (!posts) return;

            //   const idx = posts.findIndex(
            //     (pst) => pst.post.id === item.post.id
            //   );

            //   if (!idx) return;

            //   const newlikes = posts[idx]?.post.likes.filter(
            //     (li) => li.userId === user?.id
            //   );

            //   if (!post[idx]) return;

            //   const updatePost: Timeline = {
            //     ...posts[idx],
            //     post: {
            //       ...(posts[idx]?.post as Post),
            //       likes: isLiked
            //         ? (newlikes as Like[])
            //         : [
            //             ...posts[idx]!.post.likes!,
            //             {
            //               id: user?.id || "j9ve09dfv0j0df9jvd9f",
            //               createdAt: new Date().toUTCString(),
            //               postId: post.id,
            //               userId: user!.id,
            //             },
            //           ],
            //     },
            //   };

            //   const upPsts = posts;

            //   return [...posts!, {}];
            // });
            await likeMutation.mutateAsync();
            queryClient.invalidateQueries({
              queryKey: ["profile", "posts", "timeline", user?.id],
            });
          }}
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: 8,
            borderRadius: 999,
          }}
        >
          <PaperIcon
            size={28}
            source={isLiked ? "heart" : "heart-outline"}
            color={isLiked ? "#eb0000" : "#999"}
          />
          <Text style={{ color: "#999" }}>
            {item.post.likes.length > 0 ? item.post.likes.length : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: 8,
            borderRadius: 999,
          }}
        >
          <PaperIcon size={28} source={"chat-outline"} color={"#999"} />
          {/* <Text style={{ color: "#999" }}>102</Text> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            padding: 8,
            borderRadius: 999,
          }}
        >
          <PaperIcon size={24} source={"repeat"} color={"#999"} />

          {/* <Repeat strokeWidth={1.3} size={24} color={"#999"} /> */}
          {/* <Text style={{ color: "#999" }}>200</Text> */}
        </TouchableOpacity>
      </View>
      <View>
        <Bookmark strokeWidth={1.3} size={24} color={"#999"} />
      </View>
    </View>
  );
};

export default PostActions;
