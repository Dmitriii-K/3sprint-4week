import { WithId } from "mongodb";
import { CommentViewModel, LikesType, likeStatus } from "../input-output-types/comments-type";
import { UserDBModel } from "../input-output-types/users-type";
import { CommetRepository } from "./commentRepository";

export class CommentService {
    static async findUserByComment (id: string) {
        const user = await CommetRepository.findUserByComment(id)
        if(!user) {
            return null
        } else {
            return user
        }
    }
    static async updateComment (id: string, content: string) {
        const updateResult = await CommetRepository.updateComment(id, content);
        if(updateResult) {
            return updateResult
        } else {
            return false
        }
    }
    static async likeStatus(user: WithId<UserDBModel>, data: likeStatus, comment: CommentViewModel) {
        const existLike = await CommetRepository.findLike(comment.id, user._id.toString())
        if(!existLike){
            const createDate = new Date().toISOString();
            const newLike: LikesType = {
                addedAt: createDate,
                commentId: comment.id,
                userId: user._id.toString(),
                userIogin: user.login,
                status: data
            }
            if(data === likeStatus.Like){
                comment.likesInfo.likesCount++
            } else if (data === likeStatus.Dislike) {
                comment.likesInfo.dislikesCount++
            }
            await CommetRepository.insertLike(newLike)
            await CommetRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
            return true
        } else{
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
                await CommetRepository.updateLikeStatus(comment.id, existLike.status);
                await CommetRepository.updateLikesInfo(comment.id, comment.likesInfo.likesCount, comment.likesInfo.dislikesCount);
                return true
            }
        }
        return false
    }
    static async deleteComment (id: string) {
        const deleteResult = await CommetRepository.deleteComment(id);
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}