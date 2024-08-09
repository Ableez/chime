import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ScrollFeeds from "@/components/scroll-feeds";
import { useTheme } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_ENDPOINT } from "@/constants/Colors";
import { usePostsStore } from "@/store/zustand";
import { Post } from "@/new-types";

type Props = {};

const HomeScreen = (props: Props) => {
  const { dark } = useTheme();
  const { user, isSignedIn } = useUser();

  const { updatePosts } = usePostsStore((state) => state);

  const { data: posts, refetch } = useQuery({
    queryKey: ["posts", "timeline", user?.id, isSignedIn],
    queryFn: async () => {
      const response = await fetch(
        `${BACKEND_ENDPOINT}/trpc/post.getUserTimelinePosts?input=${JSON.stringify(
          { userId: user?.id, isSignedIn }
        )}`,
        {
          method: "GET",
        }
      );

      const resp = (await response.json()) as {
        result: {
          data: {
            data: Post[];
            message?: string;
            error?: string;
            statusCode: string;
          };
        };
      };

      updatePosts(resp.result.data.data);

      return await response.json();
    },
    enabled: !!user?.id,
    refetchInterval: 3000000, // Refetch every minute
  });

  return (
    <SafeAreaView style={{ backgroundColor: dark ? "#000" : "#fff" }}>
      <ScrollFeeds refetch={refetch} />
    </SafeAreaView>
  );
};

export default HomeScreen;
