const Comment = require('../models/Comment')
const User = require('../models/User')
const Post = require('../models/Post')
const postController = require('../controllers/postsController')

// Get all comments for specific post
exports.getCommentsByPost = async (req, res) => {
    try {

        //console.log('Request params:', req.params);

        const { expand } = req.query;
        const postId = req.params.postID;


        //console.log('Querying comments for post ID:', postId);

        let commentsQuery = Comment.find({ post: postId });
        if (expand && expand.includes('post')) {
            commentsQuery = commentsQuery.populate('post');
        }

        if (expand && expand.includes('author')) {
            commentsQuery = commentsQuery.populate('author');
        }

        const comments = await commentsQuery;


        //console.log('Comments found:', comments);

        res.json(comments);
    } catch (error) {
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
    try{
        const { content, post, author } = req.body
        const user = await User.findById(author)

        if(!content){
            return res.status(422).json({error: 'Comment field cannot be empty'})
        }
        if(!user){
            return res.status(404).json({error: 'User not found'})
        }
        if(!post){
            return res.status(404).json({error: 'Post not found'})
        }
        const newComment = new Comment({
            content,
            post,
            author,
            created_at: new Date(),
        })

        await newComment.save()
        res.status(201).json(newComment)
    }
    catch(error){
        res.status(400).json({error: 'Bad Request'})
    }
}

// PUT (update) an existing comment

exports.updateComment = async (req, res) => {
    try{
        const {content, post, author} = req.body


        if (!content || !post || !author) {
            return res.status(422).json({ error: 'Content, post, and author are required for a full update' });
        }

        if(author){
            const user = await User.findById(author)
            if(!user){
                return res.status(404).json({error: 'User not found'})
            }
        }
        if(post){
            const posT = await Post.findById(post)
            if(!posT){
                return res.status(404).json({error: 'Post not found'})
            }
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {content},
            {new: true}
        )
        if(updatedComment){
            res.json(updatedComment)
        }
        else{
            res.status(404).json({error: 'Comment not found'})
        }

    }
    catch (error){
        res.status(400).json({error: 'Bad Request'})
    }
}

// DELETE a comment
exports.deleteComment = async (req, res) => {
    try{
        const deletedComment = await Comment.findByIdAndDelete(req.params.id)
        if(deletedComment){
            res.json(deletedComment)
        }
        else{
            res.status(404).json({error: 'Comment not found'})
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({error: 'Server error'})
    }
}