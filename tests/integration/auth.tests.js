const winston = require('winston');
const { User } = require('../../models/users');
const { Genre } = require('../../models/genre');
const request = require('supertest');

let server;
describe('auth middleware', () => {
    // starts the server before each test
    beforeEach(() => { 
        //winston.info('Opening server .....from auth');
        server = require('../../index');
     });
    //closes the server after each test
    afterEach(async () => { await server.close(); 
        //winston.info('Closing server ....... from auth');
    });

    // set the happy path
    let token;
    const exec = () => {
        // send a request that requires authorization 
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        // do not set this to null set it to empty string
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    /*
    it('should return 400 if token is invalid', async () => {
        // a is invalid token
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    */
});