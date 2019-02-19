const express=require('express');
const mongoose = require('mongoose');
const Fawn=require('fawn'); 
const {validateRental,Rental}=require('../models/rental');
const {Customer}=require('../models/customer');
const {Movie}=require('../models/movie');
const auth=require('../middlewares/auth');
const validateObjectId=require('../middlewares/validateObjectId');
const checkAdmin=require('../middlewares/admin');

const router=express.Router();
Fawn.init(mongoose);

router.get('/',async (req,res)=>{
    const rentals=await Rental.find().select('dateOut rentalFee customer movie').sort('-dateOut');
    res.send(rentals);
    });
    router.post('/',auth,async(req,res)=>{
        const {error}=validateRental(req.body);
        if(error)return res.status(400).send(error.details[0].message);
        
        const movie= await Movie.findById(req.body.movieId);
        if(!movie) return res.status(404).send('Movie Not found');
        if(movie.numberInStock==0) return res.status(400).send('Movie is not in stock');
        
        const customer= await Customer.findById(req.body.customerId);
        if(!customer) return res.status(404).send('Customer Not found');

        const rental=new Rental({movie:{title:movie.title,
            _id:req.body.movieId,
            dailyRentalRate:movie.dailyRentalRate
            },
            customer:{
                _id:req.body.customerId,
                name:customer.name,
                phone:customer.phone,
            isGold:customer.isGold}});  

        await rental.save();
        movie.numberInStock--;  
        movie.save();
        try{new Fawn.Task().save('rentals',rental)
        .update('movies',{_id:movie._id},{$inc:{numberInStock:-1}})
        .run();
        res.send(rental);}
        catch(ex){
                res.status(500).send('Something went wrong');
        }
       
    });

    router.put('/:id',[auth,validateObjectId],async (req,res)=>{
        const {error}=validateRental(req.body);
        if(error)
           return res.status(400).send(error.details[0].message);
          
           const movie=await Movie.findById(req.body.movieId);
           if(!movie) return res.status(404).send('Movie was not found');
           if(movie.numberInStock==0) return res.status(400).send('Movie is not in stock');
           const customer=await Customer.findById(req.body.customerId);
           if(!customer) return res.status(404).send('Customer was not found');
                  
        const rental=await Rental.findByIdAndUpdate(req.params.id,
        {movie:{_id:req.body.movieId,
        title:movie.title,
    dailyRentalRate:movie.dailyRentalRate},
        customer:{
            _id:req.body.customerId,
            name:customer.name,
            isGold:customer.isGold,
            phone:customer.phone
                 },
        dateReturned:req.body.dateReturned,
        rentalFee:req.body.rentalFee},
       {new:true});
       
    if(!rental)
        return res.status(404).send('The rental with the given ID was not found');
    
    res.send(rental);
    });
    
    router.delete('/:id',[auth,checkAdmin,validateObjectId],async (req,res)=>{
        const rental=await Rental.findByIdAndRemove(req.params.id);
        if(!rental)
           return res.status(404).send('The rental with the given ID was not found');
            res.send('Deleted!');
    });

    router.get('/:id',[auth,validateObjectId],async(req,res)=>{
const rental =await Rental.findById(req.params.id).select('dateOut rentalFee customer movie').sort('-dateOut');
if(!rental)
           return res.status(404).send('The rental with the given ID was not found');
           res.send(rental);
    });
    module.exports=router;


