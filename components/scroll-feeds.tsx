import { FlatList, RefreshControl, View } from "react-native";
import { useCallback } from "react";
import HeadLogo from "./head-logo";
import QuickUpdate from "./quick-update";
import PostItem from "./post-item";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { usePostsStore } from "@/store/zustand";
import { Timeline } from "@/new-types";
import { Text, useTheme } from "react-native-paper";

type Props = {
  isRefetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
};

const ScrollFeeds = ({ refetch, isRefetching }: Props) => {
  const renderItems = useCallback(
    ({ item }: { item: Timeline; index: number }) => {
      return <PostItem item={item} />;
    },
    []
  );
  const { dark } = useTheme();

  const { posts, isPosting } = usePostsStore();

  const keyExtractor = (item: Timeline) => item.post.id + "_POST-ITEM";

  return (
    <FlatList
      scrollEnabled={true}
      ListHeaderComponent={() => (
        <View>
          <HeadLogo />

          <QuickUpdate />
          {isPosting && (
            <View style={{ padding: 6 }}>
              <Text
                style={{ textAlign: "center", color: dark ? "#999" : "#bbb" }}
                variant="labelSmall"
              >
                ...Uploading your posting
              </Text>
            </View>
          )}
        </View>
      )}
      data={posts}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
      }
      updateCellsBatchingPeriod={50}
      keyExtractor={keyExtractor}
      renderItem={({ index, item }) => renderItems({ index, item })}
    />
  );
};

export default ScrollFeeds;
