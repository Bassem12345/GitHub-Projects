
const express=require('express');
const Joi=require('joi');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');

const userSchema=new mongoose.Schema({
    name:{type:String,
        required:true,
    minlength:3,
    maxlength:100},
    email:{type:String,
            unique:true,
            required:true,
            minlength:3,
            maxlength:255},
    password:{type:String,
        required:true,
        minlength:3,
        maxlength:1024} ,
    isAdmin:{type:Boolean}           

});
userSchema.methods.generateAuthToken=generateAuthToken;
const User=mongoose.model('user',userSchema);

function validate(user){
    const schema={name:Joi.string().min(3).max(100).required(),
                 email:Joi.string().min(3).max(255).required().email(),
                 password:Joi.string().min(3).max(255).required()};
    return Joi.validate(user,schema);
}

function generateAuthToken(){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}

module.exports.validateUser=validate;
module.exports.User=User;
