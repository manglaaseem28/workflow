# Workflow -- Lightweight Jira Clone (Rails API + React)

Workflow is a multi-tenant project management application inspired by
Jira and Linear. It provides companies, users, workflows (boards), and
tasks with clearly defined statuses. The project is built as a
full-stack application with a Ruby on Rails API backend and a React
(Vite + TypeScript) frontend.

## Features

### Multi-Tenant Architecture

-   Company is created automatically on admin sign-up.
-   Users belong to companies.
-   Workflows and tasks are isolated per company.

## 🔎 What to look at (quick)

- **Multi-tenant model & scoping**
  - `app/models/current.rb` — request-scoped tenant context (pattern used)
  - `app/models/company.rb` and `app/models/account.rb` — tenancy/multi-tenant schema

- **Auth & API**
  - `app/controllers/api/v1/auth_controller.rb` — JWT sign_in / sign_up / me
  - `config/initializers/jwt.rb` — JWT helper (if present) or see `app/lib/json_web_token.rb`

- **Background jobs / ETL**
  - `app/jobs/import_transactions_job.rb` — idempotent CSV/API ingestion example
  - `app/services/transaction_service.rb` — upsert/normalization logic (example)

- **DevOps / CI**
  - `.github/workflows/ci.yml` — basic CI running tests
  - `Dockerfile` & `docker-compose.yml` — local dev + Postgres example

### Authentication

-   JWT-based authentication.
-   Sign Up creates company + admin user.
-   Sign In returns a JWT token.
-   `/me` endpoint hydrates session on page refresh.

### Workflows and Tasks

-   Create workflows from the frontend UI.
-   Each workflow contains tasks grouped into four statuses:
    -   `initial`
    -   `planning`
    -   `review`
    -   `closed`
-   Create and edit tasks.
-   Status can be changed (drag-and-drop planned).

### Frontend UI

-   React + Vite + TypeScript
-   Material UI with a custom pastel theme
-   Responsive Kanban-style board layout
-   Dialog-based workflow and task creation

# Backend Setup (Rails API)

## Requirements

-   Ruby 2.7+
-   Rails 7+
-   PostgreSQL
-   Bundler

## 1. Install dependencies

    cd workflow_api
    bundle install

## 2. Configure PostgreSQL

Edit `config/database.yml`:

``` yaml
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
```

Create and migrate:

    rails db:create
    rails db:migrate

## 3. Environment variables

Create `.env` inside `workflow_api`:

    SECRET_KEY_BASE=your-secret-key

(optional) Add to `Gemfile`:

    gem "dotenv-rails", groups: [:development, :test]

## 4. Start Rails server

    rails s

# Frontend Setup (React + Vite)

## Requirements

-   Node.js 18+
-   npm or yarn

## 1. Install dependencies

    cd workflow_web
    npm install

## 2. Create .env file

    VITE_API_BASE_URL=http://localhost:3000/api/v1

## 3. Start frontend

    npm run dev

# API Endpoints Overview

## Authentication

    POST /api/v1/auth/sign_up
    POST /api/v1/auth/sign_in
    GET  /api/v1/me

## Workflows

    GET    /api/v1/workflows
    POST   /api/v1/workflows
    GET    /api/v1/workflows/:id
    PATCH  /api/v1/workflows/:id
    DELETE /api/v1/workflows/:id

## Tasks

    GET    /api/v1/workflows/:workflow_id/tasks
    POST   /api/v1/workflows/:workflow_id/tasks
    PATCH  /api/v1/workflows/:workflow_id/tasks/:id
    DELETE /api/v1/workflows/:workflow_id/tasks/:id

# Project Structure

    workflow/
     ├── workflow_api/
     └── workflow_web/

# Future Enhancements

-   Drag and drop task movement
-   Comments
-   Invitations
-   Workflow templates
-   Activity logs
