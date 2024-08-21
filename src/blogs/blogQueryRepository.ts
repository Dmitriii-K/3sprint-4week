import { ObjectId, WithId } from "mongodb";
import { BlogDbType, BlogViewModel, TypeBlogHalper, TypePostForBlogHalper } from "../input-output-types/blogs-type";
import { BlogModel, PostModel } from "../db/schema-model-db";
import { halper } from "../middlewares/middlewareForAll";
import { NewestLikesType, PostDbType, PostViewModel } from "../input-output-types/posts-type";
import { likeStatus, LikesType } from "../input-output-types/comments-type";
import { IBlogQueryRepository, TYPES } from "./blogInterface";
import { ICommentRepository } from "../comments/commentInterface";
import { IPostQueryRepository } from "../posts/postInterface";
import { inject, injectable } from "inversify";

@injectable()
export class BlogQueryRepository implements IBlogQueryRepository{
    constructor(
        @inject(TYPES.ICommentRepository) private commentRepository: ICommentRepository,
        @inject(TYPES.IPostQueryRepository) private postQueryRepository: IPostQueryRepository) {}

    async getAllBlogs(helper: TypeBlogHalper) {
        const queryParams = halper(helper);
        const search = helper.searchNameTerm
            ? { name: { $regex: helper.searchNameTerm, $options: "i" } }
            : {};
        const items: WithId<BlogDbType>[] = await BlogModel
            .find(search)
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
        const totalCount = await BlogModel.countDocuments(search);
        const blogs = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(this.blogMap),
        };
        return blogs;
    }
    async getBlogById(id: string) {
        const mongoId = new ObjectId(id);
        const blog = await BlogModel.findOne({ _id: mongoId });
        if (!blog) {
            return null;
        }
        return this.blogMap(blog);
    }
    async getPostForBlogById(id: string) {
        const mongoId = new ObjectId(id);
        const post = await PostModel.findOne({ _id: mongoId });
        if (!post) {
            return null;
        }
        return this.postQueryRepository.mapPost(post);
    }
    async getPostFofBlog(helper: TypePostForBlogHalper, id: string, userId: string | null) {
        const queryParams = halper(helper);
        const posts: WithId<PostDbType>[] = await PostModel
            .find({ blogId: id })
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
        const totalCount = await PostModel.countDocuments({ blogId: id });

        const items = await Promise.all(posts.map(async post => {
            let like;
            if (userId) {
                like = await this.commentRepository.findLike(post._id.toString(), userId);
            }
            const allLikes = await this.commentRepository.findAllLikesForPost(post._id.toString());
            const userLikeStatus = like ? like.status : likeStatus.None;
            return this.postQueryRepository.mapPost(post, userLikeStatus, allLikes);
        }));

        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items,
        };
    }
    mapPost(post: WithId<PostDbType>, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel {
        const newestLikes: NewestLikesType[] = [];

        if (allLikes) {
            // Фильтруем лайки, оставляя только те, у которых статус равен "Like"
            const likesOnly = allLikes.filter(like => like.status === 'Like');
            // Сортируем лайки по полю addedAt в порядке убывания
            likesOnly.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            // Ограничиваем количество лайков, если нужно
            const limitedLikes = likesOnly.slice(0, 3);

            newestLikes.push(...limitedLikes.map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.userIogin
            })));
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: userLikeStatus || likeStatus.None,
                newestLikes: newestLikes
            },
        };
    }
    blogMap(blog: WithId<BlogDbType>): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }
}