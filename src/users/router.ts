import { Router } from "express";
import { userInputValidation, inputCheckErrorsMiddleware } from "../middlewares/express-validator";
import { authMiddleware } from "../middlewares/middlewareForAll";
import { userController } from "./composition-root";

export const usersRouter = Router();

usersRouter.get("/", authMiddleware, userController.getUsers.bind(userController));
usersRouter.post(
    "/",
    authMiddleware,
    userInputValidation,
    inputCheckErrorsMiddleware,
    userController.createUser.bind(userController)
);
usersRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));