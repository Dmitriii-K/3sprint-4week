import 'reflect-metadata';
import { Container } from 'inversify';
import { ICommentQueryRepository, ICommentRepository, IPostQueryRepository, IPostRepository, IPostService, TYPES } from './postInterface';
import { CommentQueryRepository } from '../comments/commentQueryRepositiry';
import { CommentRepository } from '../comments/commentRepository';
import { PostController } from './postsController';
import { PostQueryRepository } from './postsQueryRepository';
import { PostRepository } from './postsRepository';
import { PostService } from './postsService';

// const postRepository = new PostRepository();
// const commentRepository = new CommentRepository();
// const postService = new PostService(postRepository, commentRepository);
// const commentQueryRepository = new CommentQueryRepository(commentRepository);
// const postQueryRepository = new PostQueryRepository(commentRepository, commentQueryRepository);
// const postController = new PostController(postService, postQueryRepository);

export const container = new Container();

container.bind(PostController).to(PostController);
container.bind<IPostService>(TYPES.IPostService).to(PostService);
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository);
container.bind<IPostQueryRepository>(TYPES.IPostQueryRepository).to(PostQueryRepository);
container.bind<ICommentRepository>(TYPES.ICommentRepository).to();
container.bind<ICommentQueryRepository>(TYPES.ICommentQueryRepository).to();