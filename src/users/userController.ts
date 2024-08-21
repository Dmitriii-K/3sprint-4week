import { Request, Response } from "express";
import { PaginatorUserViewModel, TypeUserPagination, UserInputModel, UserViewModel } from "../input-output-types/users-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { IUserQueryRepository, IUserService, TYPES } from "./userInterface";
import { injectable, inject } from "inversify";

@injectable()
export class UserController {

    constructor(
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject(TYPES.IUserQueryRepository) private userQueryRepository: IUserQueryRepository) {}

    async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel | OutputErrorsType>) {
        try {
            const createResult = await this.userService.createUser(req.body);
            if (!createResult) {
                res.status(400).json({ errorsMessages: [{ message: 'email and login should be unique', field: 'email and login' }] });
                return;
            }
            const newUserDB = await this.userQueryRepository.findUserById(createResult);
            res.status(201).json(newUserDB!);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async deleteUser(req: Request, res: Response) {
        try {
            const deleteResult = await this.userService.deleteUser(req.params.id);
            if (deleteResult) {
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async getUsers(req: Request<{}, {}, {}, TypeUserPagination>, res: Response<PaginatorUserViewModel>) {
        try {
            const users = await this.userQueryRepository.findUsers(req.query);
            res.status(200).json(users);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
}