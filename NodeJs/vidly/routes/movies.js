 const express=require('express');
 const {Movie,validateMovie}=require('../models/movie');
 const {Genre}=require('.././models/genre');
 const mongoose = require('mongoose');
 const auth=require('../middlewares/auth');

 const router=express.Router();

    router.get('/',async (req,res)=>{
    const movies=await Movie.find().select('title dailyRentalRate numberInStock').sort('numberInStock');
    res.send(movies);
    });
    router.post('/',auth,async(req,res)=>{
        const {error}=validateMovie(req.body);
        if(error)return res.status(400).send(error.details[0].message);
        const genre= await Genre.findById(req.body.genreId);
        if(!genre) return res.status(404).send('Genre Not found');
        let movie=new Movie({title:req.body.title,
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate,
            genre:{_id:req.body.genreId,
                name:genre.name}});   
            
        movie=await movie.save();
        res.send(movie);
    });

    router.put('/:id',async (req,res)=>{
        const {error}=validateMovie(req.body);
        if(error)
           return res.status(400).send(error.details[0].message);
           const genre=await Genre.findById(req.body.genreId);
           if(!genre) return res.status(404).send('Genre was not found');
        const movie=await Movie.findByIdAndUpdate(req.params.id,
        {title:req.body.title,
            numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{
            _id:req.body.genreId,
            name:genre.name
        }},
       {new:true});

    if(!movie)
        return res.status(404).send('The movie with the given ID was not found');
    
    res.send(movie);
    });
    
    router.delete('/:id',async (req,res)=>{
        const movie=await Movie.findByIdAndRemove(req.params.id);
        if(!movie)
           return res.status(404).send('The movie with the given ID was not found');
            res.send('Deleted!');
    });

    router.get('/:id',async(req,res)=>{
const movie =await Movie.findById(req.params.id).select('title dailyRentalRate numberInStock').sort('numberInStock');
if(!movie)
           return res.status(404).send('The movie with the given ID was not found');
           res.send(movie);
    });

 module.exports=router;
