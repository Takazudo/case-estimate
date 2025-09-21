---
title: Welcome
description: Case Estimate Documentation
---

# Welcome to Case Estimate Documentation

This is the documentation site for the **Case Estimate** application - an interactive web tool for customizing Takazudo Modular synthesizer cases.

## About Case Estimate

Case Estimate is an interactive web application that allows users to:

- Select different case models (Zudo Block 40/60)
- Customize panel colors
- Choose rail types (Lite, Dual, Metal)
- See real-time price estimates
- Share configurations via URL

## Tech Stack

The application is built with:

- **Next.js 15** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **SVG Components** - Visual case representations

## Available Models

### Zudo Block Series

- **Zudo Block 40** - Compact 40HP case
  - ACR (Acrylic) version
  - 3DP (3D Printed) version
- **Zudo Block 60** - Extended 60HP case
  - ACR (Acrylic) version
  - 3DP (3D Printed) version
- **Zudo Block 40x2** - Dual 40HP configuration
- **Zudo Block 60x2** - Dual 60HP configuration

## Development

To run the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

## Testing

Run smoke tests:

```bash
npm run test:smoke
```

Run full test suite:

```bash
npm run test:e2e
```

## Project Structure

```
case-estimate/
├── app/              # Next.js app directory
├── components/       # React components
├── data/            # Configuration data
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── public/          # Static assets
    └── svg/         # Case SVG diagrams
```

## Contributing

This project uses:

- ESLint for code quality
- Prettier for code formatting
- Playwright for E2E testing
- Vitest for unit testing
- GitHub Actions for CI/CD

## Documentation

This documentation is built with Docusaurus and includes:

- Development notes
- API documentation
- Component guides
- Testing strategies

---

For more information, explore the documentation in the sidebar.
