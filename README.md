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
