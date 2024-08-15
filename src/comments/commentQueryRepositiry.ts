import { ObjectId, WithId } from "mongodb";
import { CommentDBType, CommentViewModel, likeStatus } from "../input-output-types/comments-type";
import { CommentModel } from "../db/schema-model-db";
import { CommentRepository } from "./commentRepository";

export class CommentQueryRepository {

    constructor(private commentRepository: CommentRepository) {}

    async findCommentById(commentId: string, userId: string | null) {
        const mongoCommentId = new ObjectId(commentId);
        const comment = await CommentModel.findOne({ _id: mongoCommentId });
        if (!comment) {
            return null;
        }
        let like;
        if (userId) {
            like = await this.commentRepository.findLike(commentId, userId);
        }
        const userLikeStatus = like ? like.status : likeStatus.None;
        return this.mapComment(comment, userLikeStatus);
    }
    mapComment(comment: WithId<CommentDBType>, userLikeStatus?: likeStatus): CommentViewModel {
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