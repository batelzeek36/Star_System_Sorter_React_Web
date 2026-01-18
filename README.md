# Star System Sorter (S³)

> **⚠️ CRITICAL ISSUE:** The star system classification algorithm produces inaccurate results. See [CRITICAL_ISSUE.md](./CRITICAL_ISSUE.md) for details. The core problem: there is no authoritative source mapping HD gates to star systems, and AI-generated mappings are inconsistent. **Solution requires empirical data from verified charts.**

A React web application that provides deterministic star system classification based on Human Design birth chart data.

## 🌟 Overview

Star System Sorter retrieves Human Design data via the BodyGraph Chart API, applies a proprietary scoring algorithm, and presents users with their star system classification complete with visual crests and ally systems.

**Live Application**: [Deployed on Vercel]

## 🏗️ Project Structure

```
Star_System_Sorter_React_Web/
├── docs/                           # 📚 All project documentation
│   ├── deployment/                 # Deployment guides and logs
│   ├── features/                   # Feature implementation docs
│   ├── design/                     # Design briefs and specs
│   └── setup/                      # Setup and configuration guides
├── _archive/                       # 📦 Historical reference materials
│   └── ui-references/              # Archived Figma exports and UI iterations
├── .github/                        # GitHub workflows and actions
├── .husky/                         # Git hooks
├── .kiro/                          # Kiro IDE configuration
│   ├── settings/                   # IDE settings
│   ├── specs/                      # Project specifications
│   └── steering/                   # AI assistant guidelines
├── migration-package/              # React Native → Web migration reference
├── server/                         # Express API proxy server
│   ├── src/
│   │   ├── routes/                 # API routes
│   │   └── index.ts                # Server entry point
│   └── package.json
└── star-system-sorter/             # Main React application
    ├── src/
    │   ├── screens/                # Application screens
    │   ├── components/             # React components
    │   │   ├── figma/              # Figma design system components
    │   │   ├── lore/               # Lore/evidence components
    │   │   └── ui/                 # Utility UI components
    │   ├── lib/                    # Core logic (schemas, scorer, canon)
    │   ├── api/                    # API client
    │   ├── store/                  # Zustand state management
    │   ├── hooks/                  # Custom React hooks
    │   ├── data/                   # Static data files
    │   └── styles/                 # Styling and animations
    ├── tests/                      # Test files
    │   └── e2e/                    # Playwright E2E tests
    ├── public/                     # Static assets
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Star_System_Sorter_React_Web
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd star-system-sorter
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Server (.env in server/)
   cp server/.env.example server/.env
   # Add your BODYGRAPH_API_KEY

   # Client (.env in star-system-sorter/)
   cp star-system-sorter/.env.example star-system-sorter/.env
   # Add your VITE_GOOGLE_CLIENT_ID
   ```

4. **Run development servers**
   ```bash
   # Terminal 1: Vite dev server
   cd star-system-sorter
   npm run dev  # http://localhost:5173

   # Terminal 2: Express API server
   cd server
   npm run dev  # http://localhost:3000
   ```

## 📖 Documentation

Comprehensive documentation is available in the `/docs/` directory:

- **[Setup Guide](./docs/setup/OAUTH_QUICK_START.md)** - Get started with OAuth and API configuration
- **[Deployment Guide](./docs/deployment/VERCEL_DEPLOYMENT.md)** - Deploy to Vercel
- **[Feature Documentation](./docs/features/)** - Implementation details for all features
- **[Design Specs](./docs/design/)** - Design briefs and specifications
- **[MVP Validation Report](./docs/MVP_VALIDATION_REPORT.md)** - Testing and validation results

## 🧪 Testing

```bash
cd star-system-sorter

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🏗️ Tech Stack

### Client
- React 18+ with TypeScript
- Vite 5+ (build tool)
- Tailwind CSS 3+ (styling)
- React Router 6+ (routing)
- Zustand 4+ (state management)
- React Hook Form 7+ + Zod 3+ (forms & validation)

### Server
- Node.js 20+ with Express 4+
- TypeScript
- node-cache (30-day TTL)
- express-rate-limit (100 req/15min)

### Testing
- Vitest 3+ (unit tests)
- Playwright (E2E tests)
- React Testing Library

## 🔐 Security

- API keys stored server-side only
- No PII in logs or analytics
- HTTPS in production
- Rate limiting on API endpoints
- Input validation with Zod schemas
- CORS configuration
- Hashed cache keys

## 📝 Key Features

- ✅ Deterministic star system classification
- ✅ Google OAuth authentication
- ✅ User profiles with avatar generation
- ✅ Dossier/evidence matrix view
- ✅ Community screen (Phase 2)
- ✅ Responsive design
- ✅ Accessibility compliant
- ✅ 30-day caching for performance

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

[Add license information]

## 🙏 Acknowledgments

- BodyGraph Chart API for Human Design data
- Figma design system components
- React and Vite communities

---

For detailed documentation, see the [/docs/](./docs/) directory.
