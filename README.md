# LetsGoPlay – Cost Efficient Proxy

A fully-featured, production-ready web-based proxy application built with modern, official tools.

## Features

- 🌐 HTTP/HTTPS proxy support
- 🎯 Real-time proxy dashboard
- 🔐 JWT-based authentication
- 📊 Traffic analytics & charts
- ⚡ High-performance async architecture
- 🐳 Docker containerization
- 📈 Scalable database with PostgreSQL
- 💾 Redis caching & rate limiting

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Proxy Engine**: http-proxy

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Package Manager**: npm workspaces

## Project Structure

```
letsgoplay/
├── apps/
│   ├── backend/              # Express.js API
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── lib/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   └── frontend/             # React SPA
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- npm 9+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tariii-shanzu/letsgoplay.git
   cd letsgoplay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   ```

4. **Start Docker services** (PostgreSQL + Redis)
   ```bash
   docker-compose up -d
   ```

5. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

6. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

7. **Start development servers**
   ```bash
   npm run dev
   ```

### Access the application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user (requires auth)

### Proxies (requires authentication)
- `GET /api/proxies` – List all proxies
- `POST /api/proxies` – Create new proxy
- `PUT /api/proxies/:id` – Update proxy
- `DELETE /api/proxies/:id` – Delete proxy
- `GET /api/proxies/:id` – Get proxy details

### Health
- `GET /api/health` – Health check

## Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend

# Building
npm run build        # Build frontend and backend

# Testing
npm run test         # Run all tests

# Linting
npm run lint         # Lint all packages

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## Environment Variables

```env
NODE_ENV=development

# Backend
PORT=3000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/letsgoplay

# Redis
REDIS_URL=redis://localhost:6379

# Frontend
VITE_API_URL=http://localhost:3000/api
```

## Features Roadmap

### Phase 1 ✅ (Current)
- [x] User authentication (register/login)
- [x] Proxy CRUD operations
- [x] Dashboard with stats
- [x] Traffic charts
- [x] Rate limiting
- [x] Health checks

### Phase 2 (Upcoming)
- [ ] Real proxy tunneling
- [ ] Request/response logging
- [ ] Advanced analytics
- [ ] Admin panel
- [ ] Role-based access control
- [ ] Proxy rule templates

### Phase 3 (Future)
- [ ] WebSocket for real-time updates
- [ ] SSL certificate management
- [ ] Load balancing
- [ ] Multi-tenant support
- [ ] API quotas & billing
- [ ] Custom plugins

## Production Deployment

For production, use:
- Kubernetes or Docker Swarm for orchestration
- Nginx as reverse proxy
- PostgreSQL managed database service
- Redis managed service
- GitHub Actions for CI/CD

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License – see [LICENSE](./LICENSE)

## Support

For issues and questions, please create a GitHub issue.
