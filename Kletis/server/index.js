require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//const usersController = require('./controllers/usersController');
//const postsController = require('./controllers/postsController');
//const tractorsController = require('./controllers/tractorsController');
//const commentsController = require('./controllers/commentsController');

//routes
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const tractorRoutes = require('./routes/tractorRoutes');

const dbURI = 'mongodb+srv://martonas:martonas@kletis.i1pta.mongodb.net/Kletis?retryWrites=true&w=majority&appName=Kletis'

mongoose.connect(dbURI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log('Error connecting to MongoDB:', error))

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routes
app.use('/posts', postRoutes);
app.use('/tractors', tractorRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})