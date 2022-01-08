const express = require('express');
const router = express.Router();
const axios = require('axios');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', async(req, res)=>{
    const result = await axios.get('http://localhost:3000/api/images');
    const images = result.data;

    let userAuthenticated = "1234";
    if ( req.cookies['o-auth-token'] != undefined )
        userAuthenticated = String(parseJwt(req.cookies['o-auth-token'])._id);

    res.render('index', {  user: userAuthenticated, images: images, layout: selectAptLayout(req)});
});

router.get('/about', (req, res)=> {
    res.render('about', {layout: selectAptLayout(req)});
});

router.get('/login', (req, res)=> {
    res.render('login', {layout: './layouts/layout'});
});

router.get('/register', (req, res)=> {
    res.render('register', {layout: './layouts/layout'});
});

router.get('/logout', async(req, res)=> {
    // also remove the 'o-auth-token' from the cookies
    res.status(200).clearCookie('o-auth-token');
    res.redirect('/');
});

router.get('/me', async(req, res)=> {
    const token = req.cookies['o-auth-token'];
    const result = parseJwt(token);
    
    const user = await axios.get( 'http://localhost:3000/api/users/me',{
        headers: {"o-auth-token" : token},
        data: {
            _id: result._id
        }
    });
    res.render('me', {user: user.data, layout: selectAptLayout(req)});
}); 

router.get('/addimage', async(req,res)=> {
    res.render('uploadimage', {layout: selectAptLayout(req)});
});

router.get('/deleteImage/:id', async(req, res)=> {
    if (req.cookies['o-auth-token'] === undefined)
        return res.status(401).send('You must be logged in to delete an image.');
    
    await axios.delete( `http://localhost:3000/api/images/${req.params.id}`, {
        headers: {'o-auth-token': req.cookies['o-auth-token']}
    });
    res.redirect('/');
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/fer-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function selectAptLayout (req) {
    if ( req.cookies['o-auth-token'] === undefined )
        return './layouts/layout';
    return './layouts/layout-loggedin';
}

module.exports = router;