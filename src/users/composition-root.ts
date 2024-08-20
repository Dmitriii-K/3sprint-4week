import 'reflect-metadata';
import { Container } from 'inversify';
import { BcryptService } from "../adapters/bcrypt";
import { UserController } from "./userController";
import { UserQueryRepository } from "./userQueryRepository";
import { UserRepository } from "./userRepository";
import { UserService } from "./userService";

const userRepository = new UserRepository();
const bcryptService = new BcryptService();
const userService = new UserService(userRepository, bcryptService);
const userQueryRepository = new UserQueryRepository();

export const userController = new UserController(userService, userQueryRepository);


// export const container = new Container();

// container.bind(UsersRepository).to(UsersRepository);
// container.bind(AdminUsersRepository).to(AdminUsersRepository);
// container.bind(UsersService).to(UsersService);