import { app } from "../../src/app";
import { agent } from "supertest";
export const req = agent(app);

import mongoose from "mongoose";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "../../src/middlewares/middlewareForAll";
import { UserModel } from "../../src/db/schema-model-db";


describe('UserController', () => {
    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })
    describe('POST /users', () => {
        it('should create a new user and return 201 status', async () => {
            await UserModel.deleteMany({});
            const newUser = {
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            };

            const response = await req
                .post(SETTINGS.PATH.USERS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newUser)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.login).toBe(newUser.login);
            expect(response.body.email).toBe(newUser.email);
        });

        it('should return 400 if user with the same login or email already exists', async () => {
            await UserModel.deleteMany({});
            const existingUser = {
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            };

            // Создаем пользователя, чтобы протестировать дубликат
            await req
                .post(SETTINGS.PATH.USERS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(existingUser)
                .expect(201);

            const response = await req
                .post(SETTINGS.PATH.USERS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(existingUser)
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{ message: 'email and login should be unique', field: 'email and login' }]
            });
        });
    });
    describe('DELETE /users/:id', () => {
        it('should delete a user and return 204 status', async () => {
            await UserModel.deleteMany({});
            const newUser = {
                login: 'todelete',
                password: 'password123',
                email: 'todelete@example.com'
            };

            const createResponse = await req
                .post(SETTINGS.PATH.USERS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newUser)
                .expect(201);

            console.log(createResponse.body.id)
            await req
                .delete(`/users/${createResponse.body.id}`)
                .set({ Authorization: "Basic " + codedAuth })
                .expect(204);
        });

        it('should return 404 if user does not exist', async () => {
            const nonExistentUserId = '603c7bfb4b97f4a3e0ccb4a2'; // Несуществующий ID

            await req
                .delete(SETTINGS.PATH.USERS +nonExistentUserId)
                .expect(404);
        });
    });
    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const response = await req
                .get(SETTINGS.PATH.USERS)
                .set({ Authorization: "Basic " + codedAuth })
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });
    });
});