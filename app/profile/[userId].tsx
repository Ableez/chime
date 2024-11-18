import { ThemedView } from "@/components/ThemedView";
import PostItem from "@/components/post-item";
import Button from "@/components/ui/button";
import PaperIcon from "@/components/ui/paper-icon";
import { BACKEND_ENDPOINT } from "@/constants/Colors";
import { Timeline } from "@/new-types";
import { IconSourceNames, UserProfile } from "@/type";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryClient } from "../_layout";

type Props = {};

const UserScreen = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const { dark } = useTheme();

  const { userId } = useLocalSearchParams<{ userId: string }>();

  const profileQuery = useQuery({
    queryKey: ["profile", "posts"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${BACKEND_ENDPOINT}/trpc/user.getBasicUserInfo?input=${JSON.stringify(
            {
              userId,
            }
          )}`
        );

        const resp = await response.json();

        return {
          user: resp.result.data.user,
          postsData: resp.result.data.userPosts,
        };
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    refetchInterval: 3000,
  });

  const renderItems = useCallback(
    ({ item }: { item: Timeline; index: number }) => {
      return <PostItem item={item} />;
    },
    []
  );

  const keyExtractor = (item: Timeline) => item.post.id + "_POST-ITEM";

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: dark ? "#000" : "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity style={{ padding: 14 }} onPress={() => router.back()}>
          <PaperIcon source={"arrow-left"} />
        </TouchableOpacity>

        {/* #TODO: WHATSAPP DM FEATURE */}
        <TouchableOpacity style={{ padding: 14 }}>
          <PaperIcon source={"whatsapp"} />
        </TouchableOpacity>
      </View>
      <ThemedView style={{ height: Dimensions.get("window").height }}>
        <FlatList
          data={profileQuery.data?.postsData}
          keyExtractor={keyExtractor}
          renderItem={renderItems}
          refreshControl={
            <RefreshControl
              refreshing={loading || profileQuery.isLoading}
              onRefresh={() => {
                profileQuery.refetch();
              }}
            />
          }
          ListHeaderComponent={() => <Header user={profileQuery.data?.user} />}
          contentContainerStyle={{
            paddingBottom: 16,
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

export default UserScreen;

const Header = ({ user }: { user: UserProfile | null }) => {
  const [followingProcess, setFollowingProcess] = useState(false);
  const { dark } = useTheme();
  const { user: currUser } = useUser();

  const isFollower = user?.followedBy?.filter(
    (it) => it.followerId !== user?.id
  );

  const followObj = user?.followedBy?.find(
    (fl) => fl.followerId === currUser?.id
  );

  const followMutation = useMutation({
    mutationFn: async () => {
      await fetch(
        `${BACKEND_ENDPOINT}/trpc/user.${
          isFollower?.length! > 0 ? "unfollow" : "follow"
        }`,
        {
          method: "POST",
          body:
            isFollower?.length! > 0
              ? JSON.stringify({
                  followId: followObj.id,
                })
              : JSON.stringify({
                  userId: currUser?.id,
                  followUserId: user?.id,
                }),
        }
      );
    },
  });

  const handleFollowToggle = async () => {
    setFollowingProcess(true);
    await followMutation.mutateAsync();
    queryClient.invalidateQueries({ queryKey: ["profile", "posts"] });
    try {
    } catch (error) {
      console.error("[FOLLOWING USER]", error);
    } finally {
      setFollowingProcess(false);
    }
  };

  return (
    <View style={{ borderBottomWidth: 0.2, borderBottomColor: "#ccc" }}>
      <View style={{ backgroundColor: dark ? "#000" : "#fff" }}>
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "58%",
              }}
            >
              <Text
                variant="titleLarge"
                style={{ fontWeight: "700", fontSize: 30 }}
              >
                {user?.username}
              </Text>

              {user?.username ? (
                <Text
                  variant="titleMedium"
                  style={{ textTransform: "capitalize" }}
                >
                  {user?.firstname} {user?.lastname}
                </Text>
              ) : null}
            </View>
            <View>
              <Image
                source={{ uri: user?.profilePicture }}
                style={{ width: 80, height: 80, borderRadius: 100 }}
              />
            </View>
          </View>

          <View>
            <Text style={{ marginBottom: 8 }}>{user?.bio ?? "No bio"}</Text>
            <Text
              style={{
                color: dark ? "#666" : "#bbb",
                marginLeft: 5,
              }}
            >
              {user?.followedBy?.length}
              {user?.followedBy?.length! > 1 ? ` followers` : ` follower`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginVertical: 14,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", gap: 8 }}>
              <Button
                align="center"
                loading={followingProcess}
                style={{ width: "48%" }}
                onPress={handleFollowToggle}
                icon={
                  isFollower?.length! > 0
                    ? ""
                    : ("heart-outline" as IconSourceNames)
                }
                title={isFollower?.length! > 0 ? "Unfollow" : "Follow"}
                variant={isFollower?.length! > 0 ? "outline" : "default"}
              />
              <Button
                align="center"
                style={{ justifyContent: "center", width: "48%" }}
                icon={"chat-outline" as IconSourceNames}
                variant="outline"
                onPress={async () => {}}
                title="Message"
              />
            </View>
          </View>
        </View>
      </View>

      <Text variant="titleLarge" style={{ fontWeight: "700", padding: 16 }}>
        Posts
      </Text>
    </View>
  );
};
