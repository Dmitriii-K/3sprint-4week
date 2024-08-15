import { Router } from "express";
import { AuthController } from "./authController";
import { authCheckValidation, inputCheckErrorsMiddleware, registrationEmail, validationCode, userRegistrationValidation, countDocumentApi, emailForPasswordRecoveryValidation, passwordAndCodeForRecoveryValidation } from "../middlewares/middlewareForAll";
import { bearerAuth, checkRefreshToken } from "../middlewares/middlewareForAll";
import { AuthService } from "./authService";
import { AuthRepository } from "./authRepository";
import { BcryptService } from "../adapters/bcrypt";

export const authRouter = Router();

const authRepository = new AuthRepository();
const bcryptService = new BcryptService();
const authService = new AuthService(authRepository, bcryptService);
const authController = new AuthController(authService, authRepository, bcryptService);

authRouter.post("/login", countDocumentApi, authCheckValidation, inputCheckErrorsMiddleware, authController.authLoginUser.bind(authController));
authRouter.post("/password-recovery", countDocumentApi, emailForPasswordRecoveryValidation, inputCheckErrorsMiddleware, authController.authPasswordRecovery.bind(authController));
authRouter.post("/new-password", countDocumentApi, passwordAndCodeForRecoveryValidation, inputCheckErrorsMiddleware, authController.authNewPassword.bind(authController));
authRouter.post("/refresh-token", checkRefreshToken, authController.authRefreshToken.bind(authController));
authRouter.post("/registration", countDocumentApi, userRegistrationValidation, inputCheckErrorsMiddleware, authController.authRegistration.bind(authController));
authRouter.post("/registration-confirmation", countDocumentApi, validationCode, inputCheckErrorsMiddleware, authController.authRegistrationConfirmation.bind(authController));
authRouter.post("/registration-email-resending", countDocumentApi, registrationEmail, inputCheckErrorsMiddleware, authController.authRegistrationEmailResending.bind(authController));
authRouter.post("/logout", checkRefreshToken, authController.authLogout.bind(authController));
authRouter.get("/me", bearerAuth, authController.getUserInform.bind(authController));