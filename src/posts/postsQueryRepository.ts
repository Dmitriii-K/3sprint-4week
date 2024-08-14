import { ObjectId, WithId } from "mongodb";
import { CommentDBType, CommentViewModel, likeStatus, LikesType } from "../input-output-types/comments-type";
import { NewestLikesType, PostDbType, PostViewModel, TypePostHalper } from "../input-output-types/posts-type";
// import { commentCollection, postCollection } from "../db/mongo-db";
import { halper, commentsPagination } from "../middlewares/middlewareForAll";
import { CommentModel, PostModel } from "../db/schema-model-db";
import { CommentRepository } from "../comments/commentRepository";
import { CommentQueryRepository } from "../comments/commentQueryRepositiry";
import { UserDBModel } from "../input-output-types/users-type";

export class PostQueryRepository {
    static async getAllPosts(helper: TypePostHalper, user: WithId<UserDBModel> | null) {
        const queryParams = halper(helper);
        const posts: WithId<PostDbType>[] = (await PostModel
            .find({})
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec());
        const totalCount = await PostModel.countDocuments({});
    
        const items = await Promise.all(posts.map(async post => {
            let like;
            if (user) {
                like = await CommentRepository.findLike(post._id.toString(), user._id.toString());
            }
            const allLikes = await CommentRepository.findAllLikesForPost(post._id.toString());
            const userLikeStatus = like ? like.status : likeStatus.None;
            return PostQueryRepository.mapPost(post, userLikeStatus, allLikes);
        }));
    
        return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items,
        };
    }
    static async findPostById (postId: string, userId: string | null) {
        const mongoId = new ObjectId(postId);
        const post = await PostModel.findOne({_id: mongoId});
        if (!post) {
            return null;
        }
        let like 
        if(userId){
            like = await CommentRepository.findLike(postId , userId);
        } 
        const allLikes = await CommentRepository.findAllLikesForPost(post._id.toString());
        const userLikeStatus = like ? like.status : likeStatus.None;
        return PostQueryRepository.mapPost(post, userLikeStatus, allLikes);
    }
    static async findCommentById (id: string) {
        const mongoId = new ObjectId(id);
        const comment = await CommentModel.findOne({_id: mongoId});
        if (!comment) {
            return null;
        }
        return PostQueryRepository.mapComment(comment);
    }
    static async findCommentByPost (helper: TypePostHalper, id: string, userId: string | null) {
        const queryParams = commentsPagination(helper);
            const comments: WithId<CommentDBType>[] = await CommentModel
            .find({ postId: id })
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
            
            const totalCount = await CommentModel.countDocuments({ postId: id });

            const items = await Promise.all(comments.map( async comment => {
                let like 
                if(userId){
                    like = await CommentRepository.findLike(comment._id.toString() , userId);
                } 
                const userLikeStatus = like ? like.status : likeStatus.None;
                return CommentQueryRepository.mapComment(comment, userLikeStatus);
            })
            )

            return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items,
            };
            
    }
    static mapPost(post: WithId<PostDbType>, userLikeStatus?: likeStatus, allLikes?: LikesType[]): PostViewModel {
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
    static mapComment (comment: WithId<CommentDBType>, userLikeStatus?: likeStatus): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: userLikeStatus || likeStatus.None
            }
        };
    }
}
