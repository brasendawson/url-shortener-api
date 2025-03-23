import request from 'supertest';
import app from '../index.js';

describe('URL Shortener API', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        token = res.body.token;
    });

    test('should create short url', async () => {
        const res = await request(app)
            .post('/api/url/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                origUrl: 'https://example.com'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('shortUrl');
    });
});