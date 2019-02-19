const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');

let server;
describe('genres test', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        server.close();
        await Genre.remove({});
    });

    describe('Get /', () => {
        it('Getting all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });
    describe('Get /:id', () => {
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre.id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/' + 1);
            expect(res.status).toBe(404);

        });
    });
    describe('Post /', () => {
        let token;
        let res;
        let name;
        function exec() {
            return request(server).post('/api/genres').set('x-auth-token', token).send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('Should return 401 if client is not logged in', async () => {
            token = '';
            res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 400 if genre name is less than 5 characters', async () => {
            name = 'ge';
            res = await exec();
            expect(res.status).toBe(400);


        });

        it('Should return 400 if genre name is more than 100 characters', async () => {

            name = new Array(102).join('a');

            res = await exec();
            expect(res.status).toBe(400);


        });

        it('Should save the genre if it is valid', async () => {
            res = await exec();
            const genre = await Genre.find({ name });
            expect(genre).not.toBe(null);

        });

        it('Should return the genre if it is valid', async () => {

            res = await exec();
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('_id');

        });
    });
    describe('Put /', () => {

        let token;
        let res;
        let name;
        let id;
        function exec() {
            return request(server).put('/api/genres/' + id).set('x-auth-token', token).send({ name });
        }

        beforeEach(async() => {
            token = new User().generateAuthToken();
            genre = new Genre({ name: 'default' });
            await genre.save();
            name = 'New genre';
            id = genre._id;
        });
        it('Should return 401 if client is not logged in', async () => {
            token = '';
            res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 400 if genre name is less than 5 characters', async () => {
            name = 'ge';
            res = await exec();
            expect(res.status).toBe(400);


        });

        it('Should return 400 if genre name is more than 100 characters', async () => {

            name = new Array(102).join('a');

            res = await exec();
            expect(res.status).toBe(400);


        });
        it('Should return the genre if it is valid', async () => {

            res = await exec();
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('_id');

        });
        it('Should return 404 if the genre does not exist', async () => {
            id = new mongoose.Types.ObjectId();
            res = await exec();
            expect(res.status).toBe(404);


        });

        it('Should return 404 if the genre id is invalid', async () => {
            id = 1;
            res = await exec();
            expect(res.status).toBe(404);


        });

        it('Should return the updated genre from the database if the genre id is valid', async () => {
            
            await exec();
            res = await Genre.findById(id);
            expect(res.name).toBe(name);


        });
    });

    describe('delete /',()=>{
        let token;
        let res;
        let name;
        let id;
        async function exec(){
            return request(server).delete('/api/genres/'+id).set('x-auth-token',token).send({name});
        }
        beforeEach(async() => {
            token = new User({isAdmin:true}).generateAuthToken();
            name = 'deletedgenre';
            genre = new Genre({ name });
            await genre.save();
                     id = genre._id;
        });
        it('Should return 401 if client is not logged in', async () => {
            token = '';
            res = await exec();
            expect(res.status).toBe(401);
        });

        it('Should return 403 if client is not authorized', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            res = await exec();
            expect(res.status).toBe(403);
        });

        it('Should return 404 if id is invalid', async () => {
            id=1;
            res = await exec();
            expect(res.status).toBe(404);
        });

        it('Should return 401 if genre does not exist', async () => {
           id=new mongoose.Types.ObjectId();
            res = await exec();
            expect(res.status).toBe(404);
        });

        it('Should return the deleted genre if deleted', async () => {
            
            res = await exec(); 
            expect(res.body).toHaveProperty('name',name);
            expect(res.body).toHaveProperty('_id',id.toHexString());
        });
        it('Should return null if the genre is deleted', async () => {
            
            await exec();
            res =Genre.findById(id);
            expect(res.body).toBeUndefined();
        });
        
    });
});
