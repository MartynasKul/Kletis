const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

//Needs some more added to this
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        // Verify the refresh token
        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ userId: user._id, type: user.type }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        return res.sendStatus(403);
    }
};

//Needs some more added to this
exports.logoutUser = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.sendStatus(204);
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
        user.refreshToken = null;
        await user.save();
    }

    res.sendStatus(204); // No content
};

// GET all users

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (error) {
        res.status(500).json({error: 'Error fetching users'})
    }
}

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error: 'Invalid email'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(404).json({error: 'Invalid password'})
        }

        const token = jwt.sign({id: user._id, type: user.type }, process.env.JWT_SECRET, {expiresIn: '1h'})

        res.json({token})

    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Error logging in'})
    }
}
// GET a single user by ID

exports.getUserById = async (req, res) => {
    try {
        if(req.params.id.length !== 24) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
}

// POST a new user
exports.createUser = async (req, res) => {
    try {
        const {username, email, password, type} = req.body

        const validTypes = ['admin', 'mod', 'guest']
        if (!validTypes.includes(type)) {
            return res.status(422).json({error: 'Invalid user type. Valid types are: admin, mod, guest'})
        }

        if (!isValidEmail(email)) {
            return res.status(422).json({error: 'Invalid email format.'})
        }
        if(!username || !email || !password || !type) {
            return res.status(422).json({error: 'Cannot be empty fields in username, email, password or type'})
        }
        const newUser = new User({
            username,
            email,
            password,
            type,
            created_at: new Date(),
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(error) {
        if (error.code === 11000) {
            res.status(400).json({error: 'Email already exists'})
        } else {
            res.status(500).json({error: 'Error creating user'})
        }
    }
}

// PUT (update) an existing user

exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, type } = req.body;
        const validTypes = ['admin', 'mod', 'guest'];

        // Check for missing required fields
        if (!username || !email || !type) {
            return res.status(422).json({ error: 'Missing required fields: username, email, or type' });
        }

        if (req.user.id !== req.params.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to update this user' });
        }


        // Validate user type
        if (!validTypes.includes(type)) {
            return res.status(422).json({ error: 'Invalid user type. Valid types are: admin, mod, guest' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(422).json({ error: 'Invalid email format' });
        }

        // Prepare updated data
        let updatedData = { username, email, type };

        // Hash the password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (type && type !== existingUser.type) {
            if (req.user.type !== 'admin') {
                return res.status(403).json({error: 'You do not have permission to change the user type'});
            }

            // Perform full update (replacing the resource)
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                updatedData,
                {new: true, runValidators: true, overwrite: true} // Use `overwrite: true` for full replacement
            );

            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).json({error: 'User not found'})
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}

// DELETE a user
exports.deleteUser = async (req, res) => {
    try{

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: 'User not found' })
        }
        if (req.user.id !== id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this user' });
        }
        const deletedUser = await User.findByIdAndDelete(req.params.id)

        if(deletedUser){
            res.json(deletedUser)
        } else{
            res.status(404).json({error: 'User not found'})
        }
    } catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error deleting user'})
    }
}