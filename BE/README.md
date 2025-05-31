# Blog Project Backend

A Node.js backend for a blog application with authentication and post management.

## Features

- User authentication (signup/login)
- JWT-based authentication
- Blog post CRUD operations
- Multiple image upload support
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd blog-project-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/blog_project
JWT_SECRET=your_jwt_secret_key_here
PORT=5001
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user

### Posts
- GET `/api/posts` - Get all posts for logged-in user
- POST `/api/posts` - Create a new post
- PUT `/api/posts/:id` - Update a post
- DELETE `/api/posts/:id` - Delete a post
- GET `/api/posts/:id` - Get a single post

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcrypt for password hashing 