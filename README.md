# 📝 Keploy Todo API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

A robust RESTful API for managing todos with user authentication, built with Node.js, Express, and MongoDB. Features complete CRUD operations, JWT-based authentication, and comprehensive input validation.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 🔒 **Password Security** - bcrypt password hashing
- ✅ **Input Validation** - Comprehensive validation with Zod
- 📋 **Complete CRUD Operations** - Create, Read, Update, Delete todos
- 👤 **User Management** - User registration and login
- 🛡️ **Route Protection** - Protected routes with middleware
- 📊 **MongoDB Integration** - Robust database operations with Mongoose

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or cloud instance)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd keploy-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB connection**
   
   Update the MongoDB connection in `db.js`:
   ```javascript
   mongoose.connect("mongodb://localhost:27017/keploy-todo");
   ```

4. **Start the server**
   ```bash
   npm start
   # or
   node index.js
   ```

5. **Server will be running on** `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
All protected routes require a JWT token in the request headers:
```
token: your-jwt-token-here
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
Register a new user account.

**Endpoint:** `POST /signup`

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "mypassword123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "you are signed up successfully"
}
```

**Error Responses:**
```json
// 400 - Invalid Input
{
  "message": "invalid input",
  "error": { /* validation errors */ }
}

// 400 - User Already Exists
{
  "message": "User already exists"
}
```

---

### 2. User Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "message": "you are logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 404 - User Not Found
{
  "message": "User does not exist"
}

// 401 - Invalid Credentials
{
  "message": "invalid credentials"
}
```

---

## 📋 Todo Endpoints (Protected)

### 3. Create Todo
Create a new todo item.

**Endpoint:** `POST /todo`
**Authentication:** Required

**Headers:**
```
token: your-jwt-token-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation"
}
```

**Success Response (201):**
```json
{
  "message": "todo created"
}
```

**Error Response (400):**
```json
{
  "message": "Title is required"
}
```

---

### 4. Get All Todos
Retrieve all todos for the authenticated user.

**Endpoint:** `GET /todos`
**Authentication:** Required

**Headers:**
```
token: your-jwt-token-here
```

**Success Response (200):**
```json
[
  {
    "_id": "64f123456789abcdef123456",
    "title": "Complete project documentation",
    "done": false,
    "userId": "64f123456789abcdef654321",
    "__v": 0
  },
  {
    "_id": "64f123456789abcdef123457",
    "title": "Review code changes",
    "done": true,
    "userId": "64f123456789abcdef654321",
    "__v": 0
  }
]
```

---

### 5. Get Single Todo
Retrieve a specific todo by ID.

**Endpoint:** `GET /todo/:id`
**Authentication:** Required

**Headers:**
```
token: your-jwt-token-here
```

**Success Response (200):**
```json
{
  "_id": "64f123456789abcdef123456",
  "title": "Complete project documentation",
  "done": false,
  "userId": "64f123456789abcdef654321",
  "__v": 0
}
```

**Error Response (404):**
```json
{
  "message": "Todo not found"
}
```

---

### 6. Update Todo
Update an existing todo item.

**Endpoint:** `PUT /todo/:id`
**Authentication:** Required

**Headers:**
```
token: your-jwt-token-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated todo title",
  "done": true
}
```

**Success Response (200):**
```json
{
  "message": "todo updated successfully",
  "todo": {
    "_id": "64f123456789abcdef123456",
    "title": "Updated todo title",
    "done": true,
    "userId": "64f123456789abcdef654321",
    "__v": 0
  }
}
```

**Error Response (404):**
```json
{
  "message": "Todo not found"
}
```

---

### 7. Delete Todo
Delete a specific todo item.

**Endpoint:** `DELETE /todo/:id`
**Authentication:** Required

**Headers:**
```
token: your-jwt-token-here
```

**Success Response (200):**
```json
{
  "message": "todo deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Todo not found"
}
```

---

## 🗄️ Database Schema

### User Model (`users` collection)
```javascript
{
  username: String (unique, email format),
  password: String (hashed with bcrypt),
  name: String
}
```

### Todo Model (`todo-collection` collection)
```javascript
{
  title: String,
  done: Boolean,
  userId: ObjectId (references User)
}
```

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Zod** | Input validation |

## 🔧 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password123","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"password123"}'
```

**Create a todo:**
```bash
curl -X POST http://localhost:3000/todo \
  -H "Content-Type: application/json" \
  -H "token: YOUR_JWT_TOKEN" \
  -d '{"title":"My first todo"}'
```

**Get all todos:**
```bash
curl -X GET http://localhost:3000/todos \
  -H "token: YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the endpoints into Postman
2. Set up environment variables for the base URL and token
3. Test each endpoint following the documentation above

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **Input Validation**: All inputs are validated using Zod schemas
- **Route Protection**: Sensitive routes are protected with authentication middleware
- **User Isolation**: Users can only access their own todos

## 📝 Input Validation Rules

| Field | Rules |
|-------|--------|
| **Username** | Must be a valid email, minimum 3 characters |
| **Password** | Minimum 6 characters |
| **Name** | Required, minimum 1 character |
| **Todo Title** | Required, cannot be empty |

## 🚦 HTTP Status Codes

| Code | Description |
|------|-------------|
| **200** | Success |
| **201** | Created |
| **400** | Bad Request (validation error) |
| **401** | Unauthorized (invalid token) |
| **404** | Not Found |
| **500** | Internal Server Error |

## 🔄 Error Handling

The API implements comprehensive error handling:
- **Validation Errors**: Clear messages for invalid input
- **Authentication Errors**: Proper status codes for auth failures
- **Database Errors**: Graceful handling of database issues
- **Not Found Errors**: Appropriate responses for missing resources

## 🌟 Improvements for Production

- [ ] Use environment variables for JWT secret and database URL
- [ ] Implement rate limiting
- [ ] Add API versioning
- [ ] Implement logging middleware
- [ ] Add unit and integration tests
- [ ] Set up CORS properly
- [ ] Add API documentation with Swagger
- [ ] Implement refresh tokens
- [ ] Add password strength requirements
- [ ] Set up monitoring and health checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue in the repository.

---

**Made with ❤️ for the Keploy community** 