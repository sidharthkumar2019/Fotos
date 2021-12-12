const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        trim: true,
        required: true
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 250,
        default: "This is the default description."
    },
    img: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    category: {
        // embedded category object
        type: categorySchema,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
});

const Image = mongoose.model('Image', imageSchema);

function validateImage(image) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(5).max(250),
        userId: Joi.string().required(),
        categoryId: Joi.string().required()
    });
}

exports.Image = Image;
exports.imageSchema = imageSchema;
exports.validate = validateImage;