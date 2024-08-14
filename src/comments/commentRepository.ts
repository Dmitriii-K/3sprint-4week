// import { commentCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { CommentModel, LikesModel } from "../db/schema-model-db";
import { LikesType } from "../input-output-types/comments-type";

export class CommetRepository {
    static async updateComment (id : string, content : string) {
        const mongoId = new ObjectId(id);
        const updateComment = await CommentModel.updateOne({ _id: mongoId },{$set: {content}});
        return updateComment.modifiedCount === 1
        
    }
    static async findAllLikesForPost(postId: string): Promise<LikesType[]> {
        const mongoPostId = new ObjectId(postId);
        return LikesModel.find({ commentId: mongoPostId }).exec();
    }
    static async findLike(commentId: string, userId: string){
        // console.log(commentId)//********************
        // console.log(userId)//********************
        const mongoCommentId = new ObjectId(commentId);
        const mongoUserId = new ObjectId(userId);
        const like = await LikesModel.findOne({ commentId: mongoCommentId, userId: mongoUserId });
        return like || null;
    }
    static async insertLike (data: LikesType) {
        const result = LikesModel.create(data);
        return (await result)._id.toString()
    }
    static async updateLikeStatus (id : string, updateStatus : string) {
        // console.log(id) //*************************
        const mongoId = new ObjectId(id);
        const result = await LikesModel.updateOne({ commentId: mongoId },{$set: { status: updateStatus }});
        return result.modifiedCount === 1
    }
    static async updateLikesInfo(commentId: string, likesCount: number, dislikesCount: number) {
        const mongoCommentId = new ObjectId(commentId);
        await CommentModel.updateOne(
            { _id: mongoCommentId },
            { $set: { 'likesInfo.likesCount': likesCount, 'likesInfo.dislikesCount': dislikesCount } }
        );
    }
    static async findUserByComment (id: string) {
        const mongoId = new ObjectId(id);
        return CommentModel.findOne({_id: mongoId});
    }
    static async deleteComment(id: string) {
        const mongoId = new ObjectId(id);
        const comment = await CommentModel.deleteOne({_id: mongoId});
        return comment.deletedCount === 1
    }
}