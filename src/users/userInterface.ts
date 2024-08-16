import { UserDBModel, UserInputModel, UserViewModel, TypeUserPagination, PaginatorUserViewModel } from "../input-output-types/users-type";

export interface IUserService {
    createUser(user: UserInputModel): Promise<string | false>; // так же нужно использовать null ?
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