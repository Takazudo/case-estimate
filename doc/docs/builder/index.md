---
title: Case Builder
description: Introduction to the Case Builder application
sidebar_position: 1
---

# Case Builder Introduction

The **Case Builder** is an interactive web application for customizing Takazudo Modular synthesizer cases. This tool allows users to visually configure their ideal case and see real-time pricing.

## What Can You Do?

The Case Builder provides:

- **Model Selection** - Choose from various case models (Zudo Block 40/60, 10BOX preset)
- **Panel Customization** - Select colors for each panel with an interactive SVG diagram
- **Rail Options** - Choose between Lite, Dual, and Metal rail types
- **Price Estimation** - See real-time pricing as you configure
- **URL Sharing** - Share your configuration via URL parameters

## Application URL

Access the Case Builder at:

**Production:** https://panels.takazudomodular.com/
**Development:** http://localhost:3200

## Tech Stack

Built with modern web technologies:

- **React 19** with Vite - Fast, modern development
- **TypeScript** - Type-safe code
- **Tailwind CSS 4** - Utility-first styling
- **SVG Components** - Interactive visualizations

## Available Models

### Zudo Block Series

- **zudo-block-40** - Compact 40HP case (Acrylic & 3D Printed variants)
- **zudo-block-60** - Extended 60HP case (Acrylic & 3D Printed variants)
- **zudo-block-40x2** - Dual 40HP configuration (80HP)
- **zudo-block-60x2** - Dual 60HP configuration (120HP)

### Open Frame Series

- **zudo-block-60-open** - Open frame 60HP case (Acrylic & 3D Printed variants)
- **zudo-block-60-open-upgrade** - Open frame with additional panels

### 10BOX Series

- **10BOX Shallow 3DP** - 104HP shallow 3D printed case
- **10BOX Deep 3DP** - 104HP deep 3D printed case

### Zudo Stand Series

- **zudo-stand-40** - 40HP case stand (3D printed)
- **zudo-stand-40x2** - 80HP case stand (3D printed)
- **zudo-stand-60** - 60HP case stand (3D printed)
- **zudo-stand-60x2** - 120HP case stand (3D printed)

## Development Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:smoke

# Build for production
npm run build
```

## Project Structure

```
case-estimate/
├── src/
│   ├── app.tsx              # Main application
│   ├── components/          # React components
│   ├── data/               # Case & color configurations
│   ├── types/              # TypeScript definitions
│   └── utils/              # Utility functions
├── public/
│   └── svg/                # Case SVG diagrams
└── __inbox/                # Developer notes
```

## Documentation

Explore the sidebar for:

- [Adding New Case Models](/builder/add-new-case-model-guide) - Complete implementation guide
- [URL Format Specification](/builder/url-format-specification) - Technical details on URL encoding system

## Development Tools

The project uses:

- **ESLint** - Code quality checks
- **Prettier** - Code formatting
- **Playwright** - E2E testing
- **TypeScript** - Static type checking
- **GitHub Actions** - CI/CD automation

---

For detailed technical documentation, see the guides in the sidebar.
