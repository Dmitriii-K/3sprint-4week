import { Request, Response } from "express";
import { LoginInputModel, LoginSuccessViewModel, NewPasswordRecoveryInputModel, RegistrationConfirmationCodeModel, RegistrationEmailResending } from "../input-output-types/auth-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { UserInputModel } from "../input-output-types/users-type";
import { MeViewModel } from "../input-output-types/auth-type";
import { IAuthService, IAuthRepository, IBcryptService, IJwtService } from "./authInterface";

export class AuthController {

    constructor(private authService: IAuthService, private authRepository: IAuthRepository, private bcryptService: IBcryptService, private jwtService: IJwtService) {}

    async authLoginUser(req: Request<{}, {}, LoginInputModel>, res: Response<LoginSuccessViewModel | OutputErrorsType>) {
        try {
            const authUser = await this.authService.checkCredentials(req.body.loginOrEmail);
            if (!authUser) {
                res.status(401).json({ errorsMessages: [{ field: 'user', message: 'user not found' }] });
                return;
            } else {
                const isCorrect = await this.bcryptService.comparePasswords(req.body.password, authUser?.password);
                if (isCorrect) {
                    const { accessToken, refreshToken } = this.jwtService.generateToken(authUser);
                    await this.authService.createSession(authUser._id.toString(), refreshToken, req.headers["user-agent"] || "unknown", req.ip || "unknown");
                    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
                        .status(200).json({ accessToken });
                    return;
                } else {
                    res.status(401).json({ errorsMessages: [{ field: 'password and login', message: 'password or login is wrong' }] });
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authPasswordRecovery(req: Request<{}, {}, RegistrationEmailResending>, res: Response) {
        try {
            await this.authService.passwordRecovery(req.body.email);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authNewPassword(req: Request<{}, {}, NewPasswordRecoveryInputModel>, res: Response) {
        try {
            const newPassword = await this.authService.newPassword(req.body);
            if (newPassword) {
                res.sendStatus(204);
            } else {
                res.status(400).json({ errorsMessages: [{ message: "Code validation failure", field: "recoveryCode" }] });
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authRefreshToken(req: Request, res: Response) {
        try {
            const device = await this.authRepository.findSessionFromDeviceId(req.deviceId);
            if (!device) {
                res.sendStatus(401);
                return;
            }
            const result = await this.authService.updateRefreshToken(req.user, req.deviceId);

            const { accessToken, refreshToken } = result;
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
                .status(200).json({ accessToken });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authRegistration(req: Request<{}, {}, UserInputModel>, res: Response) {
        try {
            const registrationResult = await this.authService.registerUser(req.body);
            if (registrationResult) {
                res.sendStatus(204);
            } else {
                res.sendStatus(400);
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authRegistrationConfirmation(req: Request<{}, {}, RegistrationConfirmationCodeModel>, res: Response) {
        try {
            const result = await this.authService.confirmEmail(req.body.code);
            if (result) {
                res.sendStatus(204);
            } else {
                res.status(400).send({ errorsMessages: [{ field: "code", message: " Code validation failure " }] })
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authRegistrationEmailResending(req: Request<{}, {}, RegistrationEmailResending>, res: Response) {
        try {
            const emailResending = await this.authService.resendEmail(req.body.email);
            if (emailResending) {
                res.sendStatus(204);
            } else {
                res.status(400).json({ errorsMessages: [{ message: 'other error', field: 'email', }] });
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async authLogout(req: Request, res: Response) {
        try {
            const device = await this.authRepository.findSessionFromDeviceId(req.deviceId);
            if (!device) {
                res.sendStatus(401);
                return;
            }
            const result = await this.authService.authLogoutAndDeleteSession(req.deviceId);
            if (result) {
                res.clearCookie('refreshToken');
                res.sendStatus(204);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async getUserInform(req: Request, res: Response<MeViewModel>) {
        try {
            const { login, email, _id } = req.user;
            const result = { login, email, userId: _id.toString() };
            res.status(200).json(result!);
            return;
        } catch (error) {
            console.log(error);
        }
    }
}