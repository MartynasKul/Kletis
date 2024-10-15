require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');
const tractorsController = require('./controllers/tractorsController');
const commentsController = require('./controllers/commentsController');

mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Error connecting to MongoDB:', error))

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// User routes
app.get('/users', usersController.getAllUsers)
app.get('/users/:id', usersController.getUserById)
app.post('/users', usersController.createUser)
app.put('/users/:id', usersController.updateUser)
app.delete('/users/:id', usersController.deleteUser)

// Tractor routes

// Post routes

// Comment routes
app.get('/comments', commentsController.getAllComments)
app.get('/tractors/comments/:gameId', commentsController.getCommentsByGame)
app.get('/comments/:id', commentsController.getCommentById)
app.post('/comments', commentsController.createComment)
app.put('/comments/:id', commentsController.updateComment)
app.delete('/comments/:id', commentsController.deleteComment)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})