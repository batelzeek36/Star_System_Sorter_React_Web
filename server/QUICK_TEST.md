# Quick Test Guide for /api/hd Endpoint

## Prerequisites
1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. (Optional) Add API key to test with real BodyGraph API:
   ```bash
   echo "BODYGRAPH_API_KEY=your_key_here" > server/.env
   ```

## Test Commands

### 1. Test Valid Request
```bash
curl -X POST http://localhost:3000/api/hd \
  -H "Content-Type: application/json" \
  -d '{"dateISO":"1992-10-03","time":"14:30","timeZone":"America/New_York"}' \
  | jq .
```

**Expected (without API key):**
```json
{
  "error": "Server configuration error"
}
```

**Expected (with valid API key):**
```json
{
  "type": "Manifestor",
  "authority": "Emotional",
  "profile": "3/5",
  "centers": ["Throat", "Solar Plexus", "Root"],
  "channels": [12, 22, 35],
  "gates": [1, 2, 3, 13, 25, 51]
}
```

### 2. Test Cache (Make Same Request Twice)
```bash
# First request (cache miss - calls API)
time curl -s -X POST http://localhost:3000/api/hd \
  -H "Content-Type: application/json" \
  -d '{"dateISO":"1992-10-03","time":"14:30","timeZone":"America/New_York"}' \
  > /dev/null

# Second request (cache hit - instant)
time curl -s -X POST http://localhost:3000/api/hd \
  -H "Content-Type: application/json" \
  -d '{"dateISO":"1992-10-03","time":"14:30","timeZone":"America/New_York"}' \
  > /dev/null
```

Check server logs for:
- `[API Call] Fetching HD data from BodyGraph API` (first request)
- `[Cache Hit] Returning cached HD data` (second request)

### 3. Test Rate Limiting
```bash
# Make 101 requests quickly
for i in {1..101}; do
  curl -s -X POST http://localhost:3000/api/hd \
    -H "Content-Type: application/json" \
    -d '{"dateISO":"1992-10-03","time":"14:30","timeZone":"America/New_York"}' \
    > /dev/null
done

# This request should return 429
curl -X POST http://localhost:3000/api/hd \
  -H "Content-Type: application/json" \
  -d '{"dateISO":"1992-10-03","time":"14:30","timeZone":"America/New_York"}'
```

**Expected:**
```
Too many requests from this IP, please try again later.
```
HTTP Status: 429

### 4. Test Validation
```bash
# Invalid date format
curl -X POST http://localhost:3000/api/hd \
  -H "Content-Type: application/json" \
  -d '{"dateISO":"invalid","time":"14:30","timeZone":"America/New_York"}' \
  | jq .
```

**Expected:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Date must be in YYYY-MM-DD format",
      "path": ["dateISO"]
    }
  ]
}
```

## Verification Checklist

- [x] Response has type, authority, profile, centers, channels, gates
- [x] Cache works (second call is fast)
- [x] Cache key is hashed (no PII in logs/keys)
- [x] Rate limiting returns 429 after limit exceeded
- [x] Request validation rejects invalid data
- [x] Error handling for API failures
- [x] Committed and tagged as v1-backend

## Cache Key Privacy Verification

The cache key is generated using SHA-256 hash:

```typescript
// Input: dateISO|time|timeZone
// Example: "1992-10-03|14:30|America/New_York"

// Output (SHA-256 hash):
// "e7327498cb166edfa21b2b1bb864f21092e7e62895d877f344d57606d9df41e3"
```

✓ No PII is exposed in cache keys or logs
✓ Same input always produces same hash (cache consistency)
✓ Different inputs produce different hashes
