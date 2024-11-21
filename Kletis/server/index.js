require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
//const path = require('path');

//Controllers
const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');
const tractorsController = require('./controllers/tractorsController');
const commentsController = require('./controllers/commentsController');
const path = require("node:path");

//Api Specs
const usersApiSpec = YAML.load(path.join(__dirname, './OpenAPI/usersOpenAPI.yml'))
const tractorsApiSpec = YAML.load(path.join(__dirname, './OpenAPI/tractorsOpenAPI.yml'))
const postsApiSpec = YAML.load(path.join(__dirname, './OpenAPI/postsOpenAPI.yml'))
const commentsApiSpec = YAML.load(path.join(__dirname, './OpenAPI/commentsOpenApi.yml'))
const mergedApi = YAML.load(path.join(__dirname, './OpenAPI/mergedOpenApi.yml'))

//Authorization
const auth = require('./services/auth');
const authorize = require('./services/authorize');
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

//Authorization routes
app.get('/login', usersController.loginUser)
app.get('/logout', usersController.logoutUser)
//Swagger

app.use('/api-docs/users', swaggerUI.serveFiles(usersApiSpec), swaggerUI.setup(usersApiSpec));
app.use('/api-docs/tractors', swaggerUI.serveFiles(tractorsApiSpec), swaggerUI.setup(tractorsApiSpec));
app.use('/api-docs/posts', swaggerUI.serveFiles(postsApiSpec), swaggerUI.setup(postsApiSpec));
app.use('/api-docs/comments', swaggerUI.serveFiles(commentsApiSpec), swaggerUI.setup(commentsApiSpec));
app.use('/api-docs/all', swaggerUI.serveFiles(mergedApi), swaggerUI.setup(mergedApi));

// Comment routes
app.get('/comments/', commentsController.getComments)
app.get('/post/:postID/comments/', commentsController.getCommentsByPost)
app.get('/comments/:id/', commentsController.getCommentById)
app.get('/user/:userId/comments/', commentsController.getCommentsByUser)
app.post('/comments/',  auth, authorize(['admin', 'dev', 'guest']),commentsController.createComment)
app.put('/comments/:id/',  auth, authorize(['admin', 'dev', 'guest']),commentsController.updateComment)
app.delete('/comments/:id/',  auth, authorize(['admin', 'dev', 'guest']),commentsController.deleteComment)

// Post routes
app.get('/posts/', postsController.getAllPosts);
app.get('/tractor/:tractorId/posts/', postsController.getPostsByTractor) // '/posts/tractor/:tractorId  -> /tractors/:tractorId/post THIS GOES TO TRACTOR ROUTE
app.get('/user/:userId/posts/', postsController.getPostsByUser)
app.get('/posts/:id/', postsController.getPostById);
app.post('/posts/', auth, authorize(['admin', 'mod', 'guest']), postsController.createPost);
app.put('/posts/:id/', auth, authorize(['admin', 'dev', 'guest']), postsController.updatePost);
app.delete('/posts/:id', auth, authorize(['admin', 'dev', 'guest']), postsController.deletePost);

// Tractor routes
app.get('/tractors/', tractorsController.getAllTractors);
app.get('/tractors/:id/', tractorsController.getTractorById);
app.post('/tractors/', auth, authorize(['admin', 'mod']), tractorsController.createTractor);
app.put('/tractors/:id/', auth, authorize(['admin', 'dev', 'guest']), tractorsController.updateTractor);
app.delete('/tractors/:id/', auth, authorize(['admin', 'dev', 'guest']), tractorsController.deleteTractor);


// User routes
app.get('/users/', usersController.getAllUsers);
app.get('/users/:id/', usersController.getUserById);
app.post('/users/', usersController.createUser);
app.put('/users/:id/', usersController.updateUser);
app.delete('/users/:id/', usersController.deleteUser);

console.log('JWT_SECRET:', process.env.JWT_SECRET);

/*
* tractors/{tId}/posts/{pid}/comments/{cid}  | TARKIM DONE

/*
* sujungti openapi specs
* praplesti openapi specs
* hierarchiniai linkai
* */
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});