const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory (cat) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    return schema.validate(cat);
}

exports.validate = validateCategory;
exports.Category = Category;
exports.categorySchema = categorySchema;