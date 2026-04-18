# Cresction E-Commerce Platform

**Beautiful microservices-based e-commerce website with authentication, product catalog, and shopping cart.**

---

## 📋 Overview

Cresction is a modern, scalable e-commerce platform built using a **microservices architecture**. It features user authentication, product catalog with filtering, shopping cart functionality, and a premium responsive UI.

### Key Features

- **User Authentication**: Register, login, and profile management (JWT-based)
- **Product Catalog**: Browse products with category and price filtering
- **Shopping Cart**: Add/remove items, quantity updates, persistent cart
- **Checkout Process**: Multi-step checkout with shipping and payment (demo)
- **Responsive UI**: Beautiful glass-morphism design, dark/light theme toggle
- **Microservices**: Independent services for user, product, cart, and API gateway
- **Dockerized**: Full containerization with Docker Compose for easy setup
- **CI/CD**: GitHub Actions pipeline for building, testing, and deployment

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                               Frontend (React)                         │
│                     http://localhost:3001 (dev) / (prod)               │
├─────────────┬─────────────┬─────────────┬─────────────────────────────┤
│   API Gateway (Node.js + Express)                                      │
│        http://localhost:3000                                           │
├─────────────┼─────────────┼─────────────┼─────────────────────────────┤
│ User Service│Product Svc  │Cart Service │   (Redis)  (PostgreSQL)     │
│  :3001      │  :3002      │  :3003      │                             │
└─────────────┴─────────────┴─────────────┴─────────────────────────────┘
```

### Microservices

- **API Gateway**: Single entry point, routes requests, handles JWT auth
- **User Service**: Authentication, user CRUD, user profile
- **Product Service**: Product catalog, categories, inventory
- **Cart Service**: Shopping cart operations, integrates with Redis cache
- **Databases**: PostgreSQL (per service schemas), Redis for caching
- **Frontend**: React + TypeScript + Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cresction
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL on `localhost:5432`
   - Redis on `localhost:6379`
   - API Gateway on `http://localhost:3000`
   - User Service on `:3001` (internal)
   - Product Service on `:3002` (internal)
   - Cart Service on `:3003` (internal)
   - Frontend on `http://localhost:3001`

3. **Access the application**

   Open your browser to `http://localhost:3001`

4. **Initial Data**

   The database init script (`database/init.sql`) creates the necessary schemas and tables. No seed data is included by default.

---

## 📁 Project Structure

```
Cresction/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React contexts (auth, cart)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/
│   ├── user-service/        # Authentication microservice
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── product-service/     # Product catalog microservice
│   ├── cart-service/        # Shopping cart microservice
│   └── api-gateway/         # API Gateway
├── database/
│   └── init.sql             # Database schema
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm install
npm run test
```

### Backend Services
Each service includes a basic test setup with Jest. Example:
```bash
cd backend/user-service
npm install
npm test
```

---

## 🛠️ Development

### Running Services Individually (without Docker)

1. **Set up databases** (PostgreSQL + Redis)
2. **Update environment variables** in each service's `.env` file
3. **Start each service**:
   ```bash
   cd backend/user-service && npm install && npm run dev
   cd backend/product-service && npm install && npm run dev
   cd backend/cart-service && npm install && npm run dev
   cd backend/api-gateway && npm install && npm run dev
   ```
4. **Start frontend**:
   ```bash
   cd frontend && npm install && npm run dev
   ```

### Environment Variables

Key variables to configure:

#### Backend Services
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing (change in production!)
- `REDIS_URL`: Redis connection string
- `PORT`: Service port (3001, 3002, 3003)

#### API Gateway
- `USER_SERVICE_URL`, `PRODUCT_SERVICE_URL`, `CART_SERVICE_URL`
- `JWT_SECRET`
- `REDIS_URL`

#### Frontend
- `VITE_API_URL`: API gateway URL (default: `http://localhost:3000`)

---

## 🔒 Security

- JWT authentication with short-lived tokens
- Password hashing with bcrypt
- Helmet.js for security headers
- Rate limiting on all services
- CORS configured for cross-origin requests
- SQL injection prevention via parameterized queries

---

## 📈 Performance

- Redis caching for cart data
- Indexed database queries
- React lazy loading and code splitting (configured in Vite)
- Docker multi-stage builds for optimized images
- Nginx reverse proxy with gzip compression

