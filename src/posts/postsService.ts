import { WithId } from "mongodb";
import { CommentDBType, CommentInputModel, LikesType, likeStatus } from "../input-output-types/comments-type";
import { PostDbType, PostInputModel } from "../input-output-types/posts-type";
import { UserDBModel } from "../input-output-types/users-type";
import { PostRepository } from "./postsRepository";
import { CommetRepository } from "../comments/commentRepository";

export class PostService {
    static async createPost (data: PostInputModel, id: string) {
        const findBlogNameForId = await PostRepository.findBlogNameForId(id)
        const createDate = new Date().toISOString();
        const newPost: PostDbType = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: findBlogNameForId!.name,
            createdAt: createDate,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                newestLikes: []
            }
        };
        return PostRepository.insertPost(newPost);
    }
    static async createCommentByPost (paramId: string, data: CommentInputModel, user: WithId<UserDBModel>) {
        const post = await PostRepository.findPostById(paramId);
        const createDate = new Date().toISOString();
        const newComment: CommentDBType = {
            postId: paramId,
            content: data.content,
            createdAt:	createDate,
            commentatorInfo: { 
                userId:	user._id.toString(),
                userLogin: user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0
            }
        };
        return PostRepository.insertComment(newComment)
    }
    static async updatePostLike(user: WithId<UserDBModel>, data: likeStatus, post: WithId<PostDbType>) {
        const existLike = await CommetRepository.findLike( post._id.toString(), user._id.toString())
        if(!existLike){
            const createDate = new Date().toISOString();
            const newLike: LikesType = {
                addedAt: createDate,
                commentId: post._id.toString(),
                userId: user._id.toString(),
                userIogin: user.login,
                status: data
            }
            if(data === likeStatus.Like){
                post.extendedLikesInfo.likesCount++
            } else if (data === likeStatus.Dislike) {
                post.extendedLikesInfo.dislikesCount++
            }
            await CommetRepository.insertLike(newLike)
            await PostRepository.updatePostCount(post._id.toString(), post.extendedLikesInfo.likesCount, post.extendedLikesInfo.dislikesCount);
            return true
        } else{
            if (existLike.status !== data) {
                // Обновление счетчиков лайков и дизлайков
                if (existLike.status === likeStatus.Like && data === likeStatus.Dislike) {
                    post.extendedLikesInfo.likesCount--;
                    post.extendedLikesInfo.dislikesCount++;
                } else if (existLike.status === likeStatus.Dislike && data === likeStatus.Like) {
                    post.extendedLikesInfo.dislikesCount--;
                    post.extendedLikesInfo.likesCount++;
                } else if (existLike.status === likeStatus.Like && data === likeStatus.None) {
                    post.extendedLikesInfo.likesCount--;
                } else if (existLike.status === likeStatus.Dislike && data === likeStatus.None) {
                    post.extendedLikesInfo.dislikesCount--;
                } else if (existLike.status === likeStatus.None && data === likeStatus.Like) {
                    post.extendedLikesInfo.likesCount++;
                } else if (existLike.status === likeStatus.None && data === likeStatus.Dislike) {
                    post.extendedLikesInfo.dislikesCount++;
                }
                existLike.status = data;
                await CommetRepository.updateLikeStatus(post._id.toString(), existLike.status);
                await PostRepository.updatePostCount(post._id.toString(), post.extendedLikesInfo.likesCount, post.extendedLikesInfo.dislikesCount);
                return true
            }
        }
        return false
    }
    static async updatePost (data: PostInputModel, id: string) {
        const succsesUpdate = await PostRepository.updatePost(data, id)
        if(succsesUpdate) {
            return succsesUpdate
        } else {
            return false
        }
    }
    static async deletePost (id: string) {
        const result = await PostRepository.deletePost(id)
        if(result) {
            return true
                } else {
            return false
            }
    }
}