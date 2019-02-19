
const express=require('express');
const Joi=require('joi');
const mongoose=require('mongoose');

const genreSchema=new mongoose.Schema({
    name:{type:String,
        required:true,
    minlength:3,
    maxlength:100}
});

const Genre=mongoose.model('Genre',genreSchema);


function validate(genre){
    const schema={name:Joi.string().min(3).max(100).required()};
    return Joi.validate(genre,schema);
}

module.exports.validateGenre=validate;
module.exports.Genre=Genre;
module.exports.genreSchema=genreSchema;