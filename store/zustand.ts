import { Timeline } from "@/new-types";
import { create } from "zustand";

type State = {
  posts: Timeline[] | null;
  isPosting: boolean;
};

type Action = {
  updatePosts: (posts: Timeline[]) => void;
  addPost: (post: Timeline) => void;
  updateIsPosting: (isPosting: boolean) => void;
};

export const usePostsStore = create<State & Action>((set) => ({
  posts: null,
  updatePosts(posts) {
    set(() => ({ posts }));
  },
  addPost(post) {
    set((state) => ({
      posts: state.posts ? [...state.posts, post] : [post],
    }));
  },
  isPosting: false,
  updateIsPosting(isPosting) {
    set(() => ({
      isPosting,
    }));
  },
}));
