const Joi = require('joi');
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    },
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 500
    },
    caption: {
        type: String,
        maxlength: 500
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        content: Joi.string().min(2).max(500).required(),
        caption: Joi.string().min(2).max(500).required(),
    });
    return schema.validate(post);
};

exports.Post = Post
exports.validatePost = validatePost
exports.postSchema = postSchema