import request from 'supertest';
const app = require('./app');  // Путь к вашему основному файлу приложения

describe('CommentsController', () => {
    describe('GET /comments/:id', () => {
        it('should return a comment and return 200 status', async () => {
            const commentId = 'validCommentId';

            const response = await request(app)
                .get(`/comments/${commentId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('content');
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).toHaveProperty('commentatorInfo');
            expect(response.body).toHaveProperty('likesInfo');
        });

        it('should return 404 if comment does not exist', async () => {
            const invalidCommentId = 'invalidCommentId';

            await request(app)
                .get(`/comments/${invalidCommentId}`)
                .expect(404);
        });
    });
    describe('PUT /comments/:id', () => {
        it('should update a comment and return 204 status', async () => {
            const commentId = 'validCommentId';
            const updateData = {
                content: 'Updated comment content'
            };
            const accessToken = 'validAccessToken';

            await request(app)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(204);
        });

        it('should return 403 if user is not authorized to update the comment', async () => {
            const commentId = 'validCommentId';
            const updateData = {
                content: 'Updated comment content'
            };
            const invalidAccessToken = 'invalidAccessToken';

            await request(app)
                .put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${invalidAccessToken}`)
                .send(updateData)
                .expect(403);
        });

        it('should return 404 if comment does not exist', async () => {
            const invalidCommentId = 'invalidCommentId';
            const updateData = {
                content: 'Updated comment content'
            };
            const accessToken = 'validAccessToken';

            await request(app)
                .put(`/comments/${invalidCommentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(404);
        });
    });
    describe('PUT /comments/:id/like-status', () => {
        it('should update like status and return 204 status', async () => {
            const commentId = 'validCommentId';
            const likeStatusData = {
                likeStatus: 'Like'
            };
            const accessToken = 'validAccessToken';

            await request(app)
                .put(`/comments/${commentId}/like-status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(likeStatusData)
                .expect(204);
        });

        it('should return 404 if comment does not exist', async () => {
            const invalidCommentId = 'invalidCommentId';
            const likeStatusData = {
                likeStatus: 'Like'
            };
            const accessToken = 'validAccessToken';

            await request(app)
                .put(`/comments/${invalidCommentId}/like-status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(likeStatusData)
                .expect(404);
        });
    });
    describe('DELETE /comments/:id', () => {
        it('should delete a comment and return 204 status', async () => {
            const commentId = 'validCommentId';
            const accessToken = 'validAccessToken';

            await request(app)
                .delete(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204);
        });

        it('should return 403 if user is not authorized to delete the comment', async () => {
            const commentId = 'validCommentId';
            const invalidAccessToken = 'invalidAccessToken';

            await request(app)
                .delete(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${invalidAccessToken}`)
                .expect(403);
        });

        it('should return 404 if comment does not exist', async () => {
            const invalidCommentId = 'invalidCommentId';
            const accessToken = 'validAccessToken';

            await request(app)
                .delete(`/comments/${invalidCommentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
    });
});