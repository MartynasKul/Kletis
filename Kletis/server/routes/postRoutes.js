const express = require('express')
const router = express.Router()
const postController = require('../controllers/postsController')

// Define routes and map them to controller methods
router.get('/', postController.getAllPosts);
router.get('/:tractorId/tractor', postController.getPostsByTractor) // '/posts/tractor/:tractorId  -> /tractors/:tractorId/post THIS GOES TO TRACTOR ROUTE
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
