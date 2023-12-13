const {User} = require('../../../models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
describe('user.generateAuthToken', ()=>{
    it('should return a valid auth token', ()=>{
        const payload = {
            id: mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        };
         const user = new User(payload);
         const token = user.generateAuthToken();
         const decoded = expect(jwt.verify(token, config.get('JwtPrivateKey')));
         //expect(decoded).toMatchObject(payload);  
    });
});