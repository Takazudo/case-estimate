#!/bin/bash
set -e

echo "======================================"
echo "🔧 Running complete pre-push checks"
echo "======================================"
echo

# Step 1: Run code quality checks
echo "✨ Running code quality checks..."
echo "  📝 Type checking..."
npm run typecheck
echo "  🔍 Linting..."
npm run lint
echo "  💅 Format checking..."
npm run format
echo "✅ Code quality checks passed"
echo

# Step 2: Run unit tests
echo "🧪 Running unit tests..."
npm run test:run
echo "✅ Unit tests passed"
echo

# Step 3: Build the project
echo "🔨 Building project..."
npm run build
echo "✅ Project built successfully"
echo

# Step 4: Build documentation
echo "📚 Building documentation..."
cd doc && npm run build && cd ..
echo "✅ Documentation built"
echo

# Step 5: Run smoke tests with production build
echo "🎭 Running smoke tests with production build..."
echo

# Use npx serve to serve the static build
npx serve out -p 3000 -s &
SERVER_PID=$!

# Wait for server
echo "⏳ Waiting for production server..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ Production server failed to start"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

echo "✅ Production server ready"
echo

# Run smoke tests with production config
echo "🎭 Running smoke tests..."
PORT=3000 npm run test:smoke:production

TEST_EXIT=$?

# Kill server
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null || true

if [ $TEST_EXIT -eq 0 ]; then
  echo
  echo "======================================"
  echo "✅ All pre-push checks passed!"
  echo "======================================"
  echo
  echo "You can now push your changes with confidence!"
  exit 0
else
  echo
  echo "======================================"
  echo "❌ Tests failed"
  echo "======================================"
  echo "Please fix the issues before pushing."
  exit 1
fi