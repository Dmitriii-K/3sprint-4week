import { Router } from "express";
import { CommentsController } from "./commentsController";
import { commentsValidation, inputCheckErrorsMiddleware, likeStatusValidation } from "../middlewares/express-validator";
import { softBearerAuth } from "../middlewares/middlewareForAll";
import { bearerAuth } from "../middlewares/middlewareForAll";
import { container } from "./composition-root";

export const commentsRouters = Router();

const commentsController = container.resolve(CommentsController)

commentsRouters.get("/:id", softBearerAuth, commentsController.getComment.bind(commentsController));
commentsRouters.put("/:id", bearerAuth, commentsValidation, inputCheckErrorsMiddleware, commentsController.updateComment.bind(commentsController));
commentsRouters.put("/:id/like-status", bearerAuth, likeStatusValidation, inputCheckErrorsMiddleware, commentsController.likeStatus.bind(commentsController));
commentsRouters.delete("/:id", bearerAuth, commentsController.deleteComment.bind(commentsController));