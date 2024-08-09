export type User = {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
  image_url: string;
  bio: string;
  hasActiveStories: boolean;
  unreadMessages: number;
  profilePicture: string;
  emailVerified: boolean;
};

export type Follow = {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: string;
  follower: User;
  followed: User;
};

export type Post = {
  id: string;
  authorId: string;
  createdAt: string;
  postText: string;
  author: User;
  media: Media[];
  likes: Like[];
};

export type Media = {
  id: string;
  url: string;
  postId: string;
  originalWidth: string;
  originalHeight: string;
  post: Post;
  owner: User;
};

export type Like = {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user: User;
  post: Post;
};

export type Timeline = {
  post: Post;
  user: User;
  media: Media[];
};
