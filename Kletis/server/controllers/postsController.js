const Post = require("../models/Post");
const Tractor = require("../models/Tractor");
const User = require("../models/User");

// GET posts for tractor
exports.getPostsByTractor = async (req, res) => {
    try {
        const { expand } = req.query;


        //console.log('Request parameters:', req.params);


        const tractorId = req.params.tractorId;
        //console.log('Tractor ID:', tractorId);


        const tractorCheck = await Tractor.findById(tractorId); // Await the query
        //console.log('Tractor Check:', tractorCheck);

        if (!tractorCheck) {
            return res.status(404).send({ error: 'Tractor Not Found' });
        }

        // Query posts using the tractorId
        let postQuery = Post.find({ tractor: tractorId });

        if (expand && expand.includes('tractor')) {
            postQuery = postQuery.populate('tractor');
        }
        if (expand && expand.includes('author')) {
            postQuery = postQuery.populate('author');
        }

        const posts = await postQuery; // Await the result of the query
        res.json(posts); // Send back the posts
    } catch (error) {
        console.error('Error fetching posts by tractor:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// GET all posts with tractor info
exports.getAllPosts = async (req, res) => {
    try {
        const { expand } = req.query;
        let postsQuery = Post.find();

        if (expand && expand.includes('tractor')) {
            postsQuery = postsQuery.populate('tractor');
        }
        if (expand && expand.includes('author')) {
            postsQuery = postsQuery.populate('author');
        }

        const posts = await postsQuery; // Await the result
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// GET a single post by ID with tractor info

exports.getPostById = async (req, res) => {
    try{
        const {expand} = req.query
        let postQuery = Post.findById(req.params.id)

        if (expand && expand.includes('tractor')) {
            postQuery = postQuery.populate('tractor')
        }
        if(expand && expand.includes('author')){
            postQuery = postQuery.populate('author')
        }

        const posT = await postQuery
        if(posT){
            res.json(posT)
        } else{
            res.status(404).json({error: 'Post not found'})
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'})
    }
}

// PUT a new post
exports.createPost = async (req, res) => {
    try{
        const {
            title, content, author, tractor
        } = req.body


        if (!title || !content || !author || !tractor) {
            return res.status(422).json({ error: 'Title, content, author, and tractor are required' });
        }

        const auThor = await User.findById(author)
        const trac = await Tractor.findById(tractor)
        if(!auThor){
            return res.status(404).json({error: 'User not found'})
        }
        if(!trac){
            return res.status(404).json({error: 'Tractor not found'})
        }

        const newPost = new Post({
            title,
            content,
            created_at: new Date(),
            author: auThor._id , // Use the user ID
            tractor: trac._id
        })
        await newPost.save()
        res.status(201).json(newPost)
    }
    catch(error){
        console.error('Error creating post:', error.message); // Log the specific error message
        res.status(400).json({error: 'Bad Request Unga'})
    }
}

// PUT (Update) an existing Post
exports.updatePost = async (req, res) => {
    try{
        const {
            title, content, author, tractor
        } = req.body


        if (!title || !content || !author || !tractor) {
            return res.status(422).json({ error: 'Title, content, author, and tractor are required for a full update' });
        }

        if(tractor){
            const trac = await Tractor.findById(tractor)
            if(!trac){
                return res.status(404).json({error: 'Tractor not found'})
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {title, content, author, tractor, updated_at: new Date(),},
            {new: true, runValidators: true}
        )

        if(updatedPost){
            res.json(updatedPost)
        }
        else{
            res.status(404).json({error: 'Post not found'})
        }
    }
    catch(error){
        res.status(400).json({error: 'Bad Request'})
    }
}

// DELETE a post

exports.deletePost = async (req, res) => {
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        if(deletedPost){
            res.json(deletedPost)
        }
        else{
            res.status(404).json({error: 'Post not found'})
        }
    }
    catch(error){
        res.status(500).json({error: 'Server error'})
    }
}