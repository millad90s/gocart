<div align="center">
  <h1><img src="https://gocartshop.in/favicon.ico" width="20" height="20" alt="Soulyn Jewelry Favicon">
   Soulyn Jewelry</h1>
  <p>
    An open-source multi-vendor e-commerce platform built with Next.js and Tailwind CSS.
  </p>
  <p>
    <a href="https://github.com/GreatStackDev/goCart/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/GreatStackDev/goCart?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/GreatStackDev/goCart/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
    <a href="https://github.com/GreatStackDev/goCart/issues"><img src="https://img.shields.io/github/issues/GreatStackDev/goCart?style=for-the-badge" alt="GitHub issues"></a>
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📦 Database Setup](#-database-setup)
- [🔧 Environment Configuration](#-environment-configuration)
- [📝 Available Scripts](#-available-scripts)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

- **Multi-Vendor Architecture:** Allows multiple vendors to register, manage their own products, and sell on a single platform.
- **Customer-Facing Storefront:** A beautiful and responsive user interface for customers to browse and purchase products.
- **Vendor Dashboards:** Dedicated dashboards for vendors to manage products, view sales analytics, and track orders.
- **Admin Panel:** A comprehensive dashboard for platform administrators to oversee vendors, products, and commissions.

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React for icons
- **State Management:** Redux Toolkit
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/GreatStackDev/goCart.git
cd soulynjewelry
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment files**

```bash
# The project will use .env.development for local development
# Update it if needed, or use the default Docker PostgreSQL settings
```

4. **Start the database**

```bash
npm run docker:up
```

5. **Generate Prisma Client and push schema to database**

```bash
npm run db:generate
npm run db:push
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/(public)/page.js`. The page auto-updates as you edit the file.

## 📦 Database Setup

This project uses PostgreSQL with Prisma ORM. For local development, we use Docker to run PostgreSQL in a container.

### Local Development (Docker)

The project includes a `docker-compose.yml` file for easy PostgreSQL setup:

```bash
# Start PostgreSQL container
npm run docker:up

# View PostgreSQL logs
npm run docker:logs

# Stop PostgreSQL container
npm run docker:down
```

**Default credentials:**
- User: `soulynjewelry`
- Password: `soulynjewelry_password`
- Database: `soulynjewelry`
- Port: `5432`

### Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🔧 Environment Configuration

The project uses separate environment files for different environments:

- **`.env.development`** - Development environment (Docker PostgreSQL)
- **`.env.production`** - Production environment (update with production credentials)
- **`.env.example`** - Template file with all required variables

### Development Environment

The `.env.development` file is pre-configured for Docker PostgreSQL:

```env
DATABASE_URL="postgresql://soulynjewelry:soulynjewelry_password@localhost:5432/soulynjewelry?schema=public"
DIRECT_URL="postgresql://soulynjewelry:soulynjewelry_password@localhost:5432/soulynjewelry?schema=public"
```

### Production Environment

Update `.env.production` with your production database credentials:

```env
DATABASE_URL="postgresql://user:password@your-host:5432/soulynjewelry?schema=public&sslmode=require"
DIRECT_URL="postgresql://user:password@your-host:5432/soulynjewelry?schema=public&sslmode=require"
```

For detailed environment setup instructions, see [ENV_SETUP.md](./ENV_SETUP.md).

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server (uses Turbopack)
- `npm run db:push` - Push schema to dev database
- `npm run db:migrate` - Run migrations on dev database
- `npm run db:studio` - Open Prisma Studio for dev database
- `npm run db:generate` - Generate Prisma Client

### Production
- `npm run build` - Build for production
- `npm run build:prod` - Build with production environment
- `npm run start` - Start production server
- `npm run db:push:prod` - Push schema to production database
- `npm run db:migrate:prod` - Deploy migrations to production
- `npm run db:studio:prod` - Open Prisma Studio for production database

### Docker
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop PostgreSQL container
- `npm run docker:logs` - View PostgreSQL logs

### Other
- `npm run lint` - Run ESLint

---

## 🤝 Contributing <a name="-contributing"></a>

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to get started.

---

## 📜 License <a name="-license"></a>

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
