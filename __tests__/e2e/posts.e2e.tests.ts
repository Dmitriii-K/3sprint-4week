import { app } from "../../src/app";
import { agent } from "supertest";
export const req = agent(app);

import mongoose from "mongoose";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "../../src/middlewares/middlewareForAll";
import { PostModel } from "../../src/db/schema-model-db";
import { jwtService } from "../../src/adapters/jwtToken";

describe('PostController', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('POST /posts', () => {
        it('should create a new post and return 201 status', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);
            console.log(createBlogResponse.body.id)

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const response = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.shortDescription).toBe(newPost.shortDescription);
            expect(response.body.content).toBe(newPost.content);
            expect(response.body.blogId).toBe(newPost.blogId);
        });

        it('should return 401 if not Authorization', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            await req
                .post('/posts')
                .send(newPost)
                .expect(401);
        });
    });
    describe('POST /posts/:id/comments', () => {
        it('should create a new comment for a post and return 201 status', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const newComment = {
                content: 'This is a test comment'
            };

            const user = 'some-user-id'; // Замените на фактический ID пользователя
            const bearerToken = jwtService.generateToken(user);
            const response = await req
                .post(`/posts/${createPostResponse.body.id}/comments`)
                .set({ Authorization: `Bearer ${bearerToken}` })
                .send(newComment)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.content).toBe(newComment.content);
        });

        it('should return 404 if post does not exist', async () => {
            const newComment = {
                content: 'This is a test comment'
            };

            const user = 'some-user-id'; // Замените на фактический ID пользователя
            const bearerToken = jwtService.generateToken(user);
            const nonExistentPostId = '123'
            await req
                .post(`/posts/${nonExistentPostId}/comments`)
                .set({ Authorization: `Bearer ${bearerToken}` })
                .send(newComment)
                .expect(404);
        });
        it('should return 401 if not Authorization', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const newComment = {
                content: 'This is a test comment'
            };

            const bearerToken = "gjgjgjgkkgkg"
            await req
                .post(`/posts/${createPostResponse.body.id}/comments`)
                .set({ Authorization: `Bearer ${bearerToken}` })
                .send(newComment)
                .expect(401);
        });
    });
    describe('GET /posts', () => {
        it('should return a list of posts', async () => {
            const response = await req
                .get('/posts')
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });
    });
    describe('GET /posts/:id', () => {
        it('should return a post by ID', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const response = await req
                .get(`/posts/${createPostResponse.body.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.shortDescription).toBe(newPost.shortDescription);
            expect(response.body.content).toBe(newPost.content);
            expect(response.body.blogId).toBe(newPost.blogId);
        });

        it('should return 404 if post does not exist', async () => {
            const nonExistentPostId = '603c7bfb4b97f4a3e0ccb4a2'; // Несуществующий ID
            await req
                .get(`/posts/${nonExistentPostId}`)
                .expect(404);
        });
    });
    describe('GET /posts/:id/comments', () => {
        it('should return comments for a post', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const newComment = {
                content: 'This is a test comment'
            };

            const user = 'some-user-id'; // Замените на фактический ID пользователя
            const bearerToken = jwtService.generateToken(user);
            await req
                .post(`/posts/${createPostResponse.body.id}/comments`)
                .set({ Authorization: `Bearer ${bearerToken}` })
                .send(newComment)
                .expect(201);

            const response = await req
                .get(`/posts/${createPostResponse.body.id}/comments`)
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        it('should return 404 if post does not exist', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const newComment = {
                content: 'This is a test comment'
            };

            const user = 'some-user-id'; // Замените на фактический ID пользователя
            const bearerToken = jwtService.generateToken(user);
            await req
                .post(`/posts/${createPostResponse.body.id}/comments`)
                .set({ Authorization: `Bearer ${bearerToken}` })
                .send(newComment)
                .expect(201);

            const nonExistentPostId = '603c7bfb4b97f4a3e0ccb4a2'; // Несуществующий ID
            await req
                .get(`/posts/${nonExistentPostId}/comments`)
                .expect(404);
        });
    });
    describe('PUT /posts/:id', () => {
        it('should update a post and return 204 status', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const updatedPost = {
                title: 'Updated Post',
                shortDescription: 'This is an updated post',
                content: 'This is the updated content of the post',
                blogId: createBlogResponse.body.id
            };

            await req
                .put(`/posts/${createPostResponse.body.id}`)
                .set({ Authorization: "Basic " + codedAuth })
                .send(updatedPost)
                .expect(204);
        });
        it('should  return 401 status', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const updatedPost = {
                title: 'Updated Post',
                shortDescription: 'This is an updated post',
                content: 'This is the updated content of the post',
                blogId: createBlogResponse.body.id
            };

            await req
                .put(`/posts/${createPostResponse.body.id}`)
                .set({ Authorization: "Basi " + codedAuth })
                .send(updatedPost)
                .expect(401);
        });
        it('should return 404 if post does not exist', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const updatedPost = {
                title: 'Updated Post',
                shortDescription: 'This is an updated post',
                content: 'This is the updated content of the post',
                blogId: createPostResponse.body.id
            };

            const nonExistentPostId = '603c7bfb4b97f4a3e0ccb4a2'; // Несуществующий ID
            await req
                .put(`/posts/${nonExistentPostId}`)
                .set({ Authorization: "Basic " + codedAuth })
                .send(updatedPost)
                .expect(404);
        });
    });
    describe('DELETE /posts/:id', () => {
        it('should delete a post and return 204 status', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            await req
                .delete(`/posts/${createPostResponse.body.id}`)
                .set({ Authorization: "Basic " + codedAuth })
                .expect(204);
        });
        it('should return 404 if post does not exist', async () => {
            const nonExistentPostId = '603c7bfb4b97f4a3e0ccb4a2'; // Несуществующий ID
            await req
                .delete(`/posts/${nonExistentPostId}`)
                .set({ Authorization: "Basic " + codedAuth })
                .expect(404);
        });
        it('should return 401 if not Authorization', async () => {
            await PostModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };
            const createBlogResponse = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post',
                blogId: createBlogResponse.body.id
            };

            const createPostResponse = await req
                .post('/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            await req
                .delete(`/posts/${createPostResponse.body.id}`)
                .set({ Authorization: "Basi " + codedAuth })
                .expect(401);
        });
    });
});