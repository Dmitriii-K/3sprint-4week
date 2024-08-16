import { ObjectId, WithId } from "mongodb";
import { NewPasswordRecoveryInputModel } from "../input-output-types/auth-type";
import { SessionsType } from "../input-output-types/sessions-types";
import { UserDBModel, UserInputModel } from "../input-output-types/users-type";
import { UnionPayload } from "../adapters/jwtToken";

export interface IAuthService {
    checkCredentials(loginOrEmail: string): Promise<WithId<UserDBModel> | null>;
    createSession(userId: string, refreshToken: string, userAgent: string, ip: string): Promise<any>;
    passwordRecovery(email: string): Promise<boolean>;
    newPassword(data: NewPasswordRecoveryInputModel): Promise<boolean>;
    updateRefreshToken(user: WithId<UserDBModel>, deviceId: string): Promise<{ accessToken: string, refreshToken: string }>;
    registerUser(user: UserInputModel): Promise<UserDBModel | undefined>;
    confirmEmail(code: string): Promise<boolean>;
    resendEmail(email: string): Promise<boolean>;
    authLogoutAndDeleteSession(deviceId: string): Promise<boolean>;
}

export interface IAuthRepository {
    findSessionFromDeviceId(deviceId: string): Promise<SessionsType | null>;
    findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDBModel> | null>;
    checkUserByRegistration(login: string, email: string): Promise<WithId<UserDBModel> | null>;
    createUser(user: UserDBModel): Promise<string>;
    findUserByCode(code: string): Promise<WithId<UserDBModel> | null>;
    updateConfirmation(userId: ObjectId): Promise<boolean>;
    findUserByEmail(email: string): Promise<WithId<UserDBModel> | null>;
    updateCode(userId: string, code: string): Promise<boolean>;
    createSession(session: SessionsType): Promise<string>;
    deleteSession(deviceId: string): Promise<boolean>;
    updatePassword(userId: string, password: string): Promise<boolean>;
    updateIat(iat: string, deviceId: string): Promise<void>;
}

export interface IBcryptService {
    comparePasswords(password: string, hash: string): Promise<boolean>;
    createHashPassword(password: string): Promise<string>;
}

export interface IEmailService {
    sendMail(email: string, confirmationCode: string): Promise<void>;
    sendPasswordRecoveryMail(email: string, recoveryCode: string): Promise<void>;
}

export interface IJwtService {
    generateToken(user: WithId<UserDBModel>, deviceId?: string): { accessToken: string, refreshToken: string };
    getUserIdByToken(token: string): UnionPayload | null;
}