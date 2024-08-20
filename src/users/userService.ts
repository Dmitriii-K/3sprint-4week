import { injectable } from "inversify";
import { UserDBModel, UserInputModel } from "../input-output-types/users-type";
import { IBcryptService, IUserRepository, IUserService } from "./userInterface";

@injectable()
export class UserService implements IUserService {

    constructor(private userRepository: IUserRepository, private bcryptService: IBcryptService) {}

    async createUser(data: UserInputModel) {
        const userExist = await this.userRepository.findUserByLogiOrEmail({ login: data.login, email: data.email });
        if (userExist) {
            return false;
        }
        const userPassword = await this.bcryptService.createHashPassword(data.password);

        const createDate = new Date().toISOString();
        const newUser: UserDBModel = {
            login: data.login,
            password: userPassword,
            email: data.email,
            createdAt: createDate,
            emailConfirmation: {
                confirmationCode: "",
                expirationDate: "",
                isConfirmed: true
            }
        };
        return this.userRepository.insertUser(newUser);
    }
    async deleteUser(id: string) {
        return this.userRepository.deleteUser(id);
    }
}