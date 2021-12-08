const express = require('express');
const router = express.Router();
const {Category, validate} = require('../models/category');

router.get('/', async(req,res)=>{
    const categories = await Category.find().sort('name');
    res.send(categories);
});

router.get('/:id', async(req,res)=>{
    const category = await Category.findOne({_id: req.params.id});
    res.send(category);
});

router.post('/', async(req, res)=> {
    // also authenticate and authorise the user first using middlewares

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const category = new Category({ name: req.body.name });
    await category.save();

    res.send(category);
});

router.put('/:id', async(req, res)=> {
    // also authenticate and authorise the user first using middlewares

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if ( !category ) return res.status(404).send('Category with given id was not found.');

    res.send(category);
});

router.put('/:id', async(req, res)=> {
    // also authenticate and authorise the user first using middlewares

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if ( !category ) return res.status(404).send('Category with given id was not found.');

    res.send(category);
});

router.delete('/:id', async(req, res)=> {
    // also authenticate and authorise the user first using middlewares

    const category = await Category.findByIdAndDelete(req.params.id);
    if ( !category ) return res.status(404).send('Category with given id was not found.');

    res.send(category);
});

module.exports = router;