
# Next.js Enterprise Application

A production-ready template for building enterprise applications with Next.js.

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- Yarn package manager

### Installation

yarn install


### Development
Run the development server:

yarn dev


### Production
Build and start the production server:

yarn build
yarn start


### Testing

# Unit tests
yarn test

# E2E tests
yarn e2e:headless    # Headless mode
yarn e2e:ui          # With UI


### Code Quality

# Linting
yarn lint
yarn lint:fix

# Formatting
yarn prettier
yarn prettier:fix


### Storybook

yarn storybook         # Development
yarn build-storybook   # Build
yarn test-storybook   # Test


## Key Dependencies

### Core
- Next.js (14.2.3)
- React (18.3.1)
- TypeScript (5.4.5)

### UI Components
- @chakra-ui/react (3.1.2)
- @radix-ui/* - Various UI primitives
- Tailwind CSS (3.3.5)

### Development Tools
- ESLint (8.54.0)
- Prettier (3.0.3)
- Jest (29.7.0)
- Playwright for E2E testing
- Storybook (7.5.3)

### Monitoring & Analytics
- @vercel/otel - OpenTelemetry integration
- @next/bundle-analyzer - Bundle analysis

### Data Management
- Zod - Runtime type checking
- @tanstack/react-table - Table management

### Utilities
- lodash
- class-variance-authority
- tailwind-merge
- use-debounce

## Scripts Reference
- `dev`: Start development server
- `build`: Production build
- `start`: Start production server
- `lint`: Run ESLint
- `test`: Run Jest tests
- `e2e:headless`: Run Playwright tests headless
- `storybook`: Start Storybook development
- `analyze`: Analyze bundle size
- `format`: Format code with Prettier
- `coupling-graph`: Generate dependency graph

## Requirements
- Node.js >= 20.0.0
- Yarn 1.22.19 (required package manager)
