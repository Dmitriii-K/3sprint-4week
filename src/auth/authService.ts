import {randomUUID} from "crypto";
import {add} from "date-fns"; 
import { UserDBModel, UserInputModel } from "../input-output-types/users-type";
import { bcryptService } from "../adapters/bcrypt";
import { passwordRecovery, sendMailService } from "../adapters/sendEmail";
import { AuthRepository } from "./authRepository";
import { WithId } from "mongodb";
import { jwtService } from "../adapters/jwtToken";
import { SessionsType } from "../input-output-types/sessions-types";
import { NewPasswordRecoveryInputModel } from "../input-output-types/auth-type";

export const authService = {
    async checkCredentials(loginOrEmail: string) {
        const user = await AuthRepository.findUserByLogiOrEmail(loginOrEmail);
        if(user) {
            return user;
        } else {
            return null;
        }
    },
    async updateRefreshToken(user:WithId<UserDBModel>, deviceId: string) {
        const newPairTokens = jwtService.generateToken(user,deviceId);
        const {accessToken, refreshToken} = newPairTokens;
        const payload = jwtService.getUserIdByToken(refreshToken);
        if(!payload) throw new Error('пейлода нет, хотя он должен быть после создания новой пары')
        let {iat} = payload;
        iat = new Date(iat * 1000).toISOString();
        await AuthRepository.updateIat(iat,deviceId);
        return {accessToken, refreshToken}
    },
    async registerUser(data:UserInputModel) {
        const checkUser = await AuthRepository.checkUserByRegistration(data.login, data.email);
        if(checkUser !== null) return;
        const password = await bcryptService.createHashPassword(data.password)//создать хэш пароля
        const newUser: UserDBModel = { // сформировать dto юзера
            login: data.login,
            email: data.email,
            password,
            createdAt: new Date().toString(),
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: (add(new Date(), {hours: 1, minutes: 30,})).toISOString(),
                isConfirmed: false
            }
        };
        await AuthRepository.createUser(newUser); // сохранить юзера в базе данных
        await sendMailService.sendMail(newUser.email ,newUser.emailConfirmation.confirmationCode);
        // console.log(newUser);
        return newUser;
    },
    async confirmEmail(code: string) {
        const user: WithId<UserDBModel> | null = await AuthRepository.findUserByCode(code);
        if(!user) return false;
        if(user.emailConfirmation.isConfirmed) return false;
        if(user.emailConfirmation.confirmationCode !== code ) return false;
        if(user.emailConfirmation.expirationDate < new Date().toISOString()) return false;
            const result = await AuthRepository.updateConfirmation(user._id)
            // console.log(result);
            return result;
    },
    async resendEmail(mail: string) {
        const user: WithId<UserDBModel> | null = await AuthRepository.findUserByEmail(mail);
        if(!user) return false;
        if(user.emailConfirmation.isConfirmed) return false;
        const newCode = randomUUID();
        await  Promise.all([
        AuthRepository.updateCode(user._id.toString(), newCode),
        await sendMailService.sendMail(mail, newCode)
        ])
        // console.log(result);
        return true;
    },
    async createSession(userId: string, token: string, userAgent: string, ip: string) {
        const payload = jwtService.getUserIdByToken(token);
        let {iat, exp, deviceId} = payload!;
        iat = new Date(iat * 1000).toISOString();
        exp = new Date(exp * 1000).toISOString();
        const newSession: SessionsType = {
            user_id: userId,
            device_id: deviceId,
            iat: iat,
            exp: exp,
            device_name: userAgent,
            ip: ip
        }
        await AuthRepository.createSession(newSession);
    },
    async authLogoutAndDeleteSession(deviceId: string) {
        const deletedSession = await AuthRepository.deleteSession(deviceId);
        if(deletedSession) {
            return true
                } else {
            return false
            }
    },
    async newPassword(data: NewPasswordRecoveryInputModel): Promise<boolean> {
        // Проверяем, существует ли пользователь с таким кодом восстановления
        const user: WithId<UserDBModel> | null = await AuthRepository.findUserByCode(data.recoveryCode);
        // console.log(user)
            if(!user) return false; // Пользователь не найден или код недействителен
            if(user.emailConfirmation.confirmationCode !== data.recoveryCode ) return false;
        // Хешируем новый пароль
        const password = await bcryptService.createHashPassword(data.newPassword);
        // Обновляем пароль пользователя
        const result = await AuthRepository.updatePassword(user._id.toString(), password)
        if(result) {
            return true
                } else {
            return false
            }
    },
    async passwordRecovery(mail: string): Promise<boolean> {
        // Проверяем, существует ли пользователь с таким email
        const user: WithId<UserDBModel> | null = await AuthRepository.findUserByEmail(mail);
            if(!user)return false; // Пользователь не найден
        // Генерируем код восстановления
        const recoveryCode = randomUUID();
            AuthRepository.updateCode(user._id.toString(), recoveryCode),
            await passwordRecovery.sendMail(mail, recoveryCode)
        return true;
    }
    // async authUserLogout(token: string) {
    //     const invalidToken = await AuthRepository.insertTokenFromDB(token);
    //     if(invalidToken) {
    //         return true
    //     } else {
    //         return false
    //     };
    // }
};
