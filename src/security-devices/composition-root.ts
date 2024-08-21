import 'reflect-metadata';
import { Container } from 'inversify';
import { SessionsControllers } from "./sessionsControllers";
import { SessionsQueryRepository } from "./sessionsQueryRepository";
import { SessionsRepository } from "./sessionsRepository";
import { SessionsService } from "./sessionsService";
import { ISessionsQueryRepository, ISessionsRepository, ISessionsService, TYPES } from './sessionsInterface';

// const sessionsRepository = new SessionsRepository();
// const sessionsService = new SessionsService(sessionsRepository);
// const sessionsQueryRepository = new SessionsQueryRepository();
// const sessionsControllers = new SessionsControllers(sessionsService, sessionsQueryRepository);

export const sessionContainer = new Container();

sessionContainer.bind(SessionsControllers).to(SessionsControllers);
sessionContainer.bind<ISessionsRepository>(TYPES.ISessionsRepository).to(SessionsRepository);
sessionContainer.bind<ISessionsService>(TYPES.ISessionsService).to(SessionsService);
sessionContainer.bind<ISessionsQueryRepository>(TYPES.ISessionsQueryRepository).to(SessionsQueryRepository);