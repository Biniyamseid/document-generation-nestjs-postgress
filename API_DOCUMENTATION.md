# Document Management System API Documentation

## Overview

This is a comprehensive Document Management System built with NestJS, featuring user authentication, role-based authorization, and full CRUD operations for documents.

## Features

- **User Authentication**: JWT-based authentication with login/register
- **Role-Based Authorization**: Regular users and administrators
- **Document Management**: Full CRUD operations for documents
- **Data Validation**: Input validation and error handling
- **API Documentation**: Interactive Swagger documentation
- **Testing**: Unit tests with Jest
- **Database**: PostgreSQL with TypeORM

## Quick Start

### 1. Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Docker (optional, for database)

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd document-management-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d postgres

# Or use the helper script
./scripts/start-db.sh
```

#### Option B: Manual Setup

Create a PostgreSQL database named `document_management` and update your `.env` file.

### 4. Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Regular User" // Optional, defaults to "Regular User"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "Regular User"
  }
}
```

### Documents

All document endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

#### Create Document

```http
POST /documents
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "My Document",
  "content": "This is the content of my document..."
}
```

#### Get All Documents

```http
GET /documents
Authorization: Bearer <access_token>
```

**Note:** Regular users see only their own documents, while admins see all documents.

#### Get Specific Document

```http
GET /documents/:id
Authorization: Bearer <access_token>
```

#### Update Document

```http
PATCH /documents/:id
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Note:** Only the document owner or admin can update documents.

#### Delete Document

```http
DELETE /documents/:id
Authorization: Bearer <access_token>
```

**Note:** Only administrators can delete documents.

## User Roles

### Regular User

- Create documents
- View their own documents
- Edit their own documents
- Cannot delete documents
- Cannot view other users' documents

### Admin

- All regular user permissions
- View all documents
- Edit any document
- Delete any document

## Default Users

When you first run the application, you can create default users using the seeder or manually register:

### Admin User

- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin

### Regular User

- Email: `user@example.com`
- Password: `user123`
- Role: Regular User

## Error Handling

The API returns structured error responses:

```json
{
  "statusCode": 400,
  "timestamp": "2023-12-01T10:00:00.000Z",
  "path": "/documents",
  "message": "Title is required",
  "error": "Bad Request"
}
```

## Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `full_name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'Regular User', 'Admin')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Documents Table

- `id` (UUID, Primary Key)
- `title` (String, Max 255 chars)
- `content` (Text)
- `owner_id` (UUID, Foreign Key to Users)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Interactive Documentation

Once the application is running, you can access the interactive Swagger documentation at:
`http://localhost:3001/api`

This provides a user-friendly interface to test all API endpoints.

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours (configurable)
- Input validation prevents common attacks
- Role-based access control ensures proper authorization
- Database queries use parameterized statements (TypeORM)

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=document_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Application
PORT=3001
NODE_ENV=development
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Set `synchronize: false` in database configuration
4. Run database migrations manually
5. Use environment-specific database credentials
6. Enable HTTPS
7. Set up proper logging and monitoring

## Support

For questions or issues, please refer to the README.md file or contact the development team.
