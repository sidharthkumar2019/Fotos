const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index',{ title: 'FOTOS', message: 'FOTOS HOME PAGE. Hell yea brother!' });
});

module.exports = router;