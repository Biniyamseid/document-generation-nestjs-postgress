# Document Management System

A simplified document management system built with NestJS, TypeORM, and PostgreSQL.

## Features

- User Management: Regular users and admins with role-based access
- Document CRUD: Create, read, update, and delete documents
- Authentication: JWT-based authentication system
- Authorization: Role-based access control
- Validation: Input validation and error handling
- API Documentation: Swagger/OpenAPI documentation

## Tech Stack

- Framework: NestJS
- Database: PostgreSQL
- ORM: TypeORM
- Authentication: JWT + Passport
- Validation: class-validator
- Documentation: Swagger

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your database and environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run the application:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Documents
- `POST /documents` - Create a document
- `GET /documents` - List documents
- `GET /documents/:id` - Get a specific document
- `PUT /documents/:id` - Update a document
- `DELETE /documents/:id` - Delete a document (admin only)

## User Roles

- Regular User: Can create, edit, view, and list their own documents
- Admin: Can access all documents and delete any document

## Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:3001/api` 