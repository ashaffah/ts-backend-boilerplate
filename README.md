# Typescript Backend Boilerplate

A boilerplate project for building backend applications using TypeScript, Node.js, and Fastify. This boilerplate includes essential features such as routing, middleware, error handling, and database integration to help you kickstart your backend development.

## Features

- TypeScript support for type safety and modern JavaScript features.
- Fastify framework for high-performance HTTP server.
- Database integration using Prisma ORM.
- Environment variable management.
- Modular project structure for scalability and maintainability.
- Pre-configured linting and formatting with ESLint and Prettier.
- Sample routes and controllers to get you started quickly.
- Docker support for containerized development and deployment.
- Unit testing setup with Jest or Vitest.
- Feature-based modular structure with dedicated folders for controllers, services, repositories, schemas, types, and tests.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, bun, or pnpm package manager
- Docker or Other containerization tool (Recommended)
- PostgreSQL database
- ScyllaDB database
- Valkey
- ElasticSearch
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
3. Install dependencies using your preferred package manager:
   ```bash
   npm install
   ```
4. Set up your environment variables by creating a `.env` file based on the provided `.env.example` file.
5. Build the project:
   ```bash
   npm run build
   ```
6. Run generate Prisma client
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

The project uses path aliases for better module resolution. Check the [tsconfig.json](./tsconfig.json) file for the configured aliases. Here are some examples:

```json
// Path Aliases
"baseUrl": ".",
"paths": {
   "~/*": ["./src/*"],
   "~/core/config": ["./src/core/config/*"],
   "~/core/constants": ["./src/core/constants/*"],
   "~/core/utils": ["./src/core/utils/*"],
   // Feature-specific Aliases
   "~/features/users": ["./src/features/users/*"],
   "~/features/auth": ["./src/features/auth/*"]
}
```

## Project Structure

- `src/`: Contains the source code of the application.
  - `core/`: Core utilities, configurations, and constants.
    - `config/`: Application configuration files.
    - `constants/`: Application-wide constants.
    - `utils/`: Utility functions and helpers.
  - `features/`: Feature-specific modules and components.
    - Each feature (e.g. `auth`, `users`) has its own folder:
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
        routes/auth.routes.ts
        schemas/auth.schema.ts
        dtos/auth.dto.ts
        types/auth.types.ts
        __tests__/auth.service.test.ts
        index.ts
      ```
- `tests/`: Unit and integration tests (feature tests are colocated in their respective folders).
- `prisma/`: Prisma schema and migration files.
- `Dockerfile`: Docker configuration for containerizing the application.
- `docker-compose.yml`: Docker Compose configuration for multi-container setups.

## Testing

- Unit tests for each feature are placed in the `__tests__` folder inside the respective feature directory.
- Example:
  ```
  src/features/auth/__tests__/auth.service.test.ts
  ```
- Run tests with:
  ```bash
  npm test
  ```
  or
  ```bash
  npx jest
  ```
  or
  ```bash
  npx vitest
  ```

## Contribution

Feel free to open issues or pull requests for improvements and new features.
