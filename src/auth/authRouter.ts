import { Router } from "express";
import { AuthController } from "./authController";
import { authCheckValidation,
    inputCheckErrorsMiddleware,
    registrationEmail,
    validationCode,
    userRegistrationValidation,
    emailForPasswordRecoveryValidation,
    passwordAndCodeForRecoveryValidation } from "../middlewares/express-validator";
import { countDocumentApi } from "../middlewares/middlewareForAll";
import { bearerAuth, checkRefreshToken } from "../middlewares/middlewareForAll";
import { authContainer } from "./composition-root";

export const authRouter = Router();

const authController = authContainer.resolve(AuthController)

authRouter.post("/login", countDocumentApi, authCheckValidation, inputCheckErrorsMiddleware, authController.authLoginUser.bind(authController));
authRouter.post("/password-recovery", countDocumentApi, emailForPasswordRecoveryValidation, inputCheckErrorsMiddleware, authController.authPasswordRecovery.bind(authController));
authRouter.post("/new-password", countDocumentApi, passwordAndCodeForRecoveryValidation, inputCheckErrorsMiddleware, authController.authNewPassword.bind(authController));
authRouter.post("/refresh-token", checkRefreshToken, authController.authRefreshToken.bind(authController));
authRouter.post("/registration", countDocumentApi, userRegistrationValidation, inputCheckErrorsMiddleware, authController.authRegistration.bind(authController));
authRouter.post("/registration-confirmation", countDocumentApi, validationCode, inputCheckErrorsMiddleware, authController.authRegistrationConfirmation.bind(authController));
authRouter.post("/registration-email-resending", countDocumentApi, registrationEmail, inputCheckErrorsMiddleware, authController.authRegistrationEmailResending.bind(authController));
authRouter.post("/logout", checkRefreshToken, authController.authLogout.bind(authController));
authRouter.get("/me", bearerAuth, authController.getUserInform.bind(authController));