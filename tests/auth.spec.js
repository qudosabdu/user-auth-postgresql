const request = require('supertest');
const app = require('../app');

describe('Authentication', () => {
    it('should register a user successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail registration with missing fields', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty('errors');
    });

    it('should log in a user successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'jane.doe@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail login with incorrect password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'jane.doe@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Authentication failed');
    });
});
