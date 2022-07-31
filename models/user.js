const Joi = require('joi');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const config = require('config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    bio: {
        type: String,
        maxlength: 500
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'Link'
    }],
    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, firstName: this.firstName, lastName: this.lastName }, config.get('jwtPrivateKey'))
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(2).max(30).required(),
        firstName: Joi.string().min(2).max(30).required(),
        lastName: Joi.string().min(2).max(30).required(),
        email: Joi.string().min(2).max(100).required().email(),
        bio: Joi.string().max(500),
        password: Joi.string().min(8).max(1024).required()
    });
    return schema.validate(user);
};

exports.User = User
exports.validateUser = validateUser
exports.userSchema = userSchema