const {User}=require('../../../models/user');
const auth=require('../../../middlewares/auth');
const mongoose=require('mongoose');
describe('auth middleware',()=>{
    it('should populate req.user with the payload of valid JWT',()=>{
        
        const user=new User({_id:mongoose.Types.ObjectId(),isAdmin:true});
        const token= new User(user).generateAuthToken();
        const req={
            header:jest.fn().mockReturnValue(token)
        };
        const res={};
        const next=jest.fn();
        auth(req,res,next);
        expect(req.user).toHaveProperty('_id',user._id.toHexString());
        expect(req.user).toHaveProperty('isAdmin',true);

    });
});