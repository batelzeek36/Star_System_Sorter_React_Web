# E2E Tests with Playwright

## Overview

This directory contains end-to-end tests for the Star System Sorter web application using Playwright.

## Prerequisites

Playwright is installed as a dev dependency (`@playwright/test@^1.56.1`) with chromium browser.

## Test Files

- `user-flow.spec.ts` - Main smoke test covering the happy path user flow

## Running Tests

### Via Command Line

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug
```

### Via Playwright MCP (Alternative)

You can also use the Playwright MCP browser tools to:
1. Navigate to `http://localhost:5173`
2. Interact with the application
3. Take screenshots

## Test Coverage

The smoke test (`user-flow.spec.ts`) covers:

1. **Onboarding Flow**
   - Navigate to home page
   - Click "Begin Sorting" button

2. **Form Input**
   - Fill date field (MM/DD/YYYY format)
   - Fill time field (HH:MM AM/PM format)
   - Fill location field
   - Select timezone
   - Submit form

3. **Result Display**
   - Wait for classification computation
   - Verify star system result is displayed
   - Verify percentage alignment is shown
   - Take screenshot for visual verification

## Test Data

The test uses the following sample data:
- Date: 10/03/1992
- Time: 12:03 AM
- Location: Attleboro, MA
- Timezone: America/New_York

## Screenshots

Test screenshots are saved to `previews/e2e-happy.png` for visual verification.

## Requirements Coverage

- **Requirement 12.3**: End-to-end user flow validation
- **Requirement 12.11**: Screenshot capture for visual regression testing
