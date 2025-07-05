#!/bin/bash

echo "Starting PostgreSQL database with Docker Compose..."
docker-compose up -d postgres

echo "Waiting for database to be ready..."
sleep 10

echo "Database is ready!"
echo "PostgreSQL is running on localhost:5432"
echo "Database: document_management"
echo "Username: postgres"
echo "Password: password"
echo ""
echo "To start the application:"
echo "npm run start:dev"
echo ""
echo "To stop the database:"
echo "docker-compose down" 