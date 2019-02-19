const {User}=require('../../../models/user');
const config=require('config');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');

describe('User Authentication Test',()=>{
    it('Should return a valid web token',()=>{
        const payload={_id:new mongoose.Types.ObjectId().toHexString(),isAdmin:true};
        const user=new User(payload);
        const token=user.generateAuthToken();
       const decoded= jwt.verify(token,config.get('jwtPrivateKey'));
       expect(decoded).toMatchObject(payload);
    });
});