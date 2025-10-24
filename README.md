# Commitly Server

A RESTful API server built with Express.js, TypeScript, and PostgreSQL for managing user authentication and data in the Commitly application.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Scripts](#scripts)
- [Code Quality](#code-quality)

## ✨ Features

- **RESTful API** with Express.js
- **Type-safe** development with TypeScript
- **PostgreSQL** database with Sequelize ORM
- **Request validation** using Zod schemas
- **Auth0 integration** for user authentication
- **Comprehensive test coverage** with Jest
- **CORS enabled** for frontend integration
- **Environment-based configuration** (development, test, production)
- **Code quality tools** (ESLint, Prettier, Husky)
- **Conventional commits** with Commitlint

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL
- **ORM**: Sequelize v6
- **Validation**: Zod v4
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint, Prettier, Husky
- **Package Manager**: pnpm

## 📁 Project Structure

```
server/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config.ts                 # Environment configuration
│   ├── controllers/              # Request handlers
│   │   └── users/
│   │       ├── createUser.controller.ts
│   │       ├── getAllUsers.controller.ts
│   │       └── deleteUser.controller.ts
│   ├── database/                 # Database setup
│   │   ├── connection.ts         # Sequelize instance
│   │   └── models/
│   │       ├── user.model.ts     # User model definition
│   │       └── associations.ts   # Model relationships
│   ├── middlewares/              # Custom middleware
│   │   └── validateRequestSchema.middleware.ts
│   ├── routes/                   # API routes
│   │   ├── index.ts              # Route aggregator
│   │   └── user.route.ts         # User endpoints
│   ├── schemas/                  # Zod validation schemas
│   │   └── user.schema.ts
│   ├── services/                 # Business logic
│   │   └── users/
│   │       ├── createUser.service.ts
│   │       ├── getAllUsers.service.ts
│   │       └── deleteUser.service.ts
│   └── scripts/                  # Utility scripts
│       └── syncDatabase.ts       # Database sync script
├── tests/                        # Test files
│   ├── app.test.ts
│   ├── middlewares/
│   └── routes/
│       └── users/
│           ├── get.users.test.ts
│           ├── post.users.test.ts
│           ├── put.users.test.ts
│           └── delete.users.test.ts
├── docker-compose.yml            # Docker services
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── eslint.config.mts             # ESLint configuration
├── .prettierrc.json              # Prettier configuration
└── commitlint.config.mjs         # Commitlint configuration
```

## 📦 Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** v10.12.1 or higher
- **PostgreSQL** v18 or higher
- **Docker** (optional, for containerized database)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the server root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Development Database
DEV_DB_NAME=commitly_dev
DEV_DB_USER=postgres
DEV_DB_PASSWORD=password
DEV_DB_HOST=localhost

# Test Database
TEST_DB_NAME=commitly_test
TEST_DB_USER=postgres
TEST_DB_PASSWORD=password
TEST_DB_HOST=localhost

# Production Database
PROD_DB_NAME=commitly_prod
PROD_DB_USER=postgres
PROD_DB_PASSWORD=your_secure_password
PROD_DB_HOST=your_prod_host
```

### CORS Configuration

The server is configured to accept requests from `http://localhost:5173` (default Vite dev server). Update `src/app.ts` to modify CORS settings:

```typescript
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
```

## 🗄️ Database Setup

### Using Docker (Recommended)

1. **Start PostgreSQL and Adminer**

   ```bash
   docker-compose up -d
   ```

   This starts:
   - PostgreSQL on port `5432`
   - Adminer (database admin UI) on port `8080`

2. **Create databases**
   - Access Adminer at `http://localhost:8080`
   - Create `commitly_dev` and `commitly_test` databases

### Using Local PostgreSQL

1. **Install PostgreSQL** on your machine
2. **Create databases**
   ```bash
   psql -U postgres
   CREATE DATABASE commitly_dev;
   CREATE DATABASE commitly_test;
   ```

### Sync Database Schema

Run the sync script to create tables:

```bash
pnpm exec ts-node src/scripts/syncDatabase.ts
```

⚠️ **Warning**: This script uses `force: true` which drops existing tables. Use with caution in production.

## 🏃 Running the Application

### Development Mode

```bash
# Standard development mode
pnpm run dev

# Watch mode (auto-restart on changes)
pnpm run dev:watch
```

### Production Mode

```bash
# Build TypeScript to JavaScript
pnpm run build

# Start production server
pnpm start
```

The server will run on `http://localhost:3000` (or the PORT specified in `.env`).

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Generate coverage report
pnpm run coverage
```

### Test Structure

- Tests mirror the `src/` directory structure
- Unit tests for controllers, services, and middleware
- Integration tests for API endpoints using supertest
- Separate test database configuration

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Users

| Method | Endpoint     | Description       | Request Body             | Response                                  |
| ------ | ------------ | ----------------- | ------------------------ | ----------------------------------------- |
| GET    | `/users`     | Get all users     | -                        | 200: User[]                               |
| POST   | `/users`     | Create/find user  | User object (see schema) | 201: User (created)<br>200: User (exists) |
| DELETE | `/users/:id` | Delete user by ID | -                        | 204: No Content<br>404: Not Found         |

### User Schema

```typescript
{
  id?: number;                    // Auto-generated
  nickname: string;               // Required, min 1 char
  name: string;                   // User's full name
  picture: string;                // URL (Gravatar, Auth0, or Google)
  email: string;                  // Valid email, unique
  email_verified: boolean;        // Email verification status
  sub: string;                    // Auth0 ID (format: auth0|{alphanumeric})
  updated_at: Date | string;      // Auto-managed
  created_at?: Date | string;     // Auto-generated
}
```

### Example Requests

#### Create/Find User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "john.doe",
    "name": "John Doe",
    "picture": "https://s.gravatar.com/avatar/example",
    "email": "john@example.com",
    "email_verified": false,
    "sub": "auth0|63fceee13df9151a2850b65c",
    "updated_at": "2025-10-24T16:24:38.091Z"
  }'
```

#### Get All Users

```bash
curl http://localhost:3000/api/users
```

#### Delete User

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

### Validation

All requests are validated using Zod schemas:

- Invalid data returns `400 Bad Request` with detailed error messages
- Missing required fields are caught before reaching the database
- Type coercion for URL parameters (e.g., string "1" → number 1)

### Error Responses

```typescript
// Validation Error (400)
[
  {
    "path": ["body", "email"],
    "message": "Invalid email"
  }
]

// Not Found (404)
{
  "message": "User not found"
}

// Internal Server Error (500)
{
  "message": "Internal Server Error"
}
```

## 👨‍💻 Development

### Architecture

The application follows a **layered architecture**:

1. **Routes** → Define API endpoints and apply middleware
2. **Middleware** → Validate requests using Zod schemas
3. **Controllers** → Handle HTTP requests/responses
4. **Services** → Contain business logic and database operations
5. **Models** → Define database schema with Sequelize

### Adding a New Feature

1. **Define Schema** (`src/schemas/`)

   ```typescript
   export const featureSchema = z.object({
     // Define validation rules
   });
   ```

2. **Create Model** (`src/database/models/`)

   ```typescript
   export const Feature = sequelize.define("Feature", {
     // Define database columns
   });
   ```

3. **Implement Service** (`src/services/`)

   ```typescript
   export const createFeature = async (data) => {
     // Business logic
   };
   ```

4. **Create Controller** (`src/controllers/`)

   ```typescript
   export const createFeatureController = async (req, res) => {
     // Handle request/response
   };
   ```

5. **Define Routes** (`src/routes/`)

   ```typescript
   router.post("/", validateRequest(schema), controller);
   ```

6. **Write Tests** (`tests/`)
   ```typescript
   describe("POST /feature", () => {
     it("should create feature", async () => {
       // Test implementation
     });
   });
   ```

## 📜 Scripts

| Script                | Description                           |
| --------------------- | ------------------------------------- |
| `pnpm run dev`        | Start development server with ts-node |
| `pnpm run dev:watch`  | Start dev server with auto-reload     |
| `pnpm run build`      | Compile TypeScript to JavaScript      |
| `pnpm start`          | Run compiled production server        |
| `pnpm test`           | Run all tests in band                 |
| `pnpm run test:watch` | Run tests in watch mode               |
| `pnpm run coverage`   | Generate test coverage report         |
| `pnpm run lint`       | Lint code with ESLint                 |
| `pnpm run lint:fix`   | Auto-fix linting issues               |
| `pnpm run format`     | Format code with Prettier             |
| `pnpm run prepare`    | Setup Husky git hooks                 |

## 🎨 Code Quality

### ESLint

- Configured with TypeScript support
- Extends `@eslint/js` recommended rules
- Run: `pnpm run lint`

### Prettier

- Consistent code formatting
- 2-space indentation, semicolons, double quotes
- Run: `pnpm run format`

### Husky & Lint-Staged

- **Pre-commit hook**: Automatically formats and lints staged files
- Enforces code quality before commits

### Commitlint

- Enforces conventional commit messages
- Format: `type(scope): subject`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(users): add update user endpoint`

### Testing Standards

- Unit tests for services and controllers
- Integration tests for API endpoints
- Minimum coverage tracked in `coverage/` directory
- Tests run in band with `--runInBand` flag to avoid database conflicts

## 🔐 Security Considerations

- **Auth0 Integration**: User `sub` field validated against Auth0 pattern
- **Picture URL Validation**: Only allows trusted domains (Gravatar, Auth0, Google)
- **Email Validation**: Built-in email format validation
- **SQL Injection Protection**: Sequelize ORM with parameterized queries
- **CORS**: Configured for specific frontend origin
- **Environment Variables**: Sensitive data stored in `.env` (not committed)

## 🐳 Docker Support

The included `docker-compose.yml` provides:

- **PostgreSQL 18**: Main database
- **Adminer**: Web-based database administration tool

Start services:

```bash
docker-compose up -d
```

Stop services:

```bash
docker-compose down
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feat/amazing-feature`
2. Commit changes: `git commit -m 'feat: add amazing feature'`
3. Push to branch: `git push origin feat/amazing-feature`
4. Run tests: `pnpm test`
5. Ensure linting passes: `pnpm run lint`

## 📝 License

ISC

## 🙋 Support

For issues and questions, please check existing issues or create a new one in the repository.
