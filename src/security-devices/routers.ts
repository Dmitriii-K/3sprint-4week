import { Router } from "express";
import { SessionsControllers } from "./sessionsControllers";
import { checkRefreshToken } from "../middlewares/middlewareForAll";
import { sessionContainer } from "./composition-root";

export const devicesRouters = Router();

const sessionsControllers = sessionContainer.resolve(SessionsControllers)

devicesRouters.get("/devices", checkRefreshToken, sessionsControllers.getAllSessions.bind(sessionsControllers));
devicesRouters.delete("/devices", checkRefreshToken, sessionsControllers.deleteAllSessionsExceptCurrentOne.bind(sessionsControllers));
devicesRouters.delete("/devices/:id", checkRefreshToken, sessionsControllers.deleteSessionsById.bind(sessionsControllers));