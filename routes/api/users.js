const express = require('express');
const router = express.Router();
// load User Model 
const User = require('../models/User');

// @route GET api/users/test

// @desc Tests users route

// @access  Public

router.get('/test', (req, res) => res.json({
    msg: 'Users Works'
}));

// @route GET api/users/register

// @desc Registeriton

// @access  Public
router.post('/register', (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: 'Email Exist'
                });
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                });
            }
        });
});

module.exports = router;