import { Router } from "express";
import { PostController } from "./postsController";
import { commentsValidation, likeStatusValidation, softBearerAuth } from "../middlewares/middlewareForAll";
import {
  postInputValidation,
  inputCheckErrorsMiddleware,
  authMiddleware,
  bearerAuth,
} from "../middlewares/middlewareForAll";

export const postRouter = Router();

postRouter.put("/:id/like-status", bearerAuth, likeStatusValidation, inputCheckErrorsMiddleware, PostController.updateLikeStatus);
postRouter.get("/", softBearerAuth, PostController.getPosts);
postRouter.post(
  "/",
  softBearerAuth,
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  PostController.createPost
);
postRouter.get("/:id", softBearerAuth, PostController.getPostById);
postRouter.put(
  "/:id",
  authMiddleware,
  postInputValidation,
  inputCheckErrorsMiddleware,
  PostController.updatePost
);
postRouter.post("/:id/comments", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, PostController.createCommentByPostId);
postRouter.get("/:id/comments", softBearerAuth, PostController.getCommentByPost)
postRouter.delete("/:id", authMiddleware, PostController.deletePost);
