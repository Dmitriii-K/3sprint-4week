import { ObjectId } from "mongodb";

export type CommentInputModel = {
  content:	string;
};

export type CommentatorInfo = {
  userId:	string;
  userLogin:	string;
};

export type LikesCount = {
  likesCount: number,
  dislikesCount: number,
}

export type CommentViewModel = {
  id:string;
  content:	string;
  createdAt:	string;
  commentatorInfo: CommentatorInfo;
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: likeStatus
  }
};

export type CommentDBType = {
  postId?: string;
  content:	string;
  createdAt:	string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesCount
}

export type PaginatorCommentViewModelDB = {
  pagesCount:	number;
  page:	number;
  pageSize:	number;
  totalCount:	number;
  items: CommentViewModel[];
};
export type TypeCommentPagination = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export enum likeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike'
};
export type LikesType = {
  addedAt: string;
  commentId: string;
  userId: string;
  userIogin: string;
  status: likeStatus
}