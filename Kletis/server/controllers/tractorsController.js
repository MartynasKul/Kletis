const Post = require('../models/Post');
const User = require('../models/User');
const Tractor = require('../models/Tractor');
const mongoose = require("mongoose");

// Utility function to handle expand logic
const applyExpand = (query, expand) => {
    if (expand) {
        const expandFields = expand.split(',');
        if (expandFields.includes('created_by')) {
            query = query.populate('created_by', 'username email'); // Select specific fields for performance
        }
    }
    return query;
};

// GET all tractors
exports.getAllTractors = async (req, res) => {
    try {
        const { expand } = req.query;
        let tractorsQuery = Tractor.find();

        // Apply expand logic
        tractorsQuery = applyExpand(tractorsQuery, expand);

        const tractors = await tractorsQuery;
        res.json(tractors);
    } catch (error) {
        console.error("Error fetching all tractors:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET a tractor by ID
exports.getTractorById = async (req, res) => {
    try {
        const { expand } = req.query;
        const tractorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(tractorId)) {
            return res.status(400).json({ error: 'Invalid Tractor ID' });
        }

        let tractorsQuery = Tractor.findById(tractorId);

        // Apply expand logic
        tractorsQuery = applyExpand(tractorsQuery, expand);

        const tractor = await tractorsQuery;
        if (!tractor) {
            return res.status(404).json({ error: 'No Tractor found with this ID' });
        }

        res.json(tractor);
    } catch (error) {
        console.error("Error fetching tractor by ID:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST a new tractor
exports.createTractor = async (req, res) => {
    try {
        const { name, description, created_by } = req.body;

        if (!name || !description || !created_by) {
            return res.status(422).json({ error: 'Name, description, and created_by are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(created_by)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        const user = await User.findById(created_by);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingTractor = await Tractor.findOne({ name });
        if (existingTractor) {
            return res.status(403).json({ error: 'Tractor category with this name already exists' });
        }

        const newTractor = new Tractor({
            name,
            description,
            created_by,
        });

        await newTractor.save();
        res.status(201).json(newTractor);
    } catch (error) {
        console.error("Error creating tractor:", error);
        res.status(500).json({ error: 'Failed to create tractor' });
    }
};

// PUT to update a tractor
exports.updateTractor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Tractor ID' });
        }

        if (!name || !description) {
            return res.status(422).json({ error: 'Name and description are required for a full update' });
        }

        const updatedTractor = await Tractor.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedTractor) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        res.json(updatedTractor);
    } catch (error) {
        console.error("Error updating tractor:", error);
        res.status(500).json({ error: 'Failed to update tractor' });
    }
};

// DELETE a tractor
exports.deleteTractor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Tractor ID' });
        }

        const tractor = await Tractor.findById(id);
        if (!tractor) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        // Check permissions (assuming `req.user` exists)
        if (
            tractor.created_by.toString() !== req.user.id &&
            req.user.type !== 'admin'
        ) {
            return res.status(403).json({ error: 'You do not have permission to delete this tractor' });
        }

        await tractor.deleteOne();

        // Cascade delete associated posts and their comments
        await Post.deleteMany({ tractor: id });

        res.status(204).send(); // No content, just success status
    } catch (error) {
        console.error("Error deleting tractor:", error);
        res.status(500).json({ error: 'Failed to delete tractor' });
    }
};
