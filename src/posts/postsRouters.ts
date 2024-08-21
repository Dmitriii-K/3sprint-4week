import { Router } from "express";
import { PostController } from "./postsController";
import { softBearerAuth, authMiddleware, bearerAuth } from "../middlewares/middlewareForAll";
import {
  postInputValidation,
  inputCheckErrorsMiddleware,
  commentsValidation,
  likeStatusValidation
} from "../middlewares/express-validator";
import { postContainer } from "./composition-root";

export const postRouter = Router();

const postController = postContainer.resolve(PostController)

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
