import { WithId } from "mongodb";
import { CommentDBType, CommentInputModel, LikesType, likeStatus } from "../input-output-types/comments-type";
import { PostDbType, PostInputModel } from "../input-output-types/posts-type";
import { UserDBModel } from "../input-output-types/users-type";
import { ICommentRepository, IPostRepository, IPostService } from "./postInterface";

export class PostService implements IPostService{

    constructor(private postRepository: IPostRepository, private commentRepository: ICommentRepository) {}

    async createPost(data: PostInputModel, id: string) {
        const findBlogNameForId = await this.postRepository.findBlogNameForId(id);
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
        return this.postRepository.insertPost(newPost);
    }
    async createCommentByPost(paramId: string, data: CommentInputModel, user: WithId<UserDBModel>) {
        const post = await this.postRepository.findPostById(paramId);
        const createDate = new Date().toISOString();
        const newComment: CommentDBType = {
            postId: paramId,
            content: data.content,
            createdAt: createDate,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0
            }
        };
        return this.postRepository.insertComment(newComment);
    }
    async updatePostLike(user: WithId<UserDBModel>, data: likeStatus, post: WithId<PostDbType>) {
        const existLike = await this.commentRepository.findLike(post._id.toString(), user._id.toString());
        if (!existLike) {
            const createDate = new Date().toISOString();
            const newLike: LikesType = {
                addedAt: createDate,
                commentId: post._id.toString(),
                userId: user._id.toString(),
                userIogin: user.login,
                status: data
            };
            if (data === likeStatus.Like) {
                post.extendedLikesInfo.likesCount++;
            } else if (data === likeStatus.Dislike) {
                post.extendedLikesInfo.dislikesCount++;
            }
            await this.commentRepository.insertLike(newLike);
            await this.postRepository.updatePostCount(post._id.toString(), post.extendedLikesInfo.likesCount, post.extendedLikesInfo.dislikesCount);
            return true;
        } else {
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
                await this.commentRepository.updateLikeStatus(post._id.toString(), existLike.status);
                await this.postRepository.updatePostCount(post._id.toString(), post.extendedLikesInfo.likesCount, post.extendedLikesInfo.dislikesCount);
                return true;
            }
        }
        return false;
    }
    async updatePost(data: PostInputModel, id: string) {
        const succsesUpdate = await this.postRepository.updatePost(data, id);
        if (succsesUpdate) {
            return succsesUpdate;
        } else {
            return false;
        }
    }
    async deletePost(id: string) {
        const result = await this.postRepository.deletePost(id);
        if (result) {
            return true;
        } else {
            return false;
        }
    }
    async findPostById(postId: string) {
        return this.postRepository.findPostById(postId);
    }
}