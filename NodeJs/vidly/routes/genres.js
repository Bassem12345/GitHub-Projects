const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAdmin = require('../middlewares/admin');
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middlewares/auth');
const validateObjectId=require('../middlewares/validateObjectId');

router.get('/', async (req, res, next) => {
    const genres = await Genre.find().select('name').sort('name');
    res.send(genres);

});
router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({ name: req.body.name });

    genre = await genre.save();
    res.send(genre);
});

router.put('/:id',[auth,validateObjectId], async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const genre = await Genre.findByIdAndUpdate(req.params.id,
        { name: req.body.name },
        { new: true });

    if (!genre)
        return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
});

router.delete('/:id', [auth, checkAdmin,validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});

router.get('/:id', validateObjectId,async (req, res) => {
   

    const genre = await Genre.findById(req.params.id);
    if (!genre)
        return res.status(404).send('The genre with the given ID was not found');
    res.send(genre);
});


module.exports = router;