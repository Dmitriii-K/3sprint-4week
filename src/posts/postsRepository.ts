import { ObjectId } from "mongodb";
import { PostDbType, PostInputModel } from "../input-output-types/posts-type";
import { CommentDBType } from "../input-output-types/comments-type";
import { BlogModel, CommentModel, PostModel } from "../db/schema-model-db";

export class PostRepository {
    async findBlogNameForId(BlogId: string) {
        const mongoBlogId = new ObjectId(BlogId);
        return BlogModel.findOne({ _id: mongoBlogId });
    }
    async findPostById(postId: string) {
        const mongoPostId = new ObjectId(postId);
        return PostModel.findOne({ _id: mongoPostId });
    }
    async insertPost(data: PostDbType) {
        const result = PostModel.create(data);
        return (await result)._id.toString();
    }
    async insertComment(data: CommentDBType) {
        const result = CommentModel.create(data);
        return (await result)._id.toString();
    }
    async updatePost(post: PostInputModel, id: string) {
        const mongoId = new ObjectId(id);
        const result = PostModel.updateOne({ _id: mongoId }, { $set: post });
        return (await result).modifiedCount === 1;
    }
    async updatePostCount(postId: string, likesCount: number, dislikesCount: number) {
        const mongoPostId = new ObjectId(postId);
        const result = PostModel.updateOne(
            { _id: mongoPostId },
            { $set: { 'extendedLikesInfo.likesCount': likesCount, 'extendedLikesInfo.dislikesCount': dislikesCount } });
        return (await result).modifiedCount === 1;
    }
    async deletePost(id: string) {
        const mongoId = new ObjectId(id);
        const result = await PostModel.deleteOne({ _id: mongoId });
        return result.deletedCount === 1;
    }
}