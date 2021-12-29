const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, 'notUsingConfigVariables');
    return token;
};

function validateUser (user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
}

function validateMe (user) {
    const schema = Joi.object({
        _id: Joi.string().required()
    });
    return schema.validate(user);
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser;
exports.validateMe = validateMe;