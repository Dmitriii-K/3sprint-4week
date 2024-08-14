import { Request, Response } from "express";
import { LoginInputModel, LoginSuccessViewModel, NewPasswordRecoveryInputModel, RegistrationConfirmationCodeModel, RegistrationEmailResending } from "../input-output-types/auth-type";
import { OutputErrorsType } from "../input-output-types/output-errors-type";
import { jwtService } from "../adapters/jwtToken";
import { UserInputModel } from "../input-output-types/users-type";
import { MeViewModel } from "../input-output-types/auth-type";
import { authService } from "./authService";
import { bcryptService } from "../adapters/bcrypt";
import { AuthRepository } from "./authRepository";


export class AuthController {
  static authLoginUser = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response<LoginSuccessViewModel | OutputErrorsType>
  ) => {
    try {
      const authUser = await authService.checkCredentials(req.body.loginOrEmail);
      if (!authUser) {
        res.status(401).json({ errorsMessages: [{field: 'user', message: 'user not found'}] });
        return
      } else {
        const isCorrect = await bcryptService.comparePasswords(req.body.password, authUser?.password);
        if(isCorrect) {
          const{accessToken, refreshToken} = jwtService.generateToken(authUser);
          await authService.createSession(authUser._id.toString(), refreshToken, req.headers["user-agent"] || "unknown",  req.ip || "unknown");
          res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
          .status(200).json({accessToken});
          return;
        } else {
          res.status(401).json({ errorsMessages: [{field: 'password and login', message: 'password or login is wrong'}] });
          return
        }
    };
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authPasswordRecovery = async (req: Request<{}, {}, RegistrationEmailResending>, res: Response) => {
    try {
    await authService.passwordRecovery(req.body.email);
        res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authNewPassword = async (req: Request<{}, {}, NewPasswordRecoveryInputModel>, res: Response) => {
    try {
      const newPassword = await authService.newPassword(req.body);
      if (newPassword) {
        res.sendStatus(204);
      } else {
        res.status(400).json({ errorsMessages: [{ message: "Code validation failure", field: "recoveryCode" }] });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authRefreshToken = async (req: Request, res: Response) => {
    try {
      const device = await AuthRepository.findSessionFromDeviceId(req.deviceId);
      if(!device) {
        res.sendStatus(401);
        return
      }
      const result = await authService.updateRefreshToken(req.user, req.deviceId);

      const {accessToken, refreshToken} = result;
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        .status(200).json({accessToken});
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authRegistration = async (req:Request<{}, {}, UserInputModel>, res: Response) => {
    try {
      const registrationResult = await authService.registerUser(req.body);
      if(registrationResult) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
        return
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authRegistrationConfirmation = async (req: Request<{}, {}, RegistrationConfirmationCodeModel>, res: Response) => {
    try {
      const result = await authService.confirmEmail(req.body.code);
      if(result) {
        res.sendStatus(204);
      } else {
        res.status(400).send({errorsMessages: [{field: "code", message: " Code validation failure "}]})
        return
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authRegistrationEmailResending = async (req: Request<{}, {}, RegistrationEmailResending>, res: Response) => {
    try {
      const emailResending = await authService.resendEmail(req.body.email);
      if (emailResending) {
        res.sendStatus(204);
      } else {
        res.status(400).json({ errorsMessages: [{ message: 'eanother error', field: 'email',}]
        });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static authLogout = async (req: Request, res: Response) => {
    try {
      const device = await AuthRepository.findSessionFromDeviceId(req.deviceId)
      if(!device) {
        res.sendStatus(401)
        return
      }
      const result = await authService.authLogoutAndDeleteSession(req.deviceId);
      if(result) {
        res.clearCookie('refreshToken');
        res.sendStatus(204)
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(505);
    }
  }
  static getUserInform = async (req: Request, res: Response<MeViewModel>) => {
    try {
        const {login, email, _id} = req.user
        const result = {login, email, userId: _id.toString()}
        res.status(200).json(result!); 
        return;
    } catch (error) {
        console.log(error);
    }
  }
};


