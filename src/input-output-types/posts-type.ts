import { ObjectId } from "mongodb";
import { likeStatus } from "./comments-type";

export type PstId = {
  id: string;
};

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: likeStatus,
    newestLikes: NewestLikesType[]
  },
};

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  newestLikes: NewestLikesType[]
}
export type NewestLikesType = {
  addedAt: string,
  userId: string;
  login: string
}
export type PostDbType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType,
};

export type PaginatorPostViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
};

export type TypePostHalper = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};
