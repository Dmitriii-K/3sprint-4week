import 'reflect-metadata';
import { Container } from 'inversify';
import { BlogController } from './blogControllers';
import { IBlogService, TYPES, IBlogRepository, IBlogQueryRepository, IPostQueryRepository, ICommentRepository } from './blogInterface';
import { BlogQueryRepository } from './blogQueryRepository';
import { BlogRepository } from './blogRepository';
import { BlogService } from './blogService';

// const blogRepository = new BlogRepository();
// const blogService = new BlogService(blogRepository);
// const commentRepository = new CommentRepository();
// const commentQueryRepository = new CommentQueryRepository(commentRepository);
// const postQueryRepository = new PostQueryRepository(commentRepository, commentQueryRepository);
// const blogQueryRepository = new BlogQueryRepository(commentRepository, postQueryRepository);
// const blogController = new BlogController(blogService, blogQueryRepository);

export const container = new Container();

container.bind(BlogController).to(BlogController);
container.bind<IBlogService>(TYPES.IBlogService).to(BlogService);
container.bind<IBlogRepository>(TYPES.IBlogRepository).to(BlogRepository);
container.bind<IBlogQueryRepository>(TYPES.IBlogQueryRepository).to(BlogQueryRepository);
container.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository);
container.bind<IPostQueryRepository>(TYPES.IPostQueryRepository).to(PostQueryRepository);
