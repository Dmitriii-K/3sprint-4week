import { WithId } from "mongodb";
import { CommentViewModel, LikesType, likeStatus } from "../input-output-types/comments-type";
import { UserDBModel } from "../input-output-types/users-type";
import { CommentRepository } from "./commentRepository";

export class CommentService {
    private commentRepository: CommentRepository;

    constructor(commentRepository: CommentRepository) {
        this.commentRepository = commentRepository;
    }

    async findUserByComment(id: string) {
        const user = await this.commentRepository.findUserByComment(id);
        if (!user) {
            return null;
        } else {
            return user;
        }
    }

    async updateComment(id: string, content: string) {
        const updateResult = await this.commentRepository.updateComment(id, content);
        if (updateResult) {
            return updateResult;
        } else {
            return false;
        }
    }

    async likeStatus(user: WithId<UserDBModel>, data: likeStatus, comment: CommentViewModel) {
        const existLike = await this.commentRepository.findLike(comment.id, user._id.toString());
        if (!existLike) {
            const createDate = new Date().toISOString();
            const newLike: LikesType = {
                addedAt: createDate,
                commentId: comment.id,
                userId: user._id.toString(),
                userIogin: user.login,
                status: data
            };
            if (data === likeStatus.Like) {
                comment.likesInfo.likesCount++;
            } else if (data === likeStatus.Dislike) {
                comment.likesInfo.dislikesCount++;
            }
            await this.commentRepository.insertLike(newLike);
            await this.commentRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
            return true;
        } else {
            if (existLike.status !== data) {
                // Обновление счетчиков лайков и дизлайков
                if (existLike.status === likeStatus.Like && data === likeStatus.Dislike) {
                    comment.likesInfo.likesCount--;
                    comment.likesInfo.dislikesCount++;
                } else if (existLike.status === likeStatus.Dislike && data === likeStatus.Like) {
                    comment.likesInfo.dislikesCount--;
                    comment.likesInfo.likesCount++;
                } else if (existLike.status === likeStatus.Like && data === likeStatus.None) {
                    comment.likesInfo.likesCount--;
                } else if (existLike.status === likeStatus.Dislike && data === likeStatus.None) {
                    comment.likesInfo.dislikesCount--;
                } else if (existLike.status === likeStatus.None && data === likeStatus.Like) {
                    comment.likesInfo.likesCount++;
                } else if (existLike.status === likeStatus.None && data === likeStatus.Dislike) {
                    comment.likesInfo.dislikesCount++;
                }
                existLike.status = data;
                await this.commentRepository.updateLikeStatus(comment.id, existLike.status);
                await this.commentRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
                return true;
            }
        }
        return false;
    }

    async deleteComment(id: string) {
        const deleteResult = await this.commentRepository.deleteComment(id);
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}