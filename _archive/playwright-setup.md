---
inclusion: always
---

# Playwright MCP Setup Notes

## IMPORTANT: Playwright Browser Installation

**Before using Playwright MCP for browser testing, ensure browsers are installed:**

```bash
npx playwright install chromium
```

## How Playwright MCP Works

- **MCP Server**: Runs locally via `npx @playwright/mcp@latest` (configured in mcp.json)
- **Localhost Access**: ✅ CAN access localhost URLs (http://localhost:5173, etc.)
- **Browser**: Uses installed chromium in headless mode
- **Common Error**: "Browser specified in your config is not installed"
  - **Solution**: Run `npx playwright install chromium`

## Testing Workflow

1. Start dev servers (Vite + Express)
2. Use `mcp_playwright_browser_navigate` to open localhost URL
3. Use `mcp_playwright_browser_click`, `mcp_playwright_browser_snapshot`, etc.
4. Take screenshots with `mcp_playwright_browser_take_screenshot`

## Current Project Setup

- **Vite Dev Server**: http://localhost:5173 (or 5174 if 5173 is in use)
- **Express API Server**: http://localhost:3000
- **Test Component**: TestSandbox at root URL for manual API testing

## Verified Working

- ✅ Playwright MCP can access localhost
- ✅ Browser automation works for testing
- ✅ Screenshots can be captured
- ✅ Console logs are visible
- ✅ Network requests can be monitored via console logs
