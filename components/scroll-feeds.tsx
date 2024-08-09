import { postData } from "@/utils/new-data";
import { UserType, users } from "@/utils/user";
import { FlatList, View } from "react-native";
import { useCallback } from "react";
import HeadLogo from "./head-logo";
import QuickUpdate from "./quick-update";
import { PostType } from "@/utils/th";
import PostItem from "./post-item";
import { Post } from "@/new-types";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { usePostsStore } from "@/store/zustand";

type Props = {
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
};

const ScrollFeeds = ({}: Props) => {
  const renderItems = useCallback(
    ({ item }: { item: PostType; index: number }) => {
      const user = users.find((user) => user.id === item.user);
      return <PostItem item={item} user={user as UserType} />;
    },
    []
  );

  const { posts } = usePostsStore();

  console.log(JSON.stringify(posts));

  const keyExtractor = (item: PostType) => item.id + "_POST-ITEM";

  return (
    <FlatList
      scrollEnabled={true}
      ListHeaderComponent={() => (
        <View>
          <HeadLogo />
          <QuickUpdate />
        </View>
      )}
      data={postData}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      keyExtractor={keyExtractor}
      renderItem={({ index, item }) => renderItems({ index, item })}
    />
  );
};

export default ScrollFeeds;
