import 'reflect-metadata';
import { Container } from 'inversify';
import { BcryptService } from "../adapters/bcrypt";
import { UserController } from "./userController";
import { UserQueryRepository } from "./userQueryRepository";
import { UserRepository } from "./userRepository";
import { UserService } from "./userService";
import { IBcryptService, IUserQueryRepository, IUserRepository, IUserService } from './userInterface';
import { TYPES } from './userInterface';

// const userRepository = new UserRepository();
// const bcryptService = new BcryptService();
// const userService = new UserService(userRepository, bcryptService);
// const userQueryRepository = new UserQueryRepository();

// export const userController = new UserController(userService, userQueryRepository);


export const userContainer = new Container();

userContainer.bind(UserController).to(UserController);
userContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
userContainer.bind<IBcryptService>(TYPES.IBcryptService).to(BcryptService);
userContainer.bind<IUserService>(TYPES.IUserService).to(UserService);
userContainer.bind<IUserQueryRepository>(TYPES.IUserQueryRepository).to(UserQueryRepository);