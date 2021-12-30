const express = require('express');
const router = express.Router();
const {User, validate, validateMe} = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.get('/me', auth, async(req,res)=>{
    const { error } = validateMe(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({_id: req.body._id}).select('-password');
    if (!user) return res.status(400).send('No such user exists');
    
    res.send(user);
});

router.post('/', async(req, res)=> {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already exists');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // encrypting the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('o-auth-token', token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
    
});

module.exports = router;