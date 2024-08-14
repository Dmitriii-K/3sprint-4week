import { Request, Response } from "express";
import { CommentInputModel, CommentDBType, PaginatorCommentViewModelDB, likeStatus } from "../input-output-types/comments-type";
import {
    PostInputModel,
    PstId,
    PostViewModel,
    PaginatorPostViewModel,
    TypePostHalper,
} from "../input-output-types/posts-type";
import { PostRepository } from "./postsRepository";
import { PostService } from "./postsService";
import { PostQueryRepository } from "./postsQueryRepository";

export class PostController {
    static createPost = async (
        req: Request<{}, {}, PostInputModel>,
        res: Response<PostViewModel>
    ) => {
        try {
            const userId : string | null = req.user ? req.user._id.toString() : null;
            const createResult = await PostService.createPost(req.body, req.body.blogId); // запрос на проверку BlogId  в middleware
            if (!createResult) {
                res.sendStatus(404)
                return;
            };
            const newPost = await PostQueryRepository.findPostById(createResult, userId);
            if(newPost)
                res.status(201).json(newPost);
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    }
    static createCommentByPostId = async (req:Request<PstId,{}, CommentInputModel>, res:Response<CommentDBType>) => {
        try {
            const createResult = await PostService.createCommentByPost(req.params.id, req.body, req.user)
            if (!createResult) {
                res.sendStatus(404)
                return;
            };
            const newComment = await PostQueryRepository.findCommentById(createResult);
                if(newComment)
                    res.status(201).json(newComment);
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
    static getPosts = async (
        req: Request<{}, {}, {}, TypePostHalper>,
        res: Response<PaginatorPostViewModel>
    ) => {
        try{
            const user = req.user ? req.user : null;
            // console.log('User control:', user);//********************
        const posts = await PostQueryRepository.getAllPosts(req.query, user)
        res.status(200).json(posts);
        }catch (e) {
        console.log(e);
        res.sendStatus(505);
    }
    }
    static getPostById = async (req: Request, res: Response) => {
        try {
            const userId : string | null = req.user ? req.user._id.toString() : null;
            const postResult = await PostQueryRepository.findPostById(req.params.id, userId)
            if(postResult) {
                res.status(200).json(postResult)
            } else {
                res.sendStatus(404)
                return
            }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    }
    static getCommentByPost = async (req:Request<PstId, {},{},TypePostHalper>, res:Response<PaginatorCommentViewModelDB>) => {
        try {
            const userId : string | null = req.user ? req.user._id.toString() : null;
            // console.log('UserId contr:', userId);//********************
            const comments = await PostQueryRepository.findCommentByPost(req.query, req.params.id, userId)
            if(comments.items.length < 1) {
                res.sendStatus(404)
                return
            } else {
                res.status(200).json(comments);
                }
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
    static updateLikeStatus = async (req: Request<PstId, {}, { likeStatus: likeStatus }>, res: Response) => {
        try {
            const user = req.user ? req.user : null;
            // console.log(userId)//********************
            const post = await PostRepository.findPostById(req.params.id);
            // console.log(post)//********************
            if(!post) {
                res.sendStatus(404);
                return;
            };
            const result = await PostService.updatePostLike(user, req.body.likeStatus, post);
            if(result) {
                res.sendStatus(204)
                return
            }
            res.sendStatus(204)
            return
        } catch (error) {
            console.log(error);
            res.sendStatus(505);
        }
    }
    static updatePost = async (
        req: Request<PstId, {}, PostInputModel>,
        res: Response
    ) => {
        try {
            const findPost = await PostRepository.findPostById(req.params.id)
            if(!findPost) {
                res.sendStatus(404)
                return
            }
            const updateResult = await PostService.updatePost(req.body, req.params.id)
            if(updateResult) {
                res.sendStatus(204);
            }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    }
    static deletePost = async (
        req: Request,
        res: Response
    ) => {
        try {
            const deleteResult = await PostService.deletePost(req.params.id)
            if(deleteResult) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
                return
            }
        } catch (error) {
        console.log(error);
        res.sendStatus(505);
        }
    }
}