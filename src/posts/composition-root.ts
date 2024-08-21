import 'reflect-metadata';
import { Container } from 'inversify';
import { ICommentRepository, IPostQueryRepository, IPostRepository, IPostService, TYPES } from './postInterface';
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

export const postContainer = new Container();

postContainer.bind(PostController).to(PostController);
postContainer.bind<IPostService>(TYPES.IPostService).to(PostService);
postContainer.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository);
postContainer.bind<IPostQueryRepository>(TYPES.IPostQueryRepository).to(PostQueryRepository);
postContainer.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository);