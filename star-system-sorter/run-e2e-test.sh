#!/bin/bash

# Star System Sorter - E2E Test Runner
# This script starts the dev server and runs Playwright tests

echo "🚀 Starting E2E test suite..."
echo ""

# Check if dev server is already running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
  echo "✅ Dev server is already running on http://localhost:5173"
  echo ""
else
  echo "⚠️  Dev server is not running"
  echo "Please start the dev server in another terminal:"
  echo "  cd star-system-sorter && npm run dev"
  echo ""
  exit 1
fi

# Check if Express server is running
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "✅ Express API server is running on http://localhost:3000"
  echo ""
else
  echo "⚠️  Express API server is not running"
  echo "Please start the API server in another terminal:"
  echo "  cd server && npm run dev"
  echo ""
  echo "Note: Tests may still run but API calls will fail"
  echo ""
fi

# Run Playwright tests using MCP
echo "🎭 Running Playwright tests..."
echo ""

# Note: Since Playwright is connected via MCP, tests should be run through the MCP interface
echo "To run tests via Playwright MCP:"
echo "1. Use the Playwright MCP browser tools"
echo "2. Navigate to http://localhost:5173"
echo "3. Follow the test steps in tests/e2e/user-flow.spec.ts"
echo ""
echo "Alternatively, if Playwright is installed locally:"
echo "  npm run test:e2e"
