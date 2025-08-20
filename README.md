# E-Commerce (Coffee Shop) Fullstack Application

A modern e-commerce application built with NestJS backend API and React Native mobile app using Expo. This project demonstrates hexagonal architecture principles with Domain-Driven Design (DDD) for the backend and Redux Toolkit Query for state management in the mobile app.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API (NestJS)](#api-nestjs)
- [Mobile App (React Native + Expo)](#mobile-app-react-native--expo)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🚀 Project Overview

This fullstack e-commerce application consists of:

- **Backend API**: NestJS with TypeORM, PostgreSQL, Clean Architecture, and DDD
- **Mobile App**: React Native with Expo, Redux Toolkit Query, and i18n support
- **Features**: Product catalog, shopping cart, payment integration (Wompi), delivery management

## 🏗️ Architecture

### API Architecture (Clean Architecture + DDD)

The API follows Clean Architecture principles with Domain-Driven Design:

```
api_nest/
├── domain/                    # Business Logic Layer
│   ├── products/             # Product Domain
│   │   ├── model/           # Domain Models
│   │   ├── repository/      # Repository Interfaces
│   │   └── use_case/        # Business Use Cases
│   ├── transaction/         # Transaction Domain
│   ├── delivery/            # Delivery Domain
│   └── presigned/           # Presigned URLs Domain
├── src/
│   ├── adapter/             # Adapter Layer
│   │   └── in/              # Input Adapters
│   │       ├── controllers/ # REST Controllers
│   │       ├── handlers/    # Request Handlers
│   │       ├── dtos/        # Data Transfer Objects
│   │       └── mappers/     # Domain ↔ DTO Mappers
│   │   └── out/             # Output Adapters
│   │        └── postgres/   # Entities and implementation from repository
│   │        └── wompi/      # Integration from transaction flow
│   ├── config/              # Configuration
│   └── db/                  # Database Layer
│       ├── migrations/      # TypeORM Migrations
│       └── seeds/           # Database Seeds
```

**Key Principles:**
- **Domain Layer**: Contains business logic, entities, and use cases
- **Adapter Layer**: Handles external communication (HTTP, Database)
- **Dependency Inversion**: Domain doesn't depend on external layers
- **Use Cases**: Encapsulate business rules and orchestrate domain operations

### Mobile App Architecture

The React Native app uses modern state management and navigation:

```
app_rn/
├── app/                     # Expo Router Pages
├── components/              # Reusable Components
│   └── ui/                 # UI Components
├── store/                  # Redux Store
│   └── api/                # RTK Query APIs
├── hooks/                  # Custom React Hooks
├── i18n/                   # Internationalization
├── types/                  # TypeScript Types
└── config/                 # App Configuration
```

**Key Technologies:**
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: Expo Router (file-based routing)
- **Internationalization**: react-i18next
- **UI**: React Native with custom components

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database)
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce_fullstack_app
   ```

2. **Start the database**
   ```bash
   cd api_nest
   docker-compose up -d
   ```

3. **Setup and run the API**
   ```bash
   cd api_nest
   npm install
   npm run migration:run
   npm run seed:run
   npm run start:dev
   ```

4. **Setup and run the mobile app**
   ```bash
   cd app_rn
   npm install
   npm start
   ```

## 🔧 API (NestJS)

### Installation and Setup

1. **Navigate to API directory**
   ```bash
   cd api_nest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `api_nest` directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=ecommerce_db
   
   # Wompi Payment Gateway
   WOMPI_API_URL=https://sandbox.wompi.co/v1
   WOMPI_PUBLIC_KEY=your_public_key
   WOMPI_PRIVATE_KEY=your_private_key
   WOMPI_EVENTS_KEY=your_events_key
   WOMPI_INTEGRITY_KEY=your_integrity_key
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run migration:run
   ```

6. **Seed the database**
   ```bash
   npm run seed:run
   ```

### Running the API

- **Development mode** (with hot reload):
  ```bash
  npm run start:dev
  ```

- **Production mode**:
  ```bash
  npm run build
  npm run start:prod
  ```

- **Debug mode**:
  ```bash
  npm run start:debug
  ```

### API Endpoints

The API will be available at `http://localhost:3000/api`

- **Products**: `GET /api/products` - Get paginated products with filtering
- **Presigned URLs**: `GET /api/presigned` - Get presigned URLs for legal documents

### Database Management

- **Generate migration**:
  ```bash
  npm run migration:generate -- MigrationName
  ```

- **Run migrations**:
  ```bash
  npm run migration:run
  ```

- **Revert migration**:
  ```bash
  npm run migration:revert
  ```

- **Create seed**:
  ```bash
  npm run seed:create -- SeedName
  ```

## 📱 Mobile App (React Native + Expo)

### Installation and Setup

1. **Navigate to app directory**
   ```bash
   cd app_rn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration**
   
   Edit `app_rn/config/api.ts` to match your API URL:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'http://localhost:3000/api', // For iOS simulator
     // BASE_URL: 'http://10.0.2.2:3000/api', // For Android emulator
   };
   ```

### Running the App

- **Start Expo development server**:
  ```bash
  npm start
  ```

- **Run on Android**:
  ```bash
  npm run android
  ```

- **Run on iOS**:
  ```bash
  npm run ios
  ```

- **Run on Web**:
  ```bash
  npm run web
  ```

### Development Tips

- **QR Code**: Scan the QR code with Expo Go app on your device
- **Device Connection**: Ensure your device and development machine are on the same network
- **Hot Reload**: Changes are automatically reflected in the app

### Features

- **Product Catalog**: Browse products with filtering and pagination
- **Internationalization**: Support for English and Spanish
- **State Management**: Redux Toolkit Query for efficient data fetching
- **Navigation**: File-based routing with Expo Router

## 🗄️ Database Setup

The project uses PostgreSQL with Docker for easy setup:

1. **Start PostgreSQL container**:
   ```bash
   cd api_nest
   docker-compose up -d
   ```

2. **Verify database connection**:
   ```bash
   docker-compose logs postgres
   ```

3. **Access database directly** (optional):
   ```bash
   docker exec -it api_nest_postgres_1 psql -U postgres -d ecommerce_db
   ```

## 🧪 Testing

### API Testing

1. **Run unit tests**:
   ```bash
   cd api_nest
   npm run test
   ```

2. **Run tests in watch mode**:
   ```bash
   npm run test:watch
   ```

3. **Run tests with coverage**:
   ```bash
   npm run test:cov
   ```

4. **Run e2e tests**:
   ```bash
   npm run test:e2e
   ```

5. **Debug tests**:
   ```bash
   npm run test:debug
   ```

### Test Structure

- **Unit Tests**: Located alongside source files (`.spec.ts`)
- **E2E Tests**: Located in `test/` directory
- **Coverage Reports**: Generated in `coverage/` directory

### Mobile App Testing

Currently, the mobile app uses Expo's built-in development tools. To add testing:

```bash
cd app_rn
npm run lint  # ESLint checking
```

## ⚙️ Environment Configuration

### API Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_DATABASE` | Database name | `ecommerce_db` |
| `WOMPI_API_URL` | Wompi API URL | `https://sandbox.wompi.co/v1` |
| `WOMPI_PUBLIC_KEY` | Wompi public key | `pub_test_...` |
| `WOMPI_PRIVATE_KEY` | Wompi private key | `prv_test_...` |
| `WOMPI_EVENTS_KEY` | Wompi events key | `test_events_...` |
| `WOMPI_INTEGRITY_KEY` | Wompi integrity key | `test_integrity_...` |

### Mobile App Configuration

- **API Base URL**: Configure in `app_rn/config/api.ts`
- **App Configuration**: Modify `app_rn/app.json` for Expo settings
- **Internationalization**: Add translations in `app_rn/i18n/locales/`

## 📁 Project Structure

```
ecommerce_fullstack_app/
├── api_nest/                 # NestJS Backend API
│   ├── domain/              # Domain Layer (Business Logic)
│   │   ├── common/          # Shared domain utilities
│   │   ├── products/        # Product domain
│   │   ├── transaction/     # Transaction domain
│   │   ├── delivery/        # Delivery domain
│   │   └── presigned/       # Presigned URLs domain
│   ├── src/                 # Application Layer
│   │   ├── adapter/         # Adapters (Controllers, Handlers)
│   │   ├── config/          # Configuration files
│   │   ├── db/              # Database (migrations, seeds)
│   │   └── modules/         # NestJS modules
│   ├── test/                # E2E tests
│   ├── docker-compose.yml   # Database container
│   └── package.json         # Dependencies and scripts
├── app_rn/                  # React Native Mobile App
│   ├── app/                 # Expo Router pages
│   ├── components/          # Reusable components
│   ├── store/               # Redux store and APIs
│   ├── hooks/               # Custom React hooks
│   ├── i18n/                # Internationalization
│   ├── types/               # TypeScript type definitions
│   ├── config/              # App configuration
│   └── package.json         # Dependencies and scripts
└── README.md               # This file
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and architecture patterns
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeORM Documentation](https://typeorm.io/)
- [React Navigation Documentation](https://reactnavigation.org/)

