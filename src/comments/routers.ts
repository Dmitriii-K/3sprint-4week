import { Router } from "express";
import { CommentsController } from "./commentsController";
import { commentsValidation, inputCheckErrorsMiddleware, likeStatusValidation, softBearerAuth } from "../middlewares/middlewareForAll";
import { bearerAuth } from "../middlewares/middlewareForAll";
import { CommentQueryRepository } from "./commentQueryRepositiry";
import { CommentService } from "./commentService";
import { CommentRepository } from "./commentRepository";

export const commentsRouters = Router();

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);
const commentQueryRepository = new CommentQueryRepository(commentRepository);
const commentsController = new CommentsController(commentQueryRepository, commentService);

commentsRouters.get("/:id", softBearerAuth, commentsController.getComment.bind(commentsController));
commentsRouters.put("/:id", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, commentsController.updateComment.bind(commentsController));
commentsRouters.put("/:id/like-status", bearerAuth, likeStatusValidation, inputCheckErrorsMiddleware, commentsController.likeStatus.bind(commentsController));
commentsRouters.delete("/:id", bearerAuth, commentsController.deleteComment.bind(commentsController));