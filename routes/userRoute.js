const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');

const jwt = { jwtAuthMiddleWare, generateToken } = require('./jwt');

//Post route to add a person

router.post('/signup', async(req, res) => {
    const { username, email, password } = req.body;
    try {
        //check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = new User({
            username,
            email,
            password: hashPassword
        });

        //save user to the database
        await newUser.save();
        res.status(400).json({ message: "User created successfully" });

    } catch (err) {
        console.log('Error signing up error', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Login route
router.post('/login', async(req, res) => {
    const { username, password } = req.body();
    try {
        //check  if username or password is missing
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and Password required' });

        }
        //Find the user by username
        const user = await User.findOne({ username: username });
        //if user doesn't exist or password doesn't match return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or Password' });
        }
        //if user and password are correct,generate token (JWT) and send it's to the client
        const token = generateToken(user);
        res.status(200).json({ token });

    } catch (err) {
        console.log("Error logging in user", err);
        res.status(500).json({ error: "Internal Server error" });

    }

});

//Profile Route

router.get('/profile', jwtAuthMiddleWare, async(req, res) => {
    try {
        //retrieve the user information from the request body

        const user = req.user;
        const userData = {
            username: user.username,
            email: user.email,
        };
        res.status(400).json(userData);

    } catch (err) {
        console.log("Error fetching user profile", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//update the password

router.put('profile/password', jwtAuthMiddleWare, async(req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        // check if current password and new password present in the body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: ' Both currentPassword and newPassword is required in the body' });
        }
        // fill the user by userId
        const user = await User.findById(userId);

        //If user doesn't exist and password doesn't match
        if (!user || !(await user.comparePassword(currentPassword))) {
            res.status(400).json({ error: 'Invalid current Password' });
        }
        //Update the new password
        user.password = newPassword;
        await user.save();

        console.log('Password updated');
        res.status(200).json({ message: 'password updated' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error' });
    }
});





module.exports = router;