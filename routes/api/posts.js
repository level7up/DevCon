const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post Validation
const validatePostInput = require('../../validation/post');

// Post Model
const Post = require('../../routes/models/Post');

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Posts Works'
}));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find().sort({
        date: -1
    })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostfound: 'No posts found!'
        }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'There is no post with this ID!'
        }));
});

// @route   Post api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        const {
            errors,
            isValid
        } = validatePostInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id,
        });
        newPost.save().then(post => res.json(post));
    });
// @route   DELETE api/posts/:id
// @desc    Delete post 
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        // Check post owner
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({
                                notauthorized: 'User Not Authorized!'
                            });
                        }
                        // Delete
                        post.remove().then(() => res.json({
                            success: 'True'
                        }));
                    }).catch(err => res.status(404).json({
                        postnotfound: 'Post not found!'
                    }));
            })
    });

// @route   DELETE api/posts/:id
// @desc    Delete post 
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        // Check post owner
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({
                                notauthorized: 'User Not Authorized!'
                            });
                        }
                        // Delete
                        post.remove().then(() => res.json({
                            success: 'True'
                        }));
                    }).catch(err => res.status(404).json({
                        postnotfound: 'Post not found!'
                    }));
            })
    });

// @route   Post api/posts/like/:id
// @desc    like post 
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                            return res.status(404).json({
                                alreadylike: 'User already like this post!'
                            });
                        }
                        // add user id to the likes arrays
                        post.likes.unshift({
                            user: req.user.id
                        });
                        post.save().then(post => res.json(post));

                    }).catch(err => res.status(404).json({
                        postnotfound: 'Post not found!'
                    }));
            });
    });

// @route   Post api/posts/unlike/:id
// @desc    unlike post 
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                            return res.status(404).json({
                                notliked: 'User have not like this post yet!'
                            });
                        }
                        // Get remove index
                        const removeIndex = post.likes.map(item => item.user.toString())
                            .indexOf(req.user.id);
                        // splice out of array
                        post.likes.splice(removeIndex, 1);
                        post.save().then(post => res.json(post));


                    }).catch(err => res.status(404).json({
                        postnotfound: 'Post not found!'
                    }));
            });
    });

// @route   POST api/posts/comment/:id
// @desc    add comment to a post 
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        const {
            errors,
            isValid
        } = validatePostInput(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        Post.findById(req.params.id).then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id,
            }
            // Add to comments Array
            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));
        }).catch(err => res.status(404).json({
            postnotfound: 'No post found!'
        }));
    });


// @route   DELETE api/posts/comment/:id
// @desc    Remove comment 
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {
    session: false
}),
    (req, res) => {
        Post.findById(req.params.id).then(post => {
            // check if comment exist
            if (post.comments.filter(comment => comment._id.toString() == req.params.comment_id).length === 0) {
                return res.status(404).json({
                    notexist: 'Comment dosnt exist!'
                });
            }
            // Get remove index
            const removeIndex = post.comments.map(item => item.user.toString())
                .indexOf(req.user.comment_id);
            // splice out of array
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));



        }).catch(err => res.status(404).json({
            postnotfound: 'No post found!'
        }));
    });


module.exports = router;