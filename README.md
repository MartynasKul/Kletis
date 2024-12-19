# Klėtis
# Klėtis Forum

## Overview

**Klėtis** is a RESTful API built with **Node.js** and **Express** that enables users to manage tractors, categories, posts, and comments. This API supports user roles (admin, moderator, and guest) for managing forum content while ensuring proper data relationships and integrity.

## Features

- **User Management**:
  - Create, read, update, and delete users.
  - User roles: `admin`, `mod`, `guest`.
- **Tractor Management**:
  - Manage tractor categories.
  - Link posts to specific tractor categories.
- **Post Management**:
  - Create posts with titles, content, and vote counts (upvotes and downvotes).
  - Pre-save hooks for timestamps and cascading deletion of comments when a post is deleted.
- **Comment Management**:
  - Add, update, and delete comments linked to posts.
- **Voting System**:
  - Upvote and downvote functionality for posts.
- **Query Expansion**:
  - Include related fields (e.g., posts under a specific tractor category).

## Prerequisites

- **Node.js**: v14 or above
- **MongoDB**: A MongoDB database (local or cloud, e.g., MongoDB Atlas)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MartynasKul/Kletis.git
cd Kletis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file and add the following variables:

```
MONGODB_URI=<your-mongodb-connection-string>
PORT=3000
```

### 4. Run the Program

```bash
npm run dev
```



Saityno taikomųjų programų projektavimas

Ž. Ūkio forumas Klėtis

Iš esmės reddit klonas

hierarchija: traktorius -> postas -> komentarai

Forume turi galėti dėti postus po pasirinkta tema, postus komentuoti. komentarai/postai gali būti redaguojami ir trinami autorių arba adminų(maybe).
iš esmės reddit klonas todėl postai iš visų temų bus matomi pagrindiniam ekrane

DB lentelės:
user
tractor
post
comment

User roles:
svečias
administratorius 
moderatorius

frontend: vue.js su typescript
backend: node.js/express




## Routing Table

### Atuh Routes
| Method | Route               | Controller Function    | Description                         |
|--------|---------------------|------------------------|-------------------------------------|
| POST   | /login              | loginUser              | Login user                          |
| POST   | /register           | registerUser           | Register user                       |

### Posts Routes
| Method | Route               | Controller Function    | Description                         |
|--------|---------------------|------------------------|-------------------------------------|
| GET    | /posts              | getAllPosts            | Fetch all posts                     |
| GET    | /posts/:id          | getPostById            | Fetch a specific post by ID         |
| POST   | /posts              | createPost             | Create a new post                   |
| PUT    | /posts/:id          | updatePost             | Update a specific post by ID        |
| DELETE | /posts/:id          | deletePost             | Delete a specific post by ID        |

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
| GET    | /post/:postID/comments        | getCommentsByPost        | Fetch all comments for a specific post  |
| GET    | /user/:userID/comments        | getCommentsByUser        | Fetch all comments by a specific user   |
| GET    | /comments/:id                  | getCommentById           | Fetch a specific comment by ID          |
| POST   | /comments                     | createComment            | Create a new comment                    |
| PUT    | /comments/:id                  | updateComment            | Update a specific comment by ID         |
| DELETE | /comments/:id                  | deleteComment            | Delete a specific comment by ID         |
