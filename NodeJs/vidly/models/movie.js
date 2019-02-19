const express=require('express');
const Joi=require('joi');
const mongoose=require('mongoose');
const {genreSchema}=require('./genre');

const movieSchema=new mongoose.Schema({
    title:{type:String,required:true,min:3,max:255},
    numberInStock:{type:Number,min:0,max:255,required:true},
    dailyRentalRate:{type:Number,min:0,max:255,required:true},
    genre:{type:genreSchema,required:true}

});

const Movie=mongoose.model('movie',movieSchema);

function validate(movie){
    const schema={title:Joi.string().min(3).max(255).required(),
        numberInStock:Joi.number().min(0).max(255).required(),
        dailyRentalRate:Joi.number().min(0).max(255).required(),
        genreId:Joi.string().required()};
        
    return Joi.validate(movie,schema);
}
module.exports.validateMovie=validate;
module.exports.Movie=Movie;
