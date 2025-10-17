# Content Moderation System

## Overview

The Star System Sorter implements comprehensive content moderation across all user inputs to ensure safety and appropriate content.

## Moderation Points

### 1. Birth Data Input

**Fields to moderate:**
- Location (city/place name)
- Any free-text fields

**Rules:**
- No profanity or offensive language
- No personal attacks or hate speech
- No spam or promotional content
- Maximum length limits enforced

### 2. Profile/Settings

**Fields to moderate:**
- Display name (if implemented)
- Bio/description (if implemented)
- Any user-generated content

## Implementation

### Client-Side Validation

```typescript
// Basic profanity filter
const PROFANITY_PATTERNS = [
  // Add patterns here
];

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase();
  return PROFANITY_PATTERNS.some(pattern => 
    normalized.includes(pattern)
  );
}

export function moderateInput(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (containsProfanity(text)) {
    return {
      isValid: false,
      reason: 'Please use appropriate language',
    };
  }

  if (text.length > 100) {
    return {
      isValid: false,
      reason: 'Text is too long',
    };
  }

  return { isValid: true };
}
```

### Server-Side Validation

For production, consider using a moderation API:

```typescript
// Example with OpenAI Moderation API
async function moderateContent(text: string): Promise<boolean> {
  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input: text }),
  });

  const data = await response.json();
  return !data.results[0].flagged;
}
```

## Best Practices

1. **Client-side first**: Validate on client for immediate feedback
2. **Server-side enforcement**: Always validate on server as final check
3. **User-friendly messages**: Don't be overly specific about what triggered moderation
4. **Logging**: Log moderation events for review (without storing PII)
5. **Rate limiting**: Prevent abuse through rate limiting

## Privacy Considerations

- Never log birth data or personal information
- Hash user identifiers in any metrics
- Comply with GDPR/CCPA requirements
- Provide clear privacy policy

## Legal Disclaimer

Always include this disclaimer:

> "For insight & entertainment. Not medical, financial, or legal advice."
