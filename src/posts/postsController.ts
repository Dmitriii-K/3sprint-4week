import { Request, Response } from "express";
import { CommentInputModel, CommentDBType, PaginatorCommentViewModelDB, likeStatus } from "../input-output-types/comments-type";
import { PostInputModel, PstId, PostViewModel, PaginatorPostViewModel, TypePostHalper } from "../input-output-types/posts-type";
import { PostService } from "./postsService";
import { PostQueryRepository } from "./postsQueryRepository";

export class PostController {
    private postService: PostService;
    private postQueryRepository: PostQueryRepository;

    constructor(postService: PostService, postQueryRepository: PostQueryRepository) {
        this.postService = postService;
        this.postQueryRepository = postQueryRepository;
    }

    async createPost(req: Request<{}, {}, PostInputModel>, res: Response<PostViewModel>) {
        try {
            const userId: string | null = req.user ? req.user._id.toString() : null;
            const createResult = await this.postService.createPost(req.body, req.body.blogId); // запрос на проверку BlogId в middleware
            if (!createResult) {
                res.sendStatus(404);
                return;
            }
            const newPost = await this.postQueryRepository.findPostById(createResult, userId);
            if (newPost)
                res.status(201).json(newPost);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async createCommentByPostId(req: Request<PstId, {}, CommentInputModel>, res: Response<CommentDBType>) {
        try {
            const createResult = await this.postService.createCommentByPost(req.params.id, req.body, req.user);
            if (!createResult) {
                res.sendStatus(404);
                return;
            }
            const newComment = await this.postQueryRepository.findCommentById(createResult);
            if (newComment)
                res.status(201).json(newComment);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async getPosts(req: Request<{}, {}, {}, TypePostHalper>, res: Response<PaginatorPostViewModel>) {
        try {
            const user = req.user ? req.user : null;
            const posts = await this.postQueryRepository.getAllPosts(req.query, user);
            res.status(200).json(posts);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }

    async getPostById(req: Request, res: Response) {
        try {
            const userId: string | null = req.user ? req.user._id.toString() : null;
            const postResult = await this.postQueryRepository.findPostById(req.params.id, userId);
            if (postResult) {
                res.status(200).json(postResult);
            } else {
                res.sendStatus(404);
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async getCommentByPost(req: Request<PstId, {}, {}, TypePostHalper>, res: Response<PaginatorCommentViewModelDB>) {
        try {
            const userId: string | null = req.user ? req.user._id.toString() : null;
            const comments = await this.postQueryRepository.findCommentByPost(req.query, req.params.id, userId);
            if (comments.items.length < 1) {
                res.sendStatus(404);
                return;
            } else {
                res.status(200).json(comments);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async updateLikeStatus(req: Request<PstId, {}, { likeStatus: likeStatus }>, res: Response) {
        try {
            const user = req.user ? req.user : null;
            const post = await this.postService.findPostById(req.params.id);
            if (!post) {
                res.sendStatus(404);
                return;
            }
            const result = await this.postService.updatePostLike(user, req.body.likeStatus, post);
            if (result) {
                res.sendStatus(204);
                return;
            }
            res.sendStatus(204);
            return;
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async updatePost(req: Request<PstId, {}, PostInputModel>, res: Response) {
        try {
            const findPost = await this.postService.findPostById(req.params.id);
            if (!findPost) {
                res.sendStatus(404);
                return;
            }
            const updateResult = await this.postService.updatePost(req.body, req.params.id);
            if (updateResult) {
                res.sendStatus(204);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const deleteResult = await this.postService.deletePost(req.params.id);
            if (deleteResult) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}