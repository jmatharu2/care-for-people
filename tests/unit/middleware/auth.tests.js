const {User} = require('../../../models/users');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');
const { unsubscribe } = require('../../../routes/auth');


describe('auth middleware', () => {

    it('should populate req.body with valid payload after JWT', () => {
        
        const user = {_id: mongoose.Types.ObjectId().toHexString() , isAdmin: true};

        const token = User(user).generateAuthToken();
        
        // we need to mock req, res and next functions.
        // look at the auth code to see what is needed 
        // req needs a header 
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {}; 
        const next = jest.fn();

        auth(req, res, next);

        //expect(req.user).toBeDefined();
        expect(req.user).toMatchObject(user);
        
    });

});