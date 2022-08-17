const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash')
const { User, validateUser} = require('../models/user')
//const auth = require('../middleware/auth') //authorization
const validateObjectId = require('../middleware/validateObjectId')

//create new user
router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user_email = await User.findOne( { email: req.body.email })
    if( user_email ) return res.status(400).send('User is already registered')

    const user_username = await User.findOne( { username: req.body.username })
    if( user_username ) return res.status(400).send('Username is taken')

    const user = new User(_.pick(req.body, [
     'username', 'firstName','lastName',
     'email', 'bio', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();
    // const token = user.generateAuthToken();
    // res.header('x-auth-token', token)
    // .header('access-control-expose-headers', 'x-auth-token')
    // .send(_.pick(user, ['_id', 'username', 'firstName',
    // 'lastName', 'email', 'bio'
    // ]));
    res.send(user)
});

/*
follow a user
    1. add to the following of the current user 
        and 
    2. add to the followers of the followed user
*/
//auth
router.put("/:id/follow", validateObjectId, async(req, res) => {
    if(req.body.userId === req.params.id) {
        return res.send('You cannot follow yourself')
    }
    const currentUser = await User.findById(req.body.userId)
    const user = await User.findById(req.params.id)
    if(!user.followers.includes(req.body.userId)) {
        await user.updateOne({$push: { followers: req.body.userId }})
        await currentUser.updateOne({$push: { followings: req.params.id }})
    } else {
        res.send('You have already followed this account')
    }
    res.send('You successfully followed this account');
});

//unfollow a user
//auth
router.put("/:id/unfollow", validateObjectId, async(req, res) => {
    if(req.body.userId === req.params.id) {
        return res.send('You cannot unfollow yourself')
    }
    const currentUser = await User.findById(req.body.userId)
    const user = await User.findById(req.params.id)
    if(user.followers.includes(req.body.userId)) {
        await user.updateOne({$pull: { followers: req.body.userId }})
        await currentUser.updateOne({$pull: { followings: req.params.id }})
    } else {
        res.send('You have not followed this account')
    }
    res.send('You successfully unfollowed this account');
});

// update user info (bio and first/last name for now)
//auth
router.put('/:id', validateObjectId, async (req, res) => {
    const { error } = validateCompany(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    if(req.body.userId !== req.params.id && !req.body.isAdmin) {
        return res.status(400).send('You can only update your account');
    }
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    })
    if(!user) return res.status(404).send('The user was not found');

    res.send('Account updated successfully!')
});


//delete an account
//auth
router.delete('/:id', validateObjectId, async (req, res) => {
    if(req.body.userId !== req.params.id && !req.body.isAdmin) {
        return res.status(400).send('You can only delete your account');
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if(!user) return res.status(404).send('The user was not found');

    res.send('Account deleted successfully!')
});

//get user by id
//auth
router.get('/:id', validateObjectId, async (req, res) => {
    const user = await User.findById(req.body.id)
    .populate('followers', 'username')
    .populate('followings', 'username')
    .populate('posts')
    .select('-password');
    if(!user) return res.status(404).send('The user was not found');
    res.send(user);
});

module.exports = router
