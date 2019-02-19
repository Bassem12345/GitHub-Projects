
const Joi=require('joi');
const mongoose=require('mongoose');
const moment = require('moment');


const customerSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
});
const movieSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 3,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
});
const rentalSchema=new mongoose.Schema({
    customer:{
        type:customerSchema,
        required:true},
    movie:{type:movieSchema,
        required:true},
    dateOut:
    {
        type:Date,
        required:true,
        default:Date.now
    },
    dateReturned:{
        type:Date
        
    },
    rentalFee:{
        type:Number,
        min:0
    }

});
rentalSchema.statics.lookup=function(customerId,movieId){
  return this.findOne({ 'customer._id': customerId, 'movie._id': movieId });
}
rentalSchema.methods.calcRentalFee=function(){
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * (this.movie.dailyRentalRate);
}
const Rental=mongoose.model('rental',rentalSchema);

function validate(rental){
    const schema={customerId:Joi.objectId().required(),
                movieId:Joi.objectId().required(),
               
            };
                
    return Joi.validate(rental,schema);
}
module.exports.validateRental=validate;
module.exports.Rental=Rental;