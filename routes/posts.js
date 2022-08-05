const express = require('express');
const router = express.Router();
const _ = require('lodash')
const { Post, validatePost} = require('../models/post')
const auth = require('../middleware/auth'); //authorization
const validateObjectId = require('../middleware/validateObjectId');

//create a new post
//auth
router.post('/', async (req, res) => {
    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const newPost = await new Post(req.body)
    const savedPost = await newPost.save();
    res.send(savedPost)
});

//update a post
//auth
router.put("/:id", validateObjectId, async (req, res) => {
    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
        await post.updateOne({$set: req.body})
        res.send('Post updated successfully')
    } else {
        res.send('You can only update your posts')
    }
});

//delete a post
//auth
router.delete("/:id", validateObjectId, async (req, res) => {
    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
        await post.deleteOne()
        res.send('Post removed successfully')
    } else {
        res.send('You can only delete your posts')
    }
});


// like a post
//auth
router.put("/:id/like", validateObjectId, async (req, res) => {
    const post = await Post.findById(req.params.id);

    if(!post.likes.includes(req.body.userId)) {
        await post.updateOne({$push: { likes: req.body.userId }})
        res.send('You liked this post');
    } else {
        await post.updateOne({$pull: { likes: req.body.userId }})
        res.send('You disliked this post')
    }
});

// get a post
//auth
router.get("/:id", validateObjectId, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(post) {
        res.send(post)
    } else {
        res.send('post not found')
    }
});

// get all posts of user
// router.get("/", auth, async (req, res) => {
//     const post = await Post.findById(req.params.id);
//     if(post) {
//         res.send(post)
//     } else {
//         res.send('post not found')
//     }
// });

module.exports = router;