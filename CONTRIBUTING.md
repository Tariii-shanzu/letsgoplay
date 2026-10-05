# Contributing to LetsGoPlay

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/letsgoplay.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Setting Up

```bash
# Install dependencies
npm install

# Start Docker services
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development servers
npm run dev
```

### Code Style

We use ESLint and Prettier for consistency:

```bash
# Lint
npm run lint

# Format
npm run format
```

### Testing

```bash
# Run tests
npm run test
```

## Pull Request Process

1. Ensure code follows project style
2. Write or update tests for changes
3. Update documentation if needed
4. Create clear, descriptive PR title
5. Include detailed description of changes
6. Link related issues
7. Ensure all CI checks pass

## Commit Message Guidelines

- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `test: Add tests`
- `refactor: Refactor code`
- `chore: Update dependencies`

## Reporting Issues

When reporting issues, include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## License

By contributing, you agree your contributions are licensed under the MIT License.
