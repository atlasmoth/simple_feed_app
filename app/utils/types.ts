export type Post = {
  postId: string;
  createdById: string;
  imageId: string;
  caption: string | null;
};

export type LayoutState = {
  name: string;
  key: string;
  selected: boolean;
};
