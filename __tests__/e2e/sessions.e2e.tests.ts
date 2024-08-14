import { app } from "../../src/app";
import { agent } from "supertest";
export const req = agent(app);

import mongoose from "mongoose";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "../../src/middlewares/middlewareForAll";

let refreshToken: any;
describe('SessionsControllers', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('GET /sessions', () => {
        it('should return all sessions and return 200 status', async () => {
            const res = await req
        .post(SETTINGS.PATH.AUTH +"/login")
        .send({
            loginOrEmail: "login123",
            password: "password",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie']).toBeDefined();
        const cookies = res.headers['set-cookie'];
        if (!cookies || !Array.isArray(cookies)) {
            console.error('No cookies found or cookies are not an array');
            return;
        }
        cookies.forEach(cookie => {
            const [name, value] = cookie.split(';')[0].split('=');
            if (name === 'refreshToken') {
                refreshToken = value;
            }
        })

        await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Bearer ${refreshToken}`);
        expect(200);
        });
        it('should return 401 if access token is invalid', async () => {
            const res = await req
        .post(SETTINGS.PATH.AUTH +"/login")
        .send({
            loginOrEmail: "login123",
            password: "password",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.headers['set-cookie']).toBeDefined();
        const cookies = res.headers['set-cookie'];
        if (!cookies || !Array.isArray(cookies)) {
            console.error('No cookies found or cookies are not an array');
            return;
        }
        cookies.forEach(cookie => {
            const [name, value] = cookie.split(';')[0].split('=');
            if (name === 'refreshToken') {
                refreshToken = value;
            }
        })

        await req
        .get(SETTINGS.PATH.SECURITY +"/devices")
        .set('Authorization', `Beare ${refreshToken}`);
        expect(401);
        });
    });
    describe('DELETE /sessions/:id', () => {
        it('should delete session by ID and return 204 status', async () => {
            const userId = req.user._id;
            const device_id = req.deviceId;
            await req
                .delete(`/security/devices/${device_id}`)
                .set('Authorization', `Bearer ${refreshToken}`)
                .expect(204);
        });
        it('should return 401 if session is not Authorization', async () => {
            const accessToken = 'validAccessToken';
            const invalidSessionId = 'invalidSessionId';

            await req
                .delete(`/security/devices//${invalidSessionId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
        it('should return 404 if session ID is invalid', async () => {
            const accessToken = 'validAccessToken';
            const invalidSessionId = 'invalidSessionId';

            await req
                .delete(`/security/devices/${invalidSessionId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
        it("shouldn't return 403", async () => { // если пытаться удалить deviceId другого пользователя
            const res = await req
            .delete(SETTINGS.PATH.SECURITY +"/devices/1")
            .set('Authorization', `Bearer ${refreshToken}`);
            expect(403);
    });
    });
    describe('DELETE /sessions', () => {
        it('should delete all sessions except current one and return 204 status', async () => {

            await req
                .delete(SETTINGS.PATH.SECURITY)
                .set('Authorization', `Bearer ${refreshToken}`)
                .expect(204);
        });
        it('should return 401 if refresh token is invalid', async () => {
            const invalidAccessToken = 'invalidAccessToken';
            await req
                .delete(SETTINGS.PATH.SECURITY)
                .set('Authorization', `Bearer ${invalidAccessToken}`)
                .expect(401);
        });
    });
});