import { ObjectId, WithId } from "mongodb";
// import { commentCollection } from "../db/mongo-db";
import { CommentDBType, CommentViewModel, likeStatus } from "../input-output-types/comments-type";
import { CommentModel } from "../db/schema-model-db";
import { CommetRepository } from "./commentRepository";

export class CommentQueryRepository {
    static async findCommentById (commentId: string , userId: string | null) {
        const mongoCommentId = new ObjectId(commentId);
        const comment = await CommentModel.findOne({_id: mongoCommentId});
        if (!comment) {
            return null;
        };
        let like 
        if(userId){
            like = await CommetRepository.findLike(commentId , userId);
        } 
        const userLikeStatus = like ? like.status : likeStatus.None;
        return CommentQueryRepository.mapComment(comment, userLikeStatus);
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