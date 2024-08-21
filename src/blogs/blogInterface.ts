import { WithId } from "mongodb";
import { BlogInputModel, BlogViewModel, TypeBlogHalper, PaginatorBlogViewModel, TypePostForBlogHalper, BlogDbType } from "../input-output-types/blogs-type";
import { likeStatus, LikesType } from "../input-output-types/comments-type";
import { BlogPostInputModel } from "../input-output-types/eny-type";
import { PostViewModel, PaginatorPostViewModel, PostDbType } from "../input-output-types/posts-type";

export interface IBlogService {
    createBlog(blog: BlogInputModel): Promise<string | null>;
    findBlogById(blogId: string): Promise<BlogDbType | null>;
    createPostForBlog(blogId: string, post: BlogPostInputModel, blogName: string): Promise<string>;// null нужно указывать?
    updateBlog(blogId: string, updateContent: BlogInputModel): Promise<boolean>;
    deleteBlog(blogId: string): Promise<boolean>;
}

export interface IBlogQueryRepository {
    getBlogById(blogId: string): Promise<BlogViewModel | null>;
    getPostForBlogById(postId: string): Promise<PostViewModel | null>;
    getAllBlogs(query: TypeBlogHalper): Promise<PaginatorBlogViewModel>;
    getPostFofBlog(query: TypePostForBlogHalper, blogId: string, userId: string | null): Promise<PaginatorPostViewModel>;
    mapPost(post: WithId<PostDbType>, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel;
    blogMap(blog: WithId<BlogDbType>): BlogViewModel;
}

export interface IBlogRepository {
    insertBlog(blog: BlogDbType): Promise<string>;
    insertPostForBlog(post: PostDbType): Promise<string>;
    findBlogById(id: string): Promise<BlogDbType | null>;
    updateBlog(id: string, updateContent: BlogInputModel): Promise<boolean>;
    deleteBlog(id: string): Promise<boolean>;
}

export interface ICommentRepository {
    findLike(commentId: string, userId: string): Promise<LikesType | null>;
    findAllLikesForPost(postId: string): Promise<LikesType[]>;
}

export interface IPostQueryRepository {
    mapPost(post: WithId<PostDbType>, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel;
}

export const TYPES = {
    IBlogService: Symbol.for("IBlogService"),
    IBlogRepository: Symbol.for("IBlogRepository"),
    IBlogQueryRepository: Symbol.for("IBlogQueryRepository"),
    ICommentRepository: Symbol.for("ICommentRepository"),
    IPostQueryRepository: Symbol.for("IPostQueryRepository")
};