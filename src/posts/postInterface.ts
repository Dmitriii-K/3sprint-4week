import { WithId } from "mongodb";
import { CommentInputModel, PaginatorCommentViewModelDB, CommentViewModel, likeStatus, CommentDBType, LikesType } from "../input-output-types/comments-type";
import { PostInputModel, PostViewModel, TypePostHalper, PaginatorPostViewModel, PostDbType } from "../input-output-types/posts-type";
import { UserDBModel } from "../input-output-types/users-type";
import { BlogDbType } from "../input-output-types/blogs-type";

export interface IPostService {
    createPost(post: PostInputModel, blogId: string): Promise<string | null>;
    createCommentByPost(postId: string, comment: CommentInputModel, user: WithId<UserDBModel>): Promise<string | null>;
    findPostById(postId: string): Promise<WithId<PostDbType> | null>;
    updatePostLike(user: WithId<UserDBModel>, data: likeStatus, post: WithId<PostDbType>): Promise<boolean>;
    updatePost(post: PostInputModel, postId: string): Promise<boolean>;
    deletePost(postId: string): Promise<boolean>;
}

export interface IPostQueryRepository {
    findPostById(postId: string, userId: string | null): Promise<PostViewModel | null>;
    findCommentById(commentId: string): Promise<CommentViewModel | null>;
    getAllPosts(query: TypePostHalper, user: WithId<UserDBModel> | null): Promise<PaginatorPostViewModel>;
    findCommentByPost(query: TypePostHalper, postId: string, userId: string | null): Promise<PaginatorCommentViewModelDB>;
    mapPost(post: WithId<PostDbType>, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel;
    mapComment(comment: WithId<CommentDBType>, userLikeStatus?: likeStatus): CommentViewModel;
}

export interface IPostRepository {
    findBlogNameForId(id: string): Promise<BlogDbType | null>;
    insertPost(post: PostDbType): Promise<string>;
    findPostById(postId: string): Promise<WithId<PostDbType> | null>;
    updatePost(data: PostInputModel, id: string): Promise<boolean>;
    deletePost(id: string): Promise<boolean>;
    insertComment(comment: CommentDBType): Promise<string>;
    updatePostCount(postId: string, likesCount: number, dislikesCount: number): Promise<boolean>;
}

export interface ICommentRepository {
    findLike(commentId: string, userId: string): Promise<LikesType | null>;
    insertLike(like: LikesType): Promise<string>;
    updateLikeStatus(commentId: string, status: likeStatus): Promise<boolean>;
    findAllLikesForPost(postId: string): Promise<LikesType[]>;
}

export const TYPES = {
    IPostService: Symbol.for("IPostService"),
    IPostRepository: Symbol.for("IPostRepository"),
    ICommentRepository: Symbol.for("ICommentRepository"),
    IPostQueryRepository: Symbol.for("IPostQueryRepository")
};