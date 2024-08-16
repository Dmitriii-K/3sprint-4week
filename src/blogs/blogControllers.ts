import { Request, Response } from "express";
import { BlogInputModel, BlogViewModel, PaginatorBlogViewModel, TypePostForBlogHalper } from "../input-output-types/blogs-type";
import { BlogPostInputModel, BlgId } from "../input-output-types/eny-type";
import { PaginatorPostViewModel, PostViewModel } from "../input-output-types/posts-type";
import { TypeBlogHalper } from "../input-output-types/blogs-type";
import { IBlogService, IBlogQueryRepository } from "./blogInterface";

export class BlogController {

    constructor(private blogService: IBlogService, private blogQueryRepository: IBlogQueryRepository) {}

    async createBlog(req: Request<{}, {}, BlogInputModel>, res: Response<BlogViewModel>) {
        try {
            const createResult = await this.blogService.createBlog(req.body);
            if (!createResult) {
                res.sendStatus(404);
                return;
            }
            const newBlog = await this.blogQueryRepository.getBlogById(createResult);
            if (newBlog) {
                res.status(201).json(newBlog);
            } else {
                res.sendStatus(500);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async createPostForBlog(req: Request<BlgId, {}, BlogPostInputModel>, res: Response<PostViewModel>) {
        try {
            const findBlog = await this.blogService.findBlogById(req.params.id);
            if (!findBlog) {
                res.sendStatus(404);
                return;
            }
            const createResult = await this.blogService.createPostForBlog(req.params.id, req.body, findBlog.name);
            const newPostForBlog = await this.blogQueryRepository.getPostForBlogById(createResult);
            if (newPostForBlog) {
                res.status(201).json(newPostForBlog);
            } else {
                res.sendStatus(500);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async getAllBlogs(req: Request<{}, {}, {}, TypeBlogHalper>, res: Response<PaginatorBlogViewModel>) {
        try {
            const blogs = await this.blogQueryRepository.getAllBlogs(req.query);
            res.status(200).json(blogs);
            return;
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async getBlogById(req: Request, res: Response<BlogViewModel>) {
        try {
            const blogResult = await this.blogQueryRepository.getBlogById(req.params.id);
            if (blogResult) {
                res.status(200).json(blogResult);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async getPostForBlog(req: Request<BlgId, {}, {}, TypePostForBlogHalper>, res: Response<PaginatorPostViewModel>) {
        try {
            const userId: string | null = req.user ? req.user._id.toString() : null;
            const posts = await this.blogQueryRepository.getPostFofBlog(req.query, req.params.id, userId);
            if (!posts.items) {
                res.sendStatus(404);
                return;
            } else {
                res.status(200).json(posts);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async updateBlog(req: Request<BlgId, {}, BlogInputModel>, res: Response) {
        try {
            const findBlog = await this.blogService.findBlogById(req.params.id);
            if (!findBlog) {
                res.sendStatus(404);
                return;
            }
            const updateBlogResult = await this.blogService.updateBlog(req.params.id, req.body);
            if (updateBlogResult) {
                res.sendStatus(204);
            }
            return;
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async deleteBlog(req: Request, res: Response) {
        try {
            const deleteResult = await this.blogService.deleteBlog(req.params.id);
            if (deleteResult) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}