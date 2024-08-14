import { app } from "../../src/app";
import { agent } from "supertest";
export const req = agent(app);

import mongoose from "mongoose";
import { SETTINGS } from "../../src/settings";

describe('AuthController', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('POST /auth/login', () => {
        it('should login user and return 200 status with access token', async () => {
            const loginData = {
                loginOrEmail: 'testuser',
                password: 'testpassword'
            };
            const response = await req
                .post('/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
        });

        it('should return 401 if credentials are invalid', async () => {
            const invalidLoginData = {
                loginOrEmail: 'invaliduser',
                password: 'invalidpassword'
            };

            await req
                .post('/auth/login')
                .send(invalidLoginData)
                .expect(401);
        });
    });
    describe('POST /auth/password-recovery', () => {
        it('should send password recovery email and return 204 status', async () => {
            const recoveryData = {
                email: 'testuser@example.com'
            };

            await req
                .post('/auth/password-recovery')
                .send(recoveryData)
                .expect(204);
        });

        it('should return 505 if email is invalid', async () => {
            const invalidRecoveryData = {
                email: 'invaliduser@example.com'
            };

            await req
                .post('/auth/password-recovery')
                .send(invalidRecoveryData)
                .expect(505);
        });
    });
    describe('POST /auth/new-password', () => {
        it('should set new password and return 204 status', async () => {
            const newPasswordData = {
                newPassword: 'newpassword',
                recoveryCode: 'validRecoveryCode'
            };

            await req
                .post('/auth/new-password')
                .send(newPasswordData)
                .expect(204);
        });

        it('should return 400 if recovery code is invalid', async () => {
            const invalidNewPasswordData = {
                newPassword: 'newpassword',
                recoveryCode: 'invalidRecoveryCode'
            };

            await req
                .post('/auth/new-password')
                .send(invalidNewPasswordData)
                .expect(400);
        });
    });
    describe('POST /auth/refresh-token', () => {
        it('should refresh token and return 200 status with new access token', async () => {
            const refreshToken = 'validRefreshToken';

            const response = await req
                .post('/auth/refresh-token')
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
        });

        it('should return 401 if refresh token is invalid', async () => {
            const invalidRefreshToken = 'invalidRefreshToken';

            await req
                .post('/auth/refresh-token')
                .set('Cookie', `refreshToken=${invalidRefreshToken}`)
                .expect(401);
        });
    });
    describe('POST /auth/registration', () => {
        it('should register user and return 204 status', async () => {
            const registrationData = {
                login: 'newuser',
                password: 'newpassword',
                email: 'newuser@example.com'
            };

            await req
                .post('/auth/registration')
                .send(registrationData)
                .expect(204);
        });

        it('should return 400 if user already exists', async () => {
            const existingUser = {
                login: 'existinguser',
                password: 'existingpassword',
                email: 'existinguser@example.com'
            };

            await req
                .post('/auth/registration')
                .send(existingUser)
                .expect(400);
        });
    });
    describe('POST /auth/registration-confirmation', () => {
        it('should confirm registration and return 204 status', async () => {
            const confirmationData = {
                code: 'validConfirmationCode'
            };

            await req
                .post('/auth/registration-confirmation')
                .send(confirmationData)
                .expect(204);
        });

        it('should return 400 if confirmation code is invalid', async () => {
            const invalidConfirmationData = {
                code: 'invalidConfirmationCode'
            };

            await req
                .post('/auth/registration-confirmation')
                .send(invalidConfirmationData)
                .expect(400);
        });
    });
    describe('POST /auth/registration-email-resending', () => {
        it('should resend confirmation email and return 204 status', async () => {
            const resendData = {
                email: 'testuser@example.com'
            };

            await req
                .post('/auth/registration-email-resending')
                .send(resendData)
                .expect(204);
        });

        it('should return 400 if email is invalid', async () => {
            const invalidResendData = {
                email: 'invaliduser@example.com'
            };

            await req
                .post('/auth/registration-email-resending')
                .send(invalidResendData)
                .expect(400);
        });
    });
    describe('POST /auth/logout', () => {
        it('should logout user and return 204 status', async () => {
            const refreshToken = 'validRefreshToken';

            await req
                .post('/auth/logout')
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(204);
        });

        it('should return 401 if refresh token is invalid', async () => {
            const invalidRefreshToken = 'invalidRefreshToken';

            await req
                .post('/auth/logout')
                .set('Cookie', `refreshToken=${invalidRefreshToken}`)
                .expect(401);
        });
    });
    describe('GET /auth/me', () => {
        it('should return user information and return 200 status', async () => {
            const accessToken = 'validAccessToken';

            const response = await req
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('email');
            expect(response.body).toHaveProperty('login');
            expect(response.body).toHaveProperty('userId');
        });

        it('should return 401 if access token is invalid', async () => {
            const invalidAccessToken = 'invalidAccessToken';

            await req
                .get('/auth/me')
                .set('Authorization', `Bearer ${invalidAccessToken}`)
                .expect(401);
        });
    });
});