const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentsController');


// Comment routes
router.get('/', commentController.getComments);
router.get('/:postID/post/', commentController.getCommentsByPost); //
router.get('/:id', commentController.getCommentById);
router.get('/:userId/user', commentController.getCommentsByUser);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;