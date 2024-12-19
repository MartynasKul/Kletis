require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const multer = require('multer');
// const storage = multer.memoryStorage(); 



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

const allowedOrigins = [
    'https://kletis-gaiq0ljt8-martynas-projects-4e90f798.vercel.app/',
    'https://kletis.vercel.app/',
    'http://kletis.vercel.app/',
    'https://kletis-gaiq0ljt8-martynas-projects-4e90f798.vercel.app/',
    'http://localhost:5173', // Add local frontend during dev
    'http://localhost:3000', // For Postman
    'https://kletisforum.onrender.com',
    'http://kletisforum.onrender.com'

];



mongoose.connect(process.env.MONGODB_URI , {})
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Error connecting to MongoDB:', error))

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  app.options('*', cors()); // Handle preflight requests
  


// app.use(cors({
//     origin: allowedOrigins,
//     credentials: true, 
// }));

// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({extended:true}))

// app.get('/test-auth', auth, (req, res) => {
//     res.json({ user: req.user });
//   });

//Authorization routes
app.post('/login', usersController.loginUser)
// app.get('/logout', usersController.logoutUser)
app.post('/register', usersController.registerUser);
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
app.get('/users/', auth, authorize(['admin', 'dev', 'guest']), usersController.getAllUsers);
app.get('/users/:id/', auth, authorize(['admin', 'dev', 'guest']),usersController.getUserById);
app.post('/users/', auth, authorize(['admin', 'dev', 'guest']), usersController.createUser);
app.put('/users/:id/', auth, authorize(['admin', 'dev', 'guest']), usersController.updateUser);
app.delete('/users/:id/', auth, authorize(['admin', 'dev', 'guest']), usersController.deleteUser);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
  // Example error-handling middleware with CORS headers
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).set('Access-Control-Allow-Origin', req.headers.origin).send('Something broke!');
 });
