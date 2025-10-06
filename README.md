# Task Management API

Task Management API is a NestJS-based service that helps professionals organise work, manage tasks and categories, and obtain intelligent task breakdowns via Gemini. The project ships with production-ready tooling, TypeORM integration for PostgreSQL, Swagger documentation, and opinionated coding standards.

## Project Stack

- Node.js 18.18 (see `.nvmrc`)
- NestJS 10 with TypeScript 5
- PostgreSQL via TypeORM
- Swagger / Compodoc for documentation
- Winston for structured logging
- Husky, ESLint, Prettier, Commitlint for code quality

## Getting Started

### 1. Environment

1. Populate the checked-in `.env` template with real values for your environment.
2. All runtime settings are validated at start-up—complete every variable, including database credentials and Gemini configuration.

#### Required variables

- Application: `APP_PORT`, `APP_NODE_ENV`, `APP_CLUSTERING`
- Project: `PROJECT_NAME`, `PROJECT_DESCRIPTION`, `PROJECT_VERSION`
- Swagger: `SWAGGER_USERNAME`, `SWAGGER_PASSWORD`
- Database: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_SCHEMA`, `DATABASE_SSL`
- Gemini LLM: `LLM_GEMINI_API_BASE_URL`, `LLM_GEMINI_API_KEY`, `LLM_GEMINI_MODEL`, `LLM_GEMINI_TEMPERATURE`, `LLM_GEMINI_MAX_OUTPUT_TOKENS`
- Optional integrations: Firebase, AWS S3, SendGrid, Mailer

### 2. Installation

```bash
npm install
npx husky install
```

### 3. Running

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 4. Testing & Linting

```bash
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

### 5. Documentation

Swagger UI is exposed at `/docs` and requires the credentials configured via `SWAGGER_USERNAME` and `SWAGGER_PASSWORD`. Static documentation can be generated with:

```bash
npm run compodoc
```

## API Overview

- `GET /api/v1/categories` — paginated categories with task counts (supports search).
- `POST /api/v1/categories` — create a category; supports update (`PATCH`) and soft delete (`DELETE`).
- `GET /api/v1/tasks` — advanced filtering, sorting, and pagination across tasks.
- `POST /api/v1/tasks` — create tasks with category linkage and validation.
- `POST /api/v1/planning/task-breakdown` — generate LLM-assisted task breakdowns with heuristic fallback.

## Conventions

- Follow the folder structure described in `docs/folder-structure.md` when adding new modules.
- Commit messages must satisfy `.commitlintrc.json` (use uppercase scopes and lowercase subjects).
- Respect coding practices outlined in `docs/coding-standard.md`.

## Deployment Notes

- Use the provided Dockerfile for container builds; mount a writable `logs/` directory if needed.
- Configure `.ebextensions/01_papertrail.config` only if deploying to AWS Elastic Beanstalk with Papertrail logging.
