import { Router } from "express";
import { userInputValidation, inputCheckErrorsMiddleware } from "../middlewares/express-validator";
import { authMiddleware } from "../middlewares/middlewareForAll";
import { userContainer/*, userController*/ } from "./composition-root";
import { UserController } from "./userController";

export const usersRouter = Router();

const userController = userContainer.resolve(UserController)

usersRouter.get("/", authMiddleware, userController.getUsers.bind(userController));
usersRouter.post(
    "/",
    authMiddleware,
    userInputValidation,
    inputCheckErrorsMiddleware,
    userController.createUser.bind(userController)
);
usersRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));