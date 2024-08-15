import { ObjectId } from "mongodb";
import { BlogModel, PostModel } from "../db/schema-model-db";
import { BlogDbType, BlogInputModel } from "../input-output-types/blogs-type";
import { PostDbType } from "../input-output-types/posts-type";

export class BlogRepository {
    async insertBlog(data: BlogDbType) {
        const result = BlogModel.create(data);
        return (await result)._id.toString();
    }
    async insertPostForBlog(data: PostDbType) {
        const result = PostModel.create(data);
        return (await result)._id.toString();
    }
    async findBlogById(id: string) {
        const mongoId = new ObjectId(id);
        return BlogModel.findOne({ _id: mongoId });
    }
    async updateBlog(id: string, updateContent: BlogInputModel) {
        const mongoId = new ObjectId(id);
        const updateResult = await BlogModel.updateOne({ _id: mongoId }, { $set: updateContent });
        return updateResult.modifiedCount === 1;
    }
    async deleteBlog(id: string) {
        const mongoId = new ObjectId(id);
        const result = await BlogModel.deleteOne({ _id: mongoId });
        return result.deletedCount === 1;
    }
}