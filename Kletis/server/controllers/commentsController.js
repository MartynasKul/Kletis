const Comment = require('../models/Comment')
const User = require('../models/User')
const Post = require('../models/Post')
const postController = require('../controllers/postsController')

// Get all comments for specific post
exports.getCommentsByPost = async (req, res) => {
    try {
        const { expand } = req.query;
        if(!mongoose.Types.ObjectId.isValid(req.params.postID)){
            return res.status(404).send({ error: 'Post not found' });
        }
        let commentsQuery = Comment.find({ post: req.params.postID });
        if (expand && expand.includes('post')) {
            commentsQuery = commentsQuery.populate('post');
        }
        if (expand && expand.includes('author')) {
            commentsQuery = commentsQuery.populate('author');
        }
        const comments = await commentsQuery;
        res.json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// GET all comments
exports.getComments = async (req, res) => {
    try{
        const {expand} = req.query
        let commentsQuery = Comment.find()
        if(expand && expand.includes('post')){
            commentsQuery = commentsQuery.populate('post')
        }
        if(expand && expand.includes('author')){
            commentsQuery = commentsQuery.populate('author')
        }
        const comments = await commentsQuery
        res.json(comments)
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Server error'})
    }
}

//GET a comment by id
exports.getCommentById = async (req, res) => {
    try{
        const {expand} = req.query
        let commentsQuerry = Comment.findById(req.params.id)

        if(expand && expand.includes('post')){
            commentsQuerry = commentsQuerry.populate('post')
        }
        if(expand && expand.includes('author')){
            commentsQuerry = commentsQuerry.populate('author')
        }

        const comment = await commentsQuerry
        if(comment){
            res.json(comment)
        }
        else{
            res.status(404).json({error: 'Comment not found'})
        }
    }
    catch(error){
        res.status(500).json({error: 'Server error'})
    }
}

// GET all comments by a specific user
exports.getCommentsByUser = async (req, res) => {
    try {
        const { expand } = req.query;
        const userId = req.params.userId;

        if(userId.length !== 24){
            return res.status(400).json({error: 'Bad or non-existent user id'})
        }
        const userquery = User.findById(userId)

        if(!userquery){
            return res.status(404).json({error: 'User ID does not exist'})
        }

        let commentsQuery = Comment.find({ author: userId });


        if (expand && expand.includes('post')) {
            commentsQuery = commentsQuery.populate('post');
        }
        if (expand && expand.includes('author')) {
            commentsQuery = commentsQuery.populate('author');
        }

        const comments = await commentsQuery;


        if (comments.length === 0) {
            return res.status(404).json({ error: 'No comments found for this user' });
        }

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// POST a new comment

exports.createComment = async (req, res) => {
    try {
        const { content, post, author } = req.body;

        // Validate required fields
        if (!content) {
            return res.status(422).json({ error: 'Comment content cannot be empty' });
        }
        if (!mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }
        if (!mongoose.Types.ObjectId.isValid(post)) {
            return res.status(400).json({ error: 'Invalid Post ID' });
        }

        // Check if the user exists
        const user = await User.findById(author);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the post exists
        const postObj = await Post.findById(post);
        if (!postObj) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create the comment
        const newComment = new Comment({
            content,
            post,
            author,
            created_at: new Date(),
        });

        await newComment.save();
        res.status(201).json(newComment); // Send back the created comment
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ error: 'Failed to create comment' });
    }
}

// PUT (update) an existing comment

exports.updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { id } = req.params;

        // Validate required fields
        if (!content) {
            return res.status(422).json({ error: 'Comment content is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid Comment ID' });
        }

        // Fetch the comment
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check permissions
        if (comment.author.toString() !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to update this comment' });
        }

        // Update the comment
        comment.content = content;
        comment.updated_at = new Date();

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(500).json({ error: 'Failed to update comment' });
    }
}

// DELETE a comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate Comment ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid Comment ID' });
        }

        // Fetch the comment
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check permissions
        if (comment.author.toString() !== req.user.id && req.user.type !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this comment' });
        }

        // Delete the comment
        await comment.deleteOne();
        res.status(204).send(); // No content, just success status
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}