Workflow – A Lightweight Jira Clone (Rails API + React)

Workflow is a multi-tenant project management application inspired by Jira and Linear.
It provides companies, users, workflows (boards), and tasks with status movement across columns.
The project is built as a full-stack application with a Rails API backend and a React (Vite + TypeScript) frontend.

Features
Multi-Tenant Architecture

Companies are created during sign-up (admin user creates company).

Each company has its own users, workflows, and tasks.

All data is isolated per company.

Authentication

JWT-based authentication.

Sign Up creates a company and an admin user.

Sign In returns a token.

/me endpoint restores session on page refresh.

Workflows and Tasks

Create workflows from the UI.

Each workflow contains tasks in four predefined statuses:

initial

planning

review

closed

Create and edit tasks.

Change status (drag-and-drop support can be added).

Frontend Styling

React application styled with Material UI.

Custom pastel theme.

Responsive layout with a board-style interface.

Technology Stack
Backend

Ruby on Rails 7 (API mode)

PostgreSQL

JWT Authentication

Frontend

React 18 (Vite)

TypeScript

Material UI

Axios

Setup Instructions

This section explains how to set up both the Rails API and the React frontend.

1. Backend (Rails API)
Prerequisites

Ruby 2.7+

Rails 7+

PostgreSQL

Bundler

Step 1: Install dependencies

Navigate to the backend folder:

cd workflow_api
bundle install

Step 2: Configure database

Edit config/database.yml:

default: &default
  adapter: postgresql
  encoding: unicode
  pool: 5
  username: your_db_username
  password: your_db_password
  host: localhost

development:
  <<: *default
  database: workflow_development

test:
  <<: *default
  database: workflow_test

production:
  <<: *default
  database: workflow_production


Create and migrate the database:

rails db:create
rails db:migrate

Step 3: Environment variables

Create a file:

workflow_api/.env


Add values:

SECRET_KEY_BASE=your_rails_secret_key


Ensure Rails loads .env (via dotenv-rails if installed).

Step 4: Run the Rails server
rails s


Default server runs on:

http://localhost:3000

2. Frontend (React + Vite)
Prerequisites

Node.js 18+

npm or yarn

Step 1: Install dependencies
cd workflow_web
npm install

Step 2: Environment configuration

Create frontend .env file:

workflow_web/.env


Add:

VITE_API_BASE_URL=http://localhost:3000/api/v1

Step 3: Start development server
npm run dev


Frontend will run on:

http://localhost:5173

API Overview
Authentication
POST /api/v1/auth/sign_up     # Create company + admin user
POST /api/v1/auth/sign_in     # Login
GET  /api/v1/me               # Restore session

Workflows
GET    /api/v1/workflows
POST   /api/v1/workflows
GET    /api/v1/workflows/:id
PATCH  /api/v1/workflows/:id
DELETE /api/v1/workflows/:id

Tasks
GET    /api/v1/workflows/:workflow_id/tasks
POST   /api/v1/workflows/:workflow_id/tasks
PATCH  /api/v1/workflows/:workflow_id/tasks/:id
DELETE /api/v1/workflows/:workflow_id/tasks/:id

Project Structure
workflow/
 ├── workflow_api/        # Rails API backend
 |    ├── app/
 |    ├── config/
 |    ├── db/
 |    └── ...
 └── workflow_web/        # React frontend (Vite + TS)
      ├── src/
      ├── public/
      └── ...

Common Development Commands
Rails
rails db:create
rails db:migrate
rails db:seed
rails s

React
npm install
npm run dev

How It Works (High-Level)

A company is created during admin signup.

The admin receives a JWT token and stays authenticated.

The frontend stores the token in localStorage.

On page refresh, the frontend calls /me to restore user session.

Users create workflows (boards).

Each workflow contains tasks grouped by status.

Tasks can be created, updated, and moved between statuses.

Future Enhancements

Drag-and-drop (react-beautiful-dnd or @hello-pangea/dnd)

Comments on tasks

File attachments
