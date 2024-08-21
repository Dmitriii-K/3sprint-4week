import 'reflect-metadata';
import { Container } from 'inversify';
import { BcryptService } from '../adapters/bcrypt';
import { JwtService } from '../adapters/jwtToken';
import { EmailService } from '../adapters/sendEmail';
import { AuthController } from './authController';
import { IAuthService, TYPES, IAuthRepository, IEmailService, IJwtService, IBcryptService } from './authInterface';
import { AuthRepository } from './authRepository';
import { AuthService } from './authService';

// const authRepository = new AuthRepository();
// const bcryptService = new BcryptService();
// const jwtService = new JwtService();
// const emailService = new EmailService();
// const authService = new AuthService(authRepository, bcryptService, jwtService, emailService);
// const authController = new AuthController(authService, authRepository, bcryptService, jwtService);

export const authContainer = new Container();

authContainer.bind(AuthController).to(AuthController);
authContainer.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
authContainer.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
authContainer.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
authContainer.bind<IJwtService>(TYPES.IJwtService).to(JwtService);
authContainer.bind<IBcryptService>(TYPES.IBcryptService).to(BcryptService);