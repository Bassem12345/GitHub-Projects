const {Rental} = require('../../../models/rental');
const mongoose = require('mongoose');
const request=require('supertest');
const {User}=require('../../../models/user');
const moment=require('moment');
const {Movie}=require('../../../models/movie');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let res;
    let returned;
    function exec(){
        return request(server).post('/api/returns').set('x-auth-token',token).send(returned);
    }
    beforeEach(async () => {
        server = require('../../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        genreId=mongoose.Types.ObjectId();
        token =new User().generateAuthToken();
        returned={movieId,customerId};
        movie=new Movie({
                _id:movieId,
                title:'hashasha',
                dailyRentalRate: 2,
                numberInStock:10,
                genre:{
                    _id:genreId,
                    name:'genre1'
                }
               
        });
        await movie.save();
        rental = new Rental({
            customer: {
                name: 'name1',
                phone: 'phone1',
                _id: customerId
            },
            movie: {
                _id: movieId,
                title:movie.title,
                dailyRentalRate:movie.dailyRentalRate
            }

        });
        await rental.save();
    });
    afterEach(async () => {
        server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if the client is not logged in', async () => {
        token='';
        res=await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if the client id is not provided',async()=>{
        returned={movieId};
        res=await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if the movie id is not provided',async()=>{
        returned={customerId};
        res=await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if the no rental found for the movie\customer combination',async()=>{
        customerId=mongoose.Types.ObjectId();
        movieId=mongoose.Types.ObjectId();
        returned={customerId,movieId};
        res=await exec();
        expect(res.status).toBe(404);
    });
    it('should return 400 if the rental is already processed',async()=>{
        rental.dateReturned=new Date();
        await rental.save();
        res=await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if the rental is valid',async()=>{
        
        res=await exec();
        expect(res.status).toBe(200);
    });

    it('should set the returnDate if the rental is valid',async()=>{
        
        res=await exec();
        const rentalDB=await Rental.findById(rental._id);
        const diff=new Date()-rentalDB.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    });

    it('should set the rentalfee if the rental is valid',async()=>{
        
        rental.dateOut=moment().add(-7,'days').toDate();
        await rental.save();
        res=await exec();
        const rentalDB=await Rental.findById(rental._id);
        expect(rentalDB.rentalFee).toBe(14);
    });

    it('should increase the movie stock if the rental is valid',async()=>{
        res=await exec();
        const movieDB=await Movie.findById(movie._id);
        expect(movieDB.numberInStock).toBe(movie.numberInStock+1);
    });

    it('should return the rental if the rental is valid',async()=>{
        console.log(rental.movie.title);
        res=await exec();
        const rentalDB=await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie']));
    });
});
