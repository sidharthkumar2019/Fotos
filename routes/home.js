const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async(req, res)=>{
    const result = await axios.get('http://localhost:3000/api/images');
    const images = result.data;
    res.render('index', {images: images});
});

router.get('/about', (req, res)=> {
    res.render('about');
});

module.exports = router;