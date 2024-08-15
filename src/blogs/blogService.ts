import { BlogDbType, BlogInputModel } from "../input-output-types/blogs-type";
import { BlogPostInputModel } from "../input-output-types/eny-type";
import { PostDbType } from "../input-output-types/posts-type";
import { BlogRepository } from "./blogRepository";

export class BlogService {
    private blogRepository: BlogRepository;

    constructor(blogRepository: BlogRepository) {
        this.blogRepository = blogRepository;
    }

    async createBlog(data: BlogInputModel) {
        const createDate = new Date().toISOString();
        const newBlog: BlogDbType = {
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: createDate,
            isMembership: false,
        };
        return this.blogRepository.insertBlog(newBlog);
    }

    async createPostForBlog(blogId: string, data: BlogPostInputModel, name: string) {
        const createDate = new Date().toISOString();
        const newPost: PostDbType = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: blogId,
            blogName: name,
            createdAt: createDate,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                newestLikes: []
            }
        };
        return this.blogRepository.insertPostForBlog(newPost);
    }

    async findBlogById(id: string) {
        const blog = await this.blogRepository.findBlogById(id);
        if (!blog) {
            return null;
        } else {
            return blog;
        }
    }

    async updateBlog(id: string, updateContent: BlogInputModel) {
        const updateResult = await this.blogRepository.updateBlog(id, updateContent);
        if (updateResult) {
            return updateResult;
        } else {
            return false;
        }
    }

    async deleteBlog(id: string) {
        const deleteResult = await this.blogRepository.deleteBlog(id);
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}