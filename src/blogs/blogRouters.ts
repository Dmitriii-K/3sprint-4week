import { Router } from "express";
import { BlogController } from "./blogControllers";
import {
  authMiddleware,
  blogInputValidation,
  blogPostValidation,
  inputCheckErrorsMiddleware,
  softBearerAuth,
} from "../middlewares/middlewareForAll";

export const blogRouter = Router();

blogRouter.get("/", BlogController.getAllBlogs);
blogRouter.get("/:id/posts", softBearerAuth, BlogController.getPostForBlog);
blogRouter.post(
  "/",
  authMiddleware,
  blogInputValidation,
  inputCheckErrorsMiddleware,
  BlogController.createBlog
);
blogRouter.post(
  "/:id/posts",
  authMiddleware,
  blogPostValidation,
  inputCheckErrorsMiddleware,
  BlogController.createPostForBlog
);
blogRouter.get("/:id", BlogController.getBlogById);
blogRouter.put(
  "/:id",
  authMiddleware,
  blogInputValidation,
  inputCheckErrorsMiddleware,
  BlogController.updateBlog
);
blogRouter.delete("/:id", authMiddleware, BlogController.deleteBlog);
