import { Router } from "express";
import { PostController } from "./postsController";
import { softBearerAuth, authMiddleware, bearerAuth } from "../middlewares/middlewareForAll";
import {
  postInputValidation,
  inputCheckErrorsMiddleware,
  commentsValidation,
  likeStatusValidation
} from "../middlewares/express-validator";
import { PostService } from "./postsService";
import { PostRepository } from "./postsRepository";
import { PostQueryRepository } from "./postsQueryRepository";
import { CommentRepository } from "../comments/commentRepository";
import { CommentQueryRepository } from "../comments/commentQueryRepositiry";

export const postRouter = Router();

const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const postService = new PostService(postRepository, commentRepository);
const commentQueryRepository = new CommentQueryRepository(commentRepository);
const postQueryRepository = new PostQueryRepository(commentRepository, commentQueryRepository);
const postController = new PostController(postService, postQueryRepository);

postRouter.put("/:id/like-status", bearerAuth, likeStatusValidation, inputCheckErrorsMiddleware, postController.updateLikeStatus.bind(postController));
postRouter.get("/", softBearerAuth, postController.getPosts.bind(postController));
postRouter.post(
  "/",
  softBearerAuth,
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  postController.createPost.bind(postController)
);
postRouter.get("/:id", softBearerAuth, postController.getPostById.bind(postController));
postRouter.put(
  "/:id",
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  postController.updatePost.bind(postController)
);
postRouter.post("/:id/comments", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, postController.createCommentByPostId.bind(postController));
postRouter.get("/:id/comments", softBearerAuth, postController.getCommentByPost.bind(postController));
postRouter.delete("/:id", authMiddleware, postController.deletePost.bind(postController));
