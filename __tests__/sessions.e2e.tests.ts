import request from 'supertest';
const app = require('./app'); // Путь к вашему основному файлу приложения

describe('SessionsControllers', () => {
    describe('DELETE /sessions', () => {
        it('should delete all sessions except current one and return 204 status', async () => {
            const accessToken = 'validAccessToken';

            await request(app)
                .delete('/sessions')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should return 401 if access token is invalid', async () => {
            const invalidAccessToken = 'invalidAccessToken';

            await request(app)
                .delete('/sessions')
                .set('Authorization', `Bearer ${invalidAccessToken}`)
                .expect(401);
        });
    });
    describe('DELETE /sessions/:id', () => {
        it('should delete session by ID and return 204 status', async () => {
            const accessToken = 'validAccessToken';
            const sessionId = 'validSessionId';

            await request(app)
                .delete(`/sessions/${sessionId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should return 404 if session ID is invalid', async () => {
            const accessToken = 'validAccessToken';
            const invalidSessionId = 'invalidSessionId';

            await request(app)
                .delete(`/sessions/${invalidSessionId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });

        it('should return 403 if user is not authorized to delete the session', async () => {
            const accessToken = 'validAccessToken';
            const unauthorizedSessionId = 'unauthorizedSessionId';

            await request(app)
                .delete(`/sessions/${unauthorizedSessionId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(403);
        });
    });
    describe('GET /sessions', () => {
        it('should return all sessions and return 200 status', async () => {
            const accessToken = 'validAccessToken';

            const response = await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });

        it('should return 401 if access token is invalid', async () => {
            const invalidAccessToken = 'invalidAccessToken';

            await request(app)
                .get('/sessions')
                .set('Authorization', `Bearer ${invalidAccessToken}`)
                .expect(401);
        });
    });
});