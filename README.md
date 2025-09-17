# FullStack Intern Challenge – Store Rating Platform

A full-stack web application where users can rate stores (1–5), leave comments, and manage stores with role-based access (System Admin, Store Owner, Normal User).

This project is built with:
Backend: Node.js, Express.js, Sequelize ORM, MySQL
Frontend: React.js (create-react-app)
Database: MySQL

# Features

   User Authentication (JWT-based)
   Roles: SYSTEM_ADMIN, STORE_OWNER, NORMAL_USER
   Store management (Admin/Owner)
   Ratings & Comments (Users)
   View average store ratings


# Project Structure
fullstack_intern_project/
 ├── backend/       # Node.js + Express + Sequelize
 ├── frontend/      # React.js (UI)
 ├── README.md      # This file

# Prerequisites

Ensure you have installed:
Node.js
 (v16+ recommended)
npm
 (comes with Node.js)
MySQL
 (v8 recommended)
VS Code (or any code editor)

# Setup Instructions
1. Clone or Extract Project
# Extract the provided zip OR clone repo
   cd fullstack_intern_project

2. Setup Database (MySQL)

   Login to MySQL and run:

   -- Drop old database if exists
   DROP DATABASE IF EXISTS fsic_db;

   -- Create new database
   CREATE DATABASE fsic_db;

   -- Create user (if not exists)
   CREATE USER IF NOT EXISTS 'fsic_user'@'localhost' IDENTIFIED BY 'fsic_pass';

   -- Grant privileges
   GRANT ALL PRIVILEGES ON fsic_db.* TO 'fsic_user'@'localhost';

-- Apply changes
   FLUSH PRIVILEGES;

3. Backend Setup
cd backend
npm install


Create a .env file inside backend/:

DB_NAME=fsic_db
DB_USER=fsic_user
DB_PASS=fsic_pass
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=your_jwt_secret_here
PORT=5000


Seed initial data (admin + sample store + owner):

node seeders/seed.js


Start backend server:

npm start


Backend runs at:  http://localhost:5000

4. Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at:  http://localhost:3000

# Default Login Credentials

Admin

Email: admin@fsic.test
Password: Admin@1234


Store Owner

Email: owner@fsic.test
Password: Owner@1234

# Usage Flow

Login as Admin → Manage stores, assign owners.

Login as Store Owner → View/manage own store.

Login as Normal User → Browse stores and give ratings/comments.

# Troubleshooting

 - Access denied for user 'fsic_user'@'localhost'
   → Check MySQL user/password in .env matches database.

 - Unknown column 'createdAt'
   → Drop old database and recreate fresh using commands above.

 - Could not find index.html in frontend
   → Ensure frontend/public/index.html exists.

 # License

For educational use only (FullStack Intern Challenge).
# Developed By: Nikhil Kumar Singh
# Roll No. : MCA2403082