import { Router } from "express";
import { UserController } from "./userController";
import { UserService } from "./userService";
import { UserRepository } from "./userRepository";
import { UserQueryRepository } from "./userQueryRepository";
import { BcryptService } from "../adapters/bcrypt";
import {
    userInputValidation,
    inputCheckErrorsMiddleware,
    authMiddleware,
} from "../middlewares/middlewareForAll";

export const usersRouter = Router();

const userRepository = new UserRepository();
const bcryptService = new BcryptService();
const userService = new UserService(userRepository, bcryptService);
const userQueryRepository = new UserQueryRepository();
const userController = new UserController(userService, userQueryRepository);

usersRouter.get("/", authMiddleware, userController.getUsers.bind(userController));
usersRouter.post(
    "/",
    authMiddleware,
    userInputValidation,
    inputCheckErrorsMiddleware,
    userController.createUser.bind(userController)
);
usersRouter.delete("/:id", authMiddleware, userController.deleteUser.bind(userController));