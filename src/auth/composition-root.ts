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

export const container = new Container();

container.bind(AuthController).to(AuthController);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IJwtService>(TYPES.IJwtService).to(JwtService);
container.bind<IBcryptService>(TYPES.IBcryptService).to(BcryptService);