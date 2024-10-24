const User = require('../models/User');
const bcrypt = require('bcrypt');


const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

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

        // Perform full update (replacing the resource)
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true, overwrite: true } // Use `overwrite: true` for full replacement
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}

// DELETE a user
exports.deleteUser = async (req, res) => {
    try{
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