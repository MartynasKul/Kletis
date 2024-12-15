const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// Helper function to apply expansion
function applyExpand(query, expand, fields) {
    if (expand) {
        fields.forEach((field) => {
            if (expand.includes(field)) {
                query.populate(field);
            }
        });
    }
    return query;
}

// Helper function for error handling
function handleError(res, status, message) {
    res.status(status).json({ error: message });
}

// Get all comments for a specific post
exports.getCommentsByPost = async (req, res) => {
    try {
        const { expand } = req.query;
        const postId = req.params.postID;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return handleError(res, 404, 'Post not found');
        }

        let commentsQuery = Comment.find({ post: postId });
        commentsQuery = applyExpand(commentsQuery, expand, ['post', 'author']);

        const comments = await commentsQuery;
        res.json(comments);
    } catch (error) {
        console.error(error);
        handleError(res, 500, 'Server error');
    }
};

// Get all comments
exports.getComments = async (req, res) => {
    try {
        const { expand } = req.query;

        let commentsQuery = Comment.find();
        commentsQuery = applyExpand(commentsQuery, expand, ['post', 'author']);

        const comments = await commentsQuery;

        console.error('Expand:', expand);
        console.error('Query:', commentsQuery.getQuery());

        res.json(comments);
    } catch (error) {
        console.error(error);
        handleError(res, 500, 'Server error');
    }
};

// Get a comment by ID
exports.getCommentById = async (req, res) => {
    try {
        const { expand } = req.query;
        const commentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return handleError(res, 404, 'Invalid Comment ID');
        }

        let commentQuery = Comment.findById(commentId);
        commentQuery = applyExpand(commentQuery, expand, ['post', 'author']);

        const comment = await commentQuery;

        if (comment) {
            res.json(comment);
        } else {
            handleError(res, 404, 'Comment not found');
        }
    } catch (error) {
        console.error(error);
        handleError(res, 500, 'Server error');
    }
};

// Get all comments by a specific user
exports.getCommentsByUser = async (req, res) => {
    try {
        const { expand } = req.query;
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        let commentsQuery = Comment.find({ author: userId });
        commentsQuery = applyExpand(commentsQuery, expand, ['post', 'author']);

        const comments = await commentsQuery;

        if (comments.length === 0) {
            return res.status(404).json({ error: 'No comments found for this user' });
        }

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const { content, post, author } = req.body;

        if (!content || !mongoose.Types.ObjectId.isValid(post) || !mongoose.Types.ObjectId.isValid(author)) {
            return handleError(res, 422, 'Invalid input data');
        }

        const postExists = await Post.exists({ _id: post });
        const userExists = await User.exists({ _id: author });

        if (!postExists || !userExists) {
            return handleError(res, 404, 'Post or user not found');
        }

        const newComment = await Comment.create({
            content,
            post,
            author,
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error.message);
        handleError(res, 500, 'Failed to create comment');
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || !mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, 422, 'Invalid input data');
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return handleError(res, 404, 'Comment not found');
        }

        if (comment.author.toString() !== req.user.id && req.user.type !== 'admin') {
            return handleError(res, 403, 'Unauthorized');
        }

        comment.content = content;
        comment.updated_at = new Date();

        await comment.save();
        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error.message);
        handleError(res, 500, 'Failed to update comment');
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return handleError(res, 404, 'Invalid Comment ID');
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return handleError(res, 404, 'Comment not found');
        }

        if (comment.author.toString() !== req.user.id && req.user.type !== 'admin') {
            return handleError(res, 403, 'Unauthorized');
        }

        await comment.deleteOne();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        handleError(res, 500, 'Failed to delete comment');
    }
};