---

## 🧩 Extending the Platform

### Adding a New Microservice

1. Create a new directory under `backend/` (e.g., `order-service`)
2. Scaffold a Node.js/Express service with Dockerfile
3. Add service to `docker-compose.yml`
4. Update API gateway to proxy routes to the new service
5. Add service-specific database schema to `init.sql`
6. Create frontend API client functions as needed

### Adding New Features

- Follow the existing service structure
- Use ADRs (see below) for architectural decisions
- Write tests and update documentation

---

## 📜 Architecture Decision Records (ADRs)

### ADR-001: Microservices over Monolith

**Status**: Accepted

**Context**: We need a scalable e-commerce platform that can be maintained by separate teams and scale independently.

**Decision**: Adopt a microservices architecture decomposing the system into user, product, cart, and order services (with more as needed).

**Consequences**:
- **Pros**: Independent scaling, technology flexibility, team autonomy
- **Cons**: Increased operational complexity, network latency, distributed data management challenges

---

### ADR-002: Node.js/Express for Backend Services

**Status**: Accepted

**Context**: Choose a backend technology for microservices.

**Decision**: Use Node.js with Express for all backend microservices.

**Consequences**:
- **Pros**: Unified language (JavaScript/TypeScript), large ecosystem, fast development
- **Cons**: Single-threaded nature (mitigated with clustering), dynamic typing risk (mitigated with TypeScript)

---

### ADR-003: PostgreSQL as Primary Database

**Status**: Accepted

**Context**: Need a reliable, ACID-compliant database for transactional data.

**Decision**: Use PostgreSQL for all microservices with separate schemas.

**Consequences**:
- **Pros**: Data integrity, rich features, strong community
- **Cons**: Requires careful schema design, scaling reads with replicas may be needed later

---

### ADR-004: Redis for Caching and Session Storage

**Status**: Accepted

**Context**: Need fast caching for frequently accessed data like shopping carts.

**Decision**: Use Redis as a caching layer and for temporary session/cart data.

**Consequences**:
- **Pros**: Performance boost, TTL-based expiration, pub/sub capabilities
- **Cons**: Additional infrastructure, data not persistent by default (acceptable for cache)

---

### ADR-005: React + TypeScript for Frontend

**Status**: Accepted

**Context**: Build a modern, responsive user interface with strong type safety.

**Decision**: Use React with TypeScript and Tailwind CSS.

**Consequences**:
- **Pros**: Type safety, component reusability, excellent tooling, rapid UI development
- **Cons**: Bundle size (managed by Vite), learning curve for new developers

---

### ADR-006: API Gateway Pattern

**Status**: Accepted

**Context**: Need a single entry point for clients, with authentication and routing.

**Decision**: Implement an API Gateway that proxies to microservices and handles JWT validation.

**Consequences**:
- **Pros**: Centralized auth, simplified client integration, cross-cutting concerns handling
- **Cons**: Single point of failure (mitigated with redundancy), potential bottleneck

---

## 🧪 CI/CD Pipeline

We use GitHub Actions for continuous integration and deployment:

- **Linting & Testing**: Runs on every PR and push
- **Docker Build & Push**: Builds and pushes images to GitHub Container Registry (GHCR) on merge to main/develop
- **Deployment**: Placeholder jobs for staging and production (customize with your cloud provider)

Customize the `deploy-staging` and `deploy-production` jobs to use your infrastructure (Kubernetes, AWS ECS, etc.).

---

## 🔧 Configuration for Production

### Environment

- Set strong, random secrets for `JWT_SECRET` in all services
- Use managed PostgreSQL and Redis services
- Configure proper domain names and TLS (HTTPS)
- Set up monitoring (Prometheus, Grafana) and logging (ELK, Loki)
- Use a process manager (PM2, systemd) for Node.js processes in production

### Database

- Run `init.sql` to create schemas
- Consider separate databases per service for strong isolation (currently using schemas)
- Set up regular backups
- Configure read replicas for read-heavy services

### Scaling

- Frontend: Serve via CDN (e.g., Cloudflare, AWS CloudFront)
- API Gateway and services: Deploy multiple instances behind a load balancer
- Database: Add read replicas, consider connection pooling (PgBouncer)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow the coding standards and include tests for new features.

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using microservices architecture**
