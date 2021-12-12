const express = require('express');
const router = express.Router();
const {Image, validate} = require('../models/image');
const {Category} = require('../models/category');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb)=> {
    // reject 
    if ( file.mimetype==='image/jpeg' || file.mimetype==='image/png' )
        cb(null, true);
    else cb(null, false);
};

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
        .select('img');
    res.send(images);   
});

router.get('/:id', async(req, res)=> {
    const image = await Image.findById(req.params.id).select('name description _id img');
    if ( !image )  return res.status(400).send('Invalid image ID.');
    res.send(image);   
});


router.post('/', upload.single('img'), async(req, res)=> {

    const error = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findOne({_id: req.body.categoryId});
    if (!category) return res.status(400).send('Invalid category');

    const image = new Image({
        name: req.body.name,
        description: req.body.description,
        userId: req.body.userId,
        img: req.file.path,
        category: {
            _id: category._id,
            name: category.name
        }
    });

    await image.save();

    res.send(image);
});

router.put('/name/:id', async(req, res)=> {
    const image = await Image.findById(req.params.id);
    console.log(image.userId, req.body.userId);
    if ( image.userId != req.body.userId ) 
        return res.status(400).send('This is not an image uploaded by you.');

    image.name = req.body.name;
    await image.save();
    res.send(image);
});

module.exports = router;