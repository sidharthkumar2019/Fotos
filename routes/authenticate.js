const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const axios = require('axios');

router.post('/', async(req, res)=> {
    const {error} = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid user or password.');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid user or password.');

    const token = user.generateAuthToken();
    
    res.cookie('o-auth-token', token, {
        maxAge: 10*24*60*60*1000,
        httpOnly: true
    });
    const result = await axios.get('http://localhost:3000/api/images');
    const images = result.data;
    res.render('index', { images: images, layout: './layouts/layout-loggedin'});
});

function validateAuth(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(req);
}

module.exports = router;