//const { rawListeners} = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
const Tractor = require('../models/Tractor')
const mongoose = require("mongoose");

//GET all tractors
exports.getAllTractors = async (req, res) => {
    try{
        const { expand } = req.query
        let tractorsQuery = Tractor.find()

        if(expand && expand.includes('created_by')){
            tractorsquery = tractorsQuery.populate('created_by')
        }

        const tractors = await tractorsQuery
        res.json(tractors)
    }
    catch(error){
        res.status(500).json({error: 'Server error'})
    }
}

// GET a tractor by id
exports.getTractorById = async (req, res) => {
    try{
        const {expand} = req.query
        let tractorsQuery = Tractor.findById(req.params.id)

        if(expand && expand.includes('created_by')){
            tractorsquery = tractorsQuery.populate('created_by')
        }

        const tractor = await tractorsQuery
        if(tractor){
            res.json(tractor)
        }
        else{
            res.status(404).json({error: 'No Tractor found with this id'})
        }
    }
    catch(error){
        res.status(500).json({error: 'Server error'})
    }
}

// POST a new tractor
exports.createTractor = async (req, res) => {
    try {
        const { name, description, created_by } = req.body;

        // Check if 'created_by' is present
        if (!created_by) {
            return res.status(422).json({ error: 'User ID (created_by) is required' });
        }

        // Validate 'created_by' as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(created_by)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        // Check if the user exists
        const user = await User.findById(created_by);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if a tractor with the same name already exists
        const existingTractor = await Tractor.findOne({ name });
        if (existingTractor) {
            return res.status(403).json({ error: 'Tractor category with this name exists' });
        }

        // Create the new tractor
        const newTractor = new Tractor({
            name,
            description,
            created_by,
        });

        // Save and respond with the created tractor
        await newTractor.save();
        res.status(201).json(newTractor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create tractor' });
    }
}
// PUT to update a tractor
exports.updateTractor = async (req, res) => {
    /*try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Find the tractor by ID
        const tractor = await Tractor.findById(id);
        if (!tractor) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        // Update the tractor fields
        tractor.title = title || tractor.title;
        tractor.description = description || tractor.description;

        await tractor.save();
        res.json(tractor); // Send back the updated tractor
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update tractor' });
    }*/

    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate that all required fields are present
        if (!name || !description) {
            return res.status(422).json({ error: 'Name and description are required for a full update' });
        }

        // Find and update the tractor by ID
        const updatedTractor = await Tractor.findByIdAndUpdate(
            id,
            { name, description },  // Update with new data
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedTractor) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        res.json(updatedTractor); // Send back the updated tractor
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update tractor' });
    }
}

// DELETE a tractor
exports.deleteTractor = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        // Fetch the tractor to be deleted
        const tractorDeletion = await Tractor.findById(id);
        if (!tractorDeletion) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        // Check permissions
        if (tractorDeletion.created_by.toString() !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this tractor' });
        }

        // Delete the tractor
        const tractor = await Tractor.findByIdAndDelete(id);
        if (!tractor) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        // Cascade delete associated posts
        await Post.deleteMany({ tractor: id });

        res.status(204).send(); // No content, just success status
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete tractor' });
    }
};
