const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const _=require('lodash');
const {User,validateUser}=require('../models/user');
const jwt=require('jsonwebtoken');
const config=require('config');
const auth=require('../middlewares/auth');

router.get('/',async (req,res)=>{
    const users=await User.find().select('name email password').sort('name');
    res.send(users);
    });
    router.get('/me',auth,async(req,res)=>{
        const user=await User.findById(req.user._id).select('-password');
        res.send(user);
    });
    router.post('/',async(req,res)=>{
        const {error}=validateUser(req.body);
        if(error)return res.status(400).send(error.details[0].message);
        let user=await User.findOne({email:req.body.email});
        if(user) return res.status(400).send('User already exists');
        
        user=new User(_.pick(req.body,['name','email']));   
        const salt=await bcrypt.genSalt(5);
        user.password=await bcrypt.hash(req.body.password,salt);
        await user.save();
        const token=user.generateAuthToken();
        res.header('x-auth-token',token).send(_.pick(user,['name','_id','email']));
    });
    
    router.put('/:id',async (req,res)=>{
        const {error}=validateUser(req.body);
        if(error)
           return res.status(400).send(error.details[0].message);
        const user=await User.findByIdAndUpdate(req.params.id,
        {name:req.body.name},
        {new:true});

    if(!user)
        return res.status(404).send('The user with the given ID was not found');
    
    res.send(user);
    });
    
    router.delete('/:id',async (req,res)=>{
        const user=await User.findByIdAndRemove(req.params.id);
        if(!user)
           return res.status(404).send('The user with the given ID was not found');
            res.send('Deleted!');
    });

    router.get('/:id',async(req,res)=>{
const user =await User.findById(req.params.id);
if(!user)
           return res.status(404).send('The user with the given ID was not found');
           res.send(user);
    });
   
    

    module.exports=router;