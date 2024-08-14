import request from 'supertest';
const app = require('./app'); // Путь к вашему основному файлу приложения

describe('PostController', () => {
    describe('POST /posts', () => {
        it('should create a new post and return 201 status', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'validBlogId' // Предполагается, что blogId уже существует
            };

            const response = await request(app)
                .post('/posts')
                .send(newPost)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.shortDescription).toBe(newPost.shortDescription);
            expect(response.body.content).toBe(newPost.content);
            expect(response.body.blogId).toBe(newPost.blogId);
        });

        it('should return 404 if blogId does not exist', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'nonExistentBlogId'
            };

            await request(app)
                .post('/posts')
                .send(newPost)
                .expect(404);
        });
    });
    describe('POST /posts/:id/comments', () => {
        it('should create a new comment for a post and return 201 status', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'validBlogId'
            };

            const createPostResponse = await request(app)
                .post('/posts')
                .send(newPost)
                .expect(201);

            const newComment = {
                content: 'This is a test comment'
            };

            const response = await request(app)
                .post(`/posts/${createPostResponse.body.id}/comments`)
                .send(newComment)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.content).toBe(newComment.content);
        });

        it('should return 404 if post does not exist', async () => {
            const newComment = {
                content: 'This is a test comment'
            };

            await request(app)
                .post('/posts/nonExistentPostId/comments')
                .send(newComment)
                .expect(404);
        });
    });
    describe('GET /posts', () => {
        it('should return a list of posts', async () => {
            const response = await request(app)
                .get('/posts')
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });
    });
    describe('GET /posts/:id', () => {
        it('should return a post by ID', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'validBlogId'
            };

            const createPostResponse = await request(app)
                .post('/posts')
                .send(newPost)
                .expect(201);

            const response = await request(app)
                .get(`/posts/${createPostResponse.body.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.shortDescription).toBe(newPost.shortDescription);
            expect(response.body.content).toBe(newPost.content);
            expect(response.body.blogId).toBe(newPost.blogId);
        });

        it('should return 404 if post does not exist', async () => {
            await request(app)
                .get('/posts/nonExistentPostId')
                .expect(404);
        });
    });
    describe('GET /posts/:id/comments', () => {
        it('should return comments for a post', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'validBlogId'
            };

            const createPostResponse = await request(app)
                .post('/posts')
                .send(newPost)
                .expect(201);

            const newComment = {
                content: 'This is a test comment'
            };

            await request(app)
                .post(`/posts/${createPostResponse.body.id}/comments`)
                .send(newComment)
                .expect(201);

            const response = await request(app)
                .get(`/posts/${createPostResponse.body.id}/comments`)
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        it('should return 404 if post does not exist', async () => {
            await request(app)
                .get('/posts/nonExistentPostId/comments')
                .expect(404);
        });
    });
    describe('PUT /posts/:id', () => {
        it('should update a post and return 204 status', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'validBlogId'
            };

            const createPostResponse = await request(app)
                .post('/posts')
                .send(newPost)
                .expect(201);

            const updatedPost = {
                title: 'Updated Post',
                shortDescription: 'This is an updated post',
                content: 'This is the updated content of the post',
                blogId: 'validBlogId'
            };

            await request(app)
                .put(`/posts/${createPostResponse.body.id}`)
                .send(updatedPost)
                .expect(204);
        });

        it('should return 404 if post does not exist', async () => {
            const updatedPost = {
                title: 'Updated Post',
                shortDescription: 'This is an updated post',
                content: 'This is the updated content of the post',
                blogId: 'validBlogId'
            };

            await request(app)
                .put('/posts/nonExistentPostId')
                .send(updatedPost)
                .expect(404);
        });
    });
    describe('DELETE /posts/:id', () => {
        it('should delete a post and return 204 status', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: 'validBlogId'
            };

            const createPostResponse = await request(app)
                .post('/posts')
                .send(newPost)
                .expect(201);

            await request(app)
                .delete(`/posts/${createPostResponse.body.id}`)
                .expect(204);
        });

        it('should return 404 if post does not exist', async () => {
            await request(app)
                .delete('/posts/nonExistentPostId')
                .expect(404);
        });
    });
});