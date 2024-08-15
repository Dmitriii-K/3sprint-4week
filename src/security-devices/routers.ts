import { Router } from "express";
import { SessionsControllers } from "./sessionsControllers";
import { SessionsService } from "./sessionsService";
import { SessionsRepository } from "./sessionsRepository";
import { SessionsQueryRepository } from "./sessionsQueryRepository";
import { checkRefreshToken } from "../middlewares/middlewareForAll";

export const devicesRouters = Router();

const sessionsRepository = new SessionsRepository();
const sessionsService = new SessionsService(sessionsRepository);
const sessionsQueryRepository = new SessionsQueryRepository();
const sessionsControllers = new SessionsControllers(sessionsService, sessionsQueryRepository);

devicesRouters.get("/devices", checkRefreshToken, sessionsControllers.getAllSessions.bind(sessionsControllers));
devicesRouters.delete("/devices", checkRefreshToken, sessionsControllers.deleteAllSessionsExceptCurrentOne.bind(sessionsControllers));
devicesRouters.delete("/devices/:id", checkRefreshToken, sessionsControllers.deleteSessionsById.bind(sessionsControllers));