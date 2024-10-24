//const { rawListeners} = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
const Tractor = require('../models/Tractor')

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
    //try {
    //    const { title, description } = req.body;
//
    //    // Assuming req.user._id holds the ID of the logged-in user (tractor creator)
    //    const created_by = req.user._id;
//
    //    const newTractor = new Tractor({
    //        title,
    //        description,
    //        created_by,
    //    });
//
    //    await newTractor.save();
    //    res.status(201).json(newTractor); // Send back the created tractor
    //} catch (error) {
    //    console.error(error);
    //    res.status(500).json({ error: 'Failed to create tractor' });
    //}
    //try {
    //    const { title, description, created_by } = req.body; // Now expecting created_by from the request body
//
    //    if (!created_by) {
    //        return res.status(400).json({ error: 'User ID (created_by) is required' });
    //    }
//
    //    const newTractor = new Tractor({
    //        title,
    //        description,
    //        created_by,
    //    });
//
    //    await newTractor.save();
    //    res.status(201).json(newTractor); // Send back the created tractor
    //} catch (error) {
    //    console.error(error);
    //    res.status(500).json({ error: 'Failed to create tractor' });
    //}
    try {
        const { name, description, created_by } = req.body;

        let tractor = Tractor.find(name)
        if(tractor){
            return res.status(403).json({error: 'Tractor category with this name exists'})       }
        // Check if the 'created_by' field is present and valid
        if (!created_by) {
            return res.status(422).json({ error: 'User ID (created_by) is required' });
        }

        const user = await User.findById(created_by); // Validate if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Proceed to create the tractor if everything is valid
        const newTractor = new Tractor({
            name,
            description,
            created_by,
        });

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

        // Find and delete the tractor by ID
        const tractor = await Tractor.findByIdAndDelete(id);
        if (!tractor) {
            return res.status(404).json({ error: 'Tractor not found' });
        }

        // Optional: You can cascade delete associated posts or comments here if needed
        await Post.deleteMany({ tractor: id }); // Delete all posts associated with this tractor

        res.status(204).send(); // No content, just success status
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete tractor' });
    }
}
