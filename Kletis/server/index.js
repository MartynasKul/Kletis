require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
//const path = require('path');

const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');
const tractorsController = require('./controllers/tractorsController');
const commentsController = require('./controllers/commentsController');
const path = require("node:path");

const usersApiSpec = YAML.load(path.join(__dirname, './OpenAPI/usersOpenAPI.yml'))
const tractorsApiSpec = YAML.load(path.join(__dirname, './OpenAPI/tractorsOpenAPI.yml'))
const postsApiSpec = YAML.load(path.join(__dirname, './OpenAPI/postsOpenAPI.yml'))
const commentsApiSpec = YAML.load(path.join(__dirname, './OpenAPI/commentsOpenAPI.yml'))

//routes
//const postRoutes = require('./routes/postRoutes');
//const commentRoutes = require('./routes/commentRoutes');
//const userRoutes = require('./routes/userRoutes');
//const tractorRoutes = require('./routes/tractorRoutes');

const dbURI = 'mongodb+srv://martonas:martonas@kletis.i1pta.mongodb.net/Kletis?retryWrites=true&w=majority&appName=Kletis'

mongoose.connect(dbURI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Error connecting to MongoDB:', error))

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routes
//app.use('/posts', postRoutes);
//app.use('/tractors', tractorRoutes);
//app.use('/users', userRoutes);
//app.use('/comments', commentRoutes);


//Swagger

app.use('/api-docs/users', swaggerUI.serveFiles(usersApiSpec), swaggerUI.setup(usersApiSpec));
app.use('/api-docs/tractors', swaggerUI.serveFiles(tractorsApiSpec), swaggerUI.setup(tractorsApiSpec));
app.use('/api-docs/posts', swaggerUI.serveFiles(postsApiSpec), swaggerUI.setup(postsApiSpec));
app.use('/api-docs/comments', swaggerUI.serveFiles(commentsApiSpec), swaggerUI.setup(commentsApiSpec));

// Comment routes
app.get('/comments/', commentsController.getComments)
app.get('/post/:postID/comments/', commentsController.getCommentsByPost)
app.get('/comments/:id/', commentsController.getCommentById)
app.get('/user/:userId/comments/', commentsController.getCommentsByUser)
app.post('/comments/', commentsController.createComment)
app.put('/comments/:id/', commentsController.updateComment)
app.delete('/comments/:id/', commentsController.deleteComment)

// Post routes
app.get('/posts/', postsController.getAllPosts);
app.get('/tractor/:tractorId/posts/', postsController.getPostsByTractor) // '/posts/tractor/:tractorId  -> /tractors/:tractorId/post THIS GOES TO TRACTOR ROUTE
app.get('/posts/:id/', postsController.getPostById);
app.post('/posts/', postsController.createPost);
app.put('/posts/:id/', postsController.updatePost);
app.delete('/posts/:id', postsController.deletePost);

// Tractor routes
app.get('/tractors/', tractorsController.getAllTractors);
app.get('/tractors/:id/', tractorsController.getTractorById);
app.post('/tractors/', tractorsController.createTractor);
app.put('/tractors/:id/', tractorsController.updateTractor);
app.delete('/tractors/:id/', tractorsController.deleteTractor);


// User routes
app.get('/users/', usersController.getAllUsers);
app.get('/users/:id/', usersController.getUserById);
app.post('/users/', usersController.createUser);
app.put('/users/:id/', usersController.updateUser);
app.delete('/users/:id/', usersController.deleteUser);
/*
* tractors/{tId}/posts/{pid}/comments/{cid}  | TARKIM DONE
no 500 responses                             | fixed
422 when invalid fields                      | fixde
no html on error (bad json)                  | i think fixed
cascade delete                               | FIXED
soft delete, IsRemoved=true/false            | not needed
openapi spec                                 | done
* */

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})