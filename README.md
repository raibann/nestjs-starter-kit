# NestJS Starter Kit

A comprehensive NestJS starter template with built-in authentication, authorization, role-based access control, and audit logging.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Permission management
  - Session management with refresh tokens
  - Token rotation and revocation

- 🗄️ **Database & ORM**
  - PostgreSQL with Prisma ORM
  - User management
  - Role and permission system
  - Audit logging for all actions

- 🚀 **Modern Development**
  - TypeScript support
  - Environment configuration
  - Input validation with class-validator
  - API documentation with Swagger
  - Rate limiting and throttling
  - Caching support

- 🧪 **Testing & Quality**
  - Unit and E2E testing with Jest
  - ESLint and Prettier configuration
  - Comprehensive test coverage

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Yarn package manager

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nestjs-starter-kit

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your database configuration

# Set up the database
yarn prisma generate
yarn prisma migrate dev
yarn prisma db seed
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
```

## Running the Application

```bash
# Development mode
yarn start:dev

# Production mode
yarn start:prod

# Debug mode
yarn start:debug
```

## Database Management

```bash
# Generate Prisma client
yarn prisma generate

# Run migrations
yarn prisma migrate dev

# Reset database
yarn prisma migrate reset

# Seed database
yarn prisma db seed

# Open Prisma Studio
yarn prisma studio
```

## Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov

# Watch mode
yarn test:watch
```

## Project Structure

```
src/
├── @types/           # Type definitions
├── common/           # Shared modules and services
│   ├── audit_log/    # Audit logging functionality
│   ├── bcrypt/       # Password hashing
│   └── prisma/       # Database connection
├── config/           # Configuration management
├── guard/            # Authentication guards
├── libs/             # Utility functions and enums
├── modules/          # Feature modules
│   ├── auth/         # Authentication module
│   ├── permission/   # Permission management
│   └── role/         # Role management
└── main.ts           # Application entry point
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/change-password` - Change user password

### User Management
- User CRUD operations (implement as needed)
- Role assignment
- Permission management

### Role Management
- `GET /roles` - List all roles
- `POST /roles` - Create new role
- `PUT /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role

### Permission Management
- `GET /permissions` - List all permissions
- `POST /permissions` - Create new permission
- `PUT /permissions/:id` - Update permission
- `DELETE /permissions/:id` - Delete permission

## Database Schema

The application uses a comprehensive database schema with:

- **Users**: Core user accounts with authentication
- **Roles**: User roles for grouping permissions
- **Permissions**: Granular access control permissions
- **UserRoles**: Many-to-many relationship between users and roles
- **RolePermissions**: Many-to-many relationship between roles and permissions
- **Sessions**: User session management
- **RefreshTokens**: JWT refresh token handling
- **AuditLogs**: Comprehensive action logging

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting and throttling
- Audit logging for security monitoring

## Development

```bash
# Code formatting
yarn format

# Linting
yarn lint

# Build
yarn build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using [NestJS](https://nestjs.com/)


