#!/bin/bash
set -e

echo "======================================"
echo "⚡ Running quick pre-push checks"
echo "======================================"
echo

# Step 1: Run code quality checks
echo "✨ Running code quality checks..."
npm run check
echo "✅ Code quality checks passed"
echo

# Step 2: Run unit tests
echo "🧪 Running unit tests..."
npm run test:run
echo "✅ Unit tests passed"
echo

# Step 3: Build check (without actually serving)
echo "🔨 Testing build..."
npm run build
echo "✅ Build succeeded"
echo

echo "======================================"
echo "✅ Quick checks passed!"
echo "======================================"
echo "Run 'npm run b4push:full' for complete tests"