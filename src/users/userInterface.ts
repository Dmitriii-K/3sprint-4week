import { UserDBModel, UserInputModel, UserViewModel, TypeUserPagination, PaginatorUserViewModel } from "../input-output-types/users-type";

// export interface IUserController {
//     createUser(): Promise<void>;
//     deleteUser(): Promise<void>;
//     getUsers(): Promise<void>;
// }

export interface IUserService {
    createUser(user: UserInputModel): Promise<string | false>;
    deleteUser(id: string): Promise<boolean>;
}

export interface IUserQueryRepository {
    findUserById(id: string): Promise<UserViewModel | null>;
    findUsers(query: TypeUserPagination): Promise<PaginatorUserViewModel>;
}

export interface IUserRepository {
    findUserByLogiOrEmail(data: { login: string, email: string }): Promise<UserDBModel | null>;
    insertUser(user: UserDBModel): Promise<string>;
    deleteUser(id: string): Promise<boolean>;
}

export interface IBcryptService {
    createHashPassword(password: string): Promise<string>;
}

export const TYPES = {
    IUserRepository: Symbol.for("IUserRepository"),
    IBcryptService: Symbol.for("IBcryptService"),
    IUserService: Symbol.for("IUserService"),
    IUserQueryRepository: Symbol.for("IUserQueryRepository")
};