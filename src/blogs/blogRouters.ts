import { Router } from "express";
import { BlogController } from "./blogControllers";
import {
    blogInputValidation,
    blogPostValidation,
    inputCheckErrorsMiddleware
} from "../middlewares/express-validator";
import { authMiddleware,  softBearerAuth } from "../middlewares/middlewareForAll";
import { container } from "./composition-root";

export const blogRouter = Router();

const blogController = container.resolve(BlogController)

blogRouter.get("/", blogController.getAllBlogs.bind(blogController));
blogRouter.get("/:id/posts", softBearerAuth, blogController.getPostForBlog.bind(blogController));
blogRouter.post(
    "/",
    authMiddleware,
    blogInputValidation,
    inputCheckErrorsMiddleware,
    blogController.createBlog.bind(blogController)
);
blogRouter.post(
    "/:id/posts",
    authMiddleware,
    blogPostValidation,
    inputCheckErrorsMiddleware,
    blogController.createPostForBlog.bind(blogController)
);
blogRouter.get("/:id", blogController.getBlogById.bind(blogController));
blogRouter.put(
    "/:id",
    authMiddleware,
    blogInputValidation,
    inputCheckErrorsMiddleware,
    blogController.updateBlog.bind(blogController)
);
blogRouter.delete("/:id", authMiddleware, blogController.deleteBlog.bind(blogController));