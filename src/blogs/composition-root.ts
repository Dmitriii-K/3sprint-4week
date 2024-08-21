import 'reflect-metadata';
import { Container } from 'inversify';
import { BlogController } from './blogControllers';
import { IBlogService, TYPES, IBlogRepository, IBlogQueryRepository, ICommentRepository } from './blogInterface';
import { BlogQueryRepository } from './blogQueryRepository';
import { BlogRepository } from './blogRepository';
import { BlogService } from './blogService';
import { CommentRepository } from '../comments/commentRepository';

// const blogRepository = new BlogRepository();
// const blogService = new BlogService(blogRepository);
// const commentRepository = new CommentRepository();
// const commentQueryRepository = new CommentQueryRepository(commentRepository);
// const postQueryRepository = new PostQueryRepository(commentRepository, commentQueryRepository);
// const blogQueryRepository = new BlogQueryRepository(commentRepository, postQueryRepository);
// const blogController = new BlogController(blogService, blogQueryRepository);

export const blogContainer = new Container();

blogContainer.bind(BlogController).to(BlogController);
blogContainer.bind<IBlogService>(TYPES.IBlogService).to(BlogService);
blogContainer.bind<IBlogRepository>(TYPES.IBlogRepository).to(BlogRepository);
blogContainer.bind<IBlogQueryRepository>(TYPES.IBlogQueryRepository).to(BlogQueryRepository);
blogContainer.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository);