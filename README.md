# Klėtis
Saityno taikomųjų programų projektavimas

Ž. Ūkio forumas Klėtis

Iš esmės reddit klonas

hierarchija: Kategorija -> postas -> komentarai

Forume turi galėti dėti postus po pasirinkta tema, postus komentuoti. komentarai/postai gali būti redaguojami ir trinami autorių arba adminų(maybe).
iš esmės reddit klonas todėl postai iš visų temų bus matomi pagrindiniam ekrane

DB lentelės:
user
post/comment
topic

User roles:
svečias
administratorius 
moderatorius

frontend: react/vue.js/Blazor
backend: node.js/express


## Routing Table

### Posts Routes
| Method | Route               | Controller Function    | Description                         |
|--------|---------------------|------------------------|-------------------------------------|
| GET    | /posts               | getAllPosts            | Fetch all posts                     |
| GET    | /posts/:id           | getPostById            | Fetch a specific post by ID         |
| POST   | /posts               | createPost             | Create a new post                   |
| PUT    | /posts/:id           | updatePost             | Update a specific post by ID        |
| DELETE | /posts/:id           | deletePost             | Delete a specific post by ID        |

### Tractors (Subreddit equivalent) Routes
| Method | Route                  | Controller Function    | Description                         |
|--------|------------------------|------------------------|-------------------------------------|
| GET    | /tractors              | getAllTractors         | Fetch all tractor categories        |
| GET    | /tractors/:id          | getTractorById         | Fetch a specific tractor by ID      |
| POST   | /tractors              | createTractor          | Create a new tractor category       |
| PUT    | /tractors/:id          | updateTractor          | Update a specific tractor by ID     |
| DELETE | /tractors/:id          | deleteTractor          | Delete a specific tractor by ID     |

### Users Routes
| Method | Route               | Controller Function    | Description                         |
|--------|---------------------|------------------------|-------------------------------------|
| GET    | /users               | getAllUsers            | Fetch all users                     |
| GET    | /users/:id           | getUserById            | Fetch a specific user by ID         |
| POST   | /users               | createUser             | Create a new user                   |
| PUT    | /users/:id           | updateUser             | Update a specific user by ID        |
| DELETE | /users/:id           | deleteUser             | Delete a specific user by ID        |

### Comments Routes
| Method | Route                         | Controller Function      | Description                             |
|--------|-------------------------------|--------------------------|-----------------------------------------|
| GET    | /comments                     | getComments              | Fetch all comments                      |
| GET    | /comments/post/:postId         | getCommentsByPost        | Fetch all comments for a specific post  |
| GET    | /comments/user/:userId         | getCommentsByUser        | Fetch all comments by a specific user   |
| GET    | /comments/:id                  | getCommentById           | Fetch a specific comment by ID          |
| POST   | /comments                     | createComment            | Create a new comment                    |
| PUT    | /comments/:id                  | updateComment            | Update a specific comment by ID         |
| DELETE | /comments/:id                  | deleteComment            | Delete a specific comment by ID         |

