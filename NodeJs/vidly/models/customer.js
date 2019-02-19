const express=require('express');
const Joi=require('joi');
const mongoose=require('mongoose');

customerSchema=new mongoose.Schema({
    isGold:{type:Boolean,
   default:false},
    name:{type:String,
    required:true,
minlength:3,
maxlength:50},
phone:{type:String,
required:true,
minlength:7,
maxlength:15}
});

const Customer=mongoose.model('customer',customerSchema);

function validate(customer){
    const schema={name:Joi.string().min(3).max(50).required(),
        isGold:Joi.boolean(),
        phone:Joi.string().min(7).max(15).required()};
    return Joi.validate(customer,schema);
}

module.exports.validateCustomer=validate;
module.exports.Customer=Customer;