import { app } from "../../src/app";
import { agent } from "supertest";
export const req = agent(app);

import mongoose from "mongoose";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "../../src/middlewares/middlewareForAll";
import { BlogModel} from "../../src/db/schema-model-db";

describe('BlogController', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('POST /blogs', () => {
        it('should create a new blog and return 201 status', async () => {
            await BlogModel.deleteMany({});
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };

            const response = await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newBlog)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newBlog.name);
            expect(response.body.description).toBe(newBlog.description);
            expect(response.body.websiteUrl).toBe(newBlog.websiteUrl);
        });

        it('should return 400 if blog creation fails', async () => {
            const invalidBlog = {
                name: '', // Invalid name
                description: 'This is a test blog',
                websiteUrl: 'https://testblog.com'
            };

            await req
                .post(SETTINGS.PATH.BLOGS)
                .set({ Authorization: "Basic " + codedAuth })
                .send(invalidBlog)
                .expect(400);
        });
    });
    describe('POST /blogs/:id/posts', () => {
        it('should create a new post for a blog and return 201 status', async () => {
            await BlogModel.deleteMany({});
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
                const blogId = createBlogResponse.body.id

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post'
            };

            const response = await req
                .post(`/blogs/${blogId}/posts`)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.shortDescription).toBe(newPost.shortDescription);
            expect(response.body.content).toBe(newPost.content);
        });

        it('should return 404 if blog does not exist', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post'
            };

            await req
                .post('/blogs/non-existent-id/posts')
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(404);
        });
    });
    describe('GET /blogs', () => {
        it('should return a list of blogs', async () => {
            const response = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });
    });
    describe('GET /blogs/:id', () => {
        it('should return a blog by ID', async () => {
            await BlogModel.deleteMany({});
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

            const response = await req
                .get(`/blogs/${createBlogResponse.body.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newBlog.name);
            expect(response.body.description).toBe(newBlog.description);
            expect(response.body.websiteUrl).toBe(newBlog.websiteUrl);
        });

        it('should return 404 if blog does not exist', async () => {
            await req
                .get('/blogs/non-existent-id')
                .expect(404);
        });
    });
    describe('GET /blogs/:id/posts', () => {
        it('should return posts for a blog', async () => {
            await BlogModel.deleteMany({});
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
                content: 'This is the content of the test post'
            };

            await req
                .post(`/blogs/${createBlogResponse.body.id}/posts`)
                .set({ Authorization: "Basic " + codedAuth })
                .send(newPost)
                .expect(201);

            const response = await req
                .get(`/blogs/${createBlogResponse.body.id}/posts`)
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        it('should return 404 if blog does not exist', async () => {
            await req
                .get('/blogs/non-existent-id/posts')
                .expect(404);
        });
    });
    describe('PUT /blogs/:id', () => {
        it('should update a blog and return 204 status', async () => {
            await BlogModel.deleteMany({});
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

            const updatedBlog = {
                name: 'Updated Blog',
                description: 'This is an updated blog',
                websiteUrl: 'https://updatedblog.com'
            };

            await req
                .put(`/blogs/${createBlogResponse.body.id}`)
                .set({ Authorization: "Basic " + codedAuth })
                .send(updatedBlog)
                .expect(204);
        });

        it('should return 404 if blog does not exist', async () => {
            const updatedBlog = {
                name: 'Updated Blog',
                description: 'This is an updated blog',
                websiteUrl: 'https://updatedblog.com'
            };

            await req
                .put('/blogs/non-existent-id')
                .set({ Authorization: "Basic " + codedAuth })
                .send(updatedBlog)
                .expect(404);
        });
    });
    describe('DELETE /blogs/:id', () => {
        it('should delete a blog and return 204 status', async () => {
            await BlogModel.deleteMany({});
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

            await req
                .delete(`/blogs/${createBlogResponse.body.id}`)
                .set({ Authorization: "Basic " + codedAuth })
                .expect(204);
        });

        it('should return 404 if blog does not exist', async () => {
            await req
                .delete('/blogs/non-existent-id')
                .set({ Authorization: "Basic " + codedAuth })
                .expect(404);
        });
    });
});