import { Router } from "express";
import { AuthController } from "./authController";
import { authCheckValidation, inputCheckErrorsMiddleware, registrationEmail, validationCode, userRegistrationValidation, countDocumentApi, emailForPasswordRecoveryValidation, passwordAndCodeForRecoveryValidation } from "../middlewares/middlewareForAll";
import { bearerAuth, checkRefreshToken } from "../middlewares/middlewareForAll";

export const authRouter = Router();

authRouter.post("/login", countDocumentApi, authCheckValidation, inputCheckErrorsMiddleware, AuthController.authLoginUser);
authRouter.post("/password-recovery", countDocumentApi, emailForPasswordRecoveryValidation, inputCheckErrorsMiddleware, AuthController.authPasswordRecovery);
authRouter.post("/new-password", countDocumentApi, passwordAndCodeForRecoveryValidation, inputCheckErrorsMiddleware, AuthController.authNewPassword);
authRouter.post("/refresh-token", checkRefreshToken, AuthController.authRefreshToken);
authRouter.post("/registration", countDocumentApi, userRegistrationValidation, inputCheckErrorsMiddleware, AuthController.authRegistration);
authRouter.post("/registration-confirmation", countDocumentApi, validationCode, inputCheckErrorsMiddleware, AuthController.authRegistrationConfirmation);
authRouter.post("/registration-email-resending", countDocumentApi, registrationEmail, inputCheckErrorsMiddleware, AuthController.authRegistrationEmailResending);
authRouter.post("/logout", checkRefreshToken, AuthController.authLogout);
authRouter.get("/me", bearerAuth, AuthController.getUserInform);
