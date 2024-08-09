import { Post } from "@/new-types";
import { create } from "zustand";

type State = {
  posts: Post[] | null;
};

type Action = {
  updatePosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
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
}));
