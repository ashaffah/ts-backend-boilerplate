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
- Unit testing setup with Jest.

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
   // Existing Aliases
   "~/*": ["./src/*"],
   "~/core/config": ["./src/core/config/*"],
   "~/core/constants": ["./src/core/constants/*"],
   "~/core/utils": ["./src/core/utils/*"],
   // Feature-specific Aliases
   "~/features/users": ["./src/features/users/*"],
   "@/generated/prisma": ["./generated/prisma/client.ts"]
}
```

## Project Structure

- `src/`: Contains the source code of the application.
  - `core/`: Core utilities, configurations, and constants.
    - `config/`: Application configuration files.
    - `constants/`: Application-wide constants.
    - `utils/`: Utility functions and helpers.
  - `features/`: Feature-specific modules and components.
- `tests/`: Unit and integration tests.
- `prisma/`: Prisma schema and migration files.
- `Dockerfile`: Docker configuration for containerizing the application.
- `docker-compose.yml`: Docker Compose configuration for multi-container setups.
