const express = require('express');
const router = express.Router();
const axios = require('axios');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', async(req, res)=>{
    const result = await axios.get('http://localhost:3000/api/images');
    const images = result.data;
    res.render('index', {images: images, layout: './layouts/layout'});
});

router.get('/about', (req, res)=> {
    res.render('about', {layout: './layouts/layout'});
});

router.get('/login', (req, res)=> {
    res.render('login', {layout: './layouts/layout'});
});

router.get('/register', (req, res)=> {
    res.render('register', {layout: './layouts/layout'});
});

router.get('/me', async(req, res)=> {
    // console.log(`Our auth token: ${req.cookies.jwt}`);
    const token = req.cookies['o-auth-token'];
    const result = parseJwt(token);
    const user = await axios.get( 'http://localhost:3000/api/users/me',{
        _id: result._id,
        headers: {'o-auth-token': token}
    });
    console.log(user.name);
    res.render('me', {user: user, layout:'./layouts/layout-loggedin'});
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


module.exports = router;