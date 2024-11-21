const Post = require("../models/Post");
const Tractor = require("../models/Tractor");
const User = require("../models/User");

// GET posts for tractor
exports.getPostsByTractor = async (req, res) => {
    try {
        const { expand } = req.query;

        const tractorId = req.params.tractorId;

        const tractorCheck = await Tractor.findById(tractorId); // Await the query

        if (!tractorCheck) {
            return res.status(404).send({ error: 'Tractor Not Found' });
        }

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

// GET posts for tractor
exports.getPostsByUser = async (req, res) => {
    try {
        const { expand } = req.query;


        //console.log('Request parameters:', req.params);


        const userId = req.params.userId;
        //console.log('Tractor ID:', tractorId);


        const userCheck = await User.findById(userId); // Await the query
        //console.log('Tractor Check:', tractorCheck);

        if (!userCheck) {
            return res.status(404).send({ error: 'User Not Found' });
        }

        // Query posts using the tractorId
        let postQuery = Post.find({ author: userId });

        if (expand && expand.includes('tractor')) {
            postQuery = postQuery.populate('tractor');
        }
        if (expand && expand.includes('author')) {
            postQuery = postQuery.populate('author');
        }

        const posts = await postQuery; // Await the result of the query
        res.json(posts); // Send back the posts
    } catch (error) {
        console.error('Error fetching posts by user:', error);
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
        res.status(400).json({error: 'Bad Request'})
    }
}

// PUT (Update) an existing Post
exports.updatePost = async (req, res) => {
    try {
        const { title, content, author, tractor } = req.body;
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid Post ID' });
        }

        // Fetch the post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check permissions
        if (req.user.id !== post.author.toString() && req.user.type !== 'admin' && req.user.type !== 'mod') {
            return res.status(403).json({ error: 'You do not have permission to update this post' });
        }

        // Validate required fields
        if (!title || !content || !author || !tractor) {
            return res.status(422).json({ error: 'Title, content, author, and tractor are required for a full update' });
        }

        // Validate tractor existence
        if (tractor) {
            const trac = await Tractor.findById(tractor);
            if (!trac) {
                return res.status(404).json({ error: 'Tractor not found' });
            }
        }

        // Update the post
        post.title = title;
        post.content = content;
        post.author = author;
        post.tractor = tractor;
        post.updated_at = new Date();

        await post.save();

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update post' });
    }
}

// DELETE a post

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid Post ID' });
        }

        // Fetch the post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check permissions
        if (req.user.id !== post.author.toString() && req.user.type !== 'admin' && req.user.type !== 'mod') {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }

        // Delete the post
        const deletedPost = await Post.findByIdAndDelete(id);

        res.status(200).json(deletedPost); // Return deleted post info
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}