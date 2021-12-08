const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');


router.get('/me', async(req,res)=>{
    const user = await User.findOne({_id: req.user._id}).select('-password');
    res.send(user);
});

router.post('/', async(req, res)=> {
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