const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

describe('auth middleware', () => {
    let token;
    let res;
    let name;
    let server;
    beforeEach(() => {
        server = require('../../../index');
        token = new User().generateAuthToken();
        name='genre1';
    });
    afterEach(async () => {
        server.close();
        await Genre.remove({});
    });

   
    const exec = () => {
        return request(server).post('/api/genres').set('x-auth-token', token).send({ name });
    }
    it('should return 401 if token is not provided', async () => {
        token='';
        res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token='a';
        res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        
        res = await exec();
        expect(res.status).toBe(200);
    });
});