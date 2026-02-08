# Typescript Backend Boilerplate

A boilerplate project for building backend applications using TypeScript, Node.js, and Fastify. This boilerplate includes essential features such as routing, middleware, error handling, and database integration to help you kickstart your backend development.

## Features

- TypeScript support for type safety and modern JavaScript features.
- Fastify framework for high-performance HTTP server.
- Database integration using Prisma ORM (with support for manual epoch timestamp fields).
- Environment variable management with validation.
- Modular project structure for scalability and maintainability.
- Pre-configured linting and formatting with ESLint and Prettier.
- Sample routes and controllers for authentication and user management.
- Docker support for containerized development and deployment.
- Unit testing setup with Jest or Vitest.
- Feature-based modular structure with dedicated folders for controllers, services, repositories, schemas, types, and tests.
- Integration with PostgreSQL, ScyllaDB, Valkey, Elasticsearch, and MinIO.

## Prisma & Timestamp Fields

> **Note:** Prisma's `@updatedAt` attribute only works with `DateTime` fields. If you use `BigInt` (epoch) for timestamps, you must update them manually (e.g., via Prisma middleware). See [`src/core/config/database.config.ts`](src/core/config/database.config.ts) for an example that sets `updatedAt` to the current epoch on every update operation.

If your `updatedAt` is not updating automatically:

- Ensure your Prisma model uses `DateTime` for `@updatedAt`, or use middleware for `BigInt`.
- The middleware for updating `updatedAt` is included directly in [`src/core/config/database.config.ts`](src/core/config/database.config.ts).
- Restart your server after changes.

## Custom Error Handling

For custom error responses, use a custom error class (e.g., [`HttpError`](src/core/utils/http.error.util.ts)) and a global error handler middleware. Throw your custom error in repositories/services, and catch it in the error handler to send a consistent error response.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, bun, or pnpm package manager
- Docker or other containerization tool (Recommended)
- PostgreSQL database
- ScyllaDB database
- Valkey
- Elasticsearch
- MinIO

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashaffah/ts-backend-boilerplate.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ts-backend-boilerplate
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables by creating a `.env` file based on the provided `.env.example` file.
5. Build the project:
   ```bash
   npm run build
   ```
6. Generate Prisma client:
   ```bash
   npm run generate
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```
8. Open your browser and navigate to `http://localhost:8080/api/v1` to see the application running.

### Usage

#### Path Aliases

The project uses path aliases for better module resolution. Check the [`tsconfig.json`](tsconfig.json) file for the configured aliases. Here are some examples:

```json
"baseUrl": ".",
"paths": {
  "~/*": ["./src/*"],
  "~/core/config/*": ["./src/core/config/*"],
  "~/core/constants/*": ["./src/core/constants/*"],
  "~/core/utils/*": ["./src/core/utils/*"],
  "~/core/types/*": ["./src/core/types/*"],
  "~/core/middlewares/*": ["./src/core/middlewares/*"],
  "~/core/constant/*": ["./src/core/constant/*"],
  "~/features/user/*": ["./src/features/user/*"]
}
```

## Project Structure

- `src/`: Contains the source code of the application.
  - `core/`: Core utilities, configurations, and constants.
    - `config/`: Application configuration files (database, cache, env, logger, etc).
    - `constant/`: Application-wide constants (e.g., epoch).
    - `utils/`: Utility functions and helpers (e.g., password hashing, error classes).
  - `features/`: Feature-specific modules and components.
    - Each feature (e.g. `auth`, `user`) has its own folder:
      ```
      src/features/<feature>/
        controllers/
        services/
        repositories/
        routes/
        schemas/
        dtos/
        types/
        __tests__/
        index.ts
      ```
      Example for `auth` feature:
      ```
      src/features/auth/
        controllers/auth.controller.ts
        services/auth.service.ts
        repositories/auth.repository.ts
        routes/auth.route.ts
        schemas/auth.schema.ts
        dtos/auth.dto.ts
        index.ts
      ```
- `tests/`: Unit and integration tests (feature tests are colocated in their respective folders).
- `prisma/`: Prisma schema and migration files.
- `generated/`: Generated Prisma client and types.
- `Dockerfile`: Docker configuration for containerizing the application.
- `docker-compose.yml`: Docker Compose configuration for multi-container setups.
- `.env.example`: Example environment variables file.

## Testing

- Unit tests for each feature are placed in the `__tests__` folder inside the respective feature directory (e.g., `src/features/user/__tests__/user.service.test.ts`).
- Run tests with:
  ```bash
  npm test
  # or
  npx jest
  # or
  npx vitest
  ```

## Troubleshooting

- **Prisma @updatedAt error:** Only works with `DateTime` fields. For `BigInt` (epoch), use manual update (see Prisma middleware in [`src/core/config/database.config.ts`](src/core/config/database.config.ts)).
- **Custom error response:** Use a custom error class and global error handler middleware for consistent API error responses.

## Contribution

Feel free to open issues or pull requests for improvements and new features.
