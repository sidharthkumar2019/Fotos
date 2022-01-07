const express = require('express');
const router = express.Router();
const {Image, validate} = require('../models/image');
const {Category} = require('../models/category');
const multer = require('multer');
const auth = require('../middleware/auth');
var fs = require('fs');

// set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

// To check file type
const fileFilter = (req, file, cb)=> {
    // reject 
    if ( file.mimetype==='image/jpeg' || file.mimetype==='image/png' )
        cb(null, true);
    else cb(null, false);
};

// Init upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024*1024*25
    }
});

router.get('/', async(req, res)=> {
    const images = await Image
        .find({})
        .select(['name', 'description', 'img', 'category', 'userId', 'likes', 'dislikes']);
    res.send(images);   
});

router.get('/:id', async(req, res)=> {
    const image = await Image.findById(req.params.id).select('name description _id img');
    if ( !image )  return res.status(400).send('Invalid image ID.');
    res.send(image);   
});


router.post('/', auth, upload.single('img'), async(req, res)=> {
    const error = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findOne({_id: req.body.categoryId});
    if (!category) return res.status(400).send('Invalid category');

    let uid;
    if ( req.body.userId )  uid = req.body.userId;
    else {
        // parse the jwt in cookies to get uid
        uid = parseJwt(req.cookies['o-auth-token'])._id;
    }

    const image = new Image({
        name: req.body.name,
        description: req.body.description,
        userId: uid,
        img: req.file.path,
        category: {
            _id: category._id,
            name: category.name
        }
    });

    await image.save();

    res.redirect('http://localhost:3000/');
});

router.put('/:id', auth, async(req, res)=> {
    // user can update only that image which was uploaded by him
    const image = await Image.findById(req.params.id);
    if ( image.userId != req.body.userId ) 
        return res.status(400).send('This is not an image uploaded by you.');

    if (req.body.name) image.name = req.body.name;
    if (req.body.description) image.description = req.body.description;

    await image.save();
    res.send(image);
});

router.delete('/:id', auth, async(req, res)=> {
    let image = await Image.findById(req.params.id);
    if ( !image ) return res.status(404).send('Image with given id was not found.');
    
    let uid;
    if ( req.body.userId )  uid = req.body.userId;
    else {
        // parse the jwt in cookies to get uid
        uid = parseJwt(req.headers['o-auth-token'])._id;
    }
    if ( image.userId != uid ) 
        // return res.status(401).send('This is not an image uploaded by you.');
        return;

    // delete file named 'sample.txt'
    fs.unlink(`${image.img}`, function (err) {
        if (err) return res.send('No such image found');
        // if no error, file has been deleted successfully
        console.log('File deleted!');
    });
    image = await Image.deleteOne({_id: image._id});
    
    res.send(image);
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/fer-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

module.exports = router;