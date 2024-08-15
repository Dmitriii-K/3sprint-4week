import { Router } from "express";
import { BlogController } from "./blogControllers";
import {
    authMiddleware,
    blogInputValidation,
    blogPostValidation,
    inputCheckErrorsMiddleware,
    softBearerAuth,
} from "../middlewares/middlewareForAll";
import { BlogService } from "./blogService";
import { BlogRepository } from "./blogRepository";
import { BlogQueryRepository } from "./blogQueryRepository";
import { CommentRepository } from "../comments/commentRepository";
import { PostQueryRepository } from "../posts/postsQueryRepository";
import { CommentQueryRepository } from "../comments/commentQueryRepositiry";

export const blogRouter = Router();

const blogRepository = new BlogRepository();
const blogService = new BlogService(blogRepository);
const commentRepository = new CommentRepository();
const commentQueryRepository = new CommentQueryRepository(commentRepository);
const postQueryRepository = new PostQueryRepository(commentRepository, commentQueryRepository);
const blogQueryRepository = new BlogQueryRepository(commentRepository, postQueryRepository);
const blogController = new BlogController(blogService, blogQueryRepository);

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