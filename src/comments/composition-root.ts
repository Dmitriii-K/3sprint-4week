import 'reflect-metadata';
import { Container } from 'inversify';
import { ICommentQueryRepository, ICommentRepository, ICommentService, TYPES } from './commentInterface';
import { CommentService } from './commentService';
import { CommentQueryRepository } from './commentQueryRepositiry';
import { CommentRepository } from './commentRepository';
import { CommentsController } from './commentsController';

// const commentRepository = new CommentRepository();
// const commentService = new CommentService(commentRepository);
// const commentQueryRepository = new CommentQueryRepository(commentRepository);
// const commentsController = new CommentsController(commentQueryRepository, commentService);

export const commentContainer = new Container();

commentContainer.bind(CommentsController).to(CommentsController);
commentContainer.bind<ICommentService>(TYPES.ICommentService).to(CommentService);
commentContainer.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository);
commentContainer.bind<ICommentQueryRepository>(TYPES.ICommentQueryRepository).to(CommentQueryRepository);