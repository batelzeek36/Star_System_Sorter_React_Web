# Legal & Compliance Guidelines

## Terminology

### Required Terms

- **"Star System"** - Always use this term for classification systems
- **"Star System Sorter"** or **"S³"** - Official app name

### Forbidden Terms

- ❌ "House" - Never use this term
- ❌ Any Harry Potter references or terminology

## Legal Disclaimer

**REQUIRED**: Display this disclaimer prominently in the app:

> "For insight & entertainment. Not medical, financial, or legal advice."

**Placement:**
- Footer of every screen
- About/Settings page
- First-time user onboarding

## Privacy & Data Handling

### Birth Data

- **Never log birth data** in analytics or error tracking
- **Never store birth data** on servers (client-side only)
- **Hash user identifiers** in any metrics or logs
- **Clear cache** when user requests data deletion

### User Privacy

- Comply with GDPR (EU users)
- Comply with CCPA (California users)
- Provide clear privacy policy
- Allow users to delete their data
- No tracking without consent

### Example Privacy Policy Sections

```markdown
## Data We Collect

- Birth date, time, and location (stored locally on your device only)
- Usage analytics (anonymized)
- Error logs (no personal information)

## Data We Don't Collect

- We do NOT store your birth data on our servers
- We do NOT sell your data to third parties
- We do NOT track you across other websites

## Your Rights

- Request data deletion (clears local cache)
- Opt out of analytics
- Export your data
```

## Third-Party Attributions

### BodyGraph API

Include in your About/Attributions page:

```markdown
## Third-Party Services

### BodyGraph Chart API
Human Design chart data provided by BodyGraph Chart API.
https://bodygraphchart.com/

### Other Attributions
[List any other third-party services, libraries, or assets]
```

## Content Moderation

### User Input Validation

All user inputs must be moderated:

- Location names
- Any free-text fields
- Profile information (if implemented)

### Moderation Rules

- No profanity or offensive language
- No personal attacks or hate speech
- No spam or promotional content
- Maximum length limits enforced

## Intellectual Property

### Star System Definitions

- Star system definitions are original work
- Canon data is proprietary
- Do not share canon data publicly

### Design Assets

- Ensure all design assets are properly licensed
- Credit designers and illustrators
- Include attribution for any third-party assets

## Age Restrictions

Consider age restrictions based on your jurisdiction:

- **13+** (COPPA compliance in US)
- **16+** (GDPR compliance in EU)

Display age restriction in app store listings.

## Terms of Service

Include a Terms of Service that covers:

1. **Acceptance of Terms**
2. **Use License** (personal, non-commercial use)
3. **Disclaimer** (entertainment purposes only)
4. **Limitations** (no medical/financial/legal advice)
5. **Intellectual Property** (your rights to content)
6. **User Conduct** (acceptable use policy)
7. **Termination** (right to terminate accounts)
8. **Governing Law** (jurisdiction)

## Compliance Checklist

- [ ] Display legal disclaimer on all screens
- [ ] Use "star system" terminology (never "house")
- [ ] Implement privacy policy
- [ ] Implement terms of service
- [ ] Add third-party attributions
- [ ] Implement content moderation
- [ ] Hash user identifiers in logs
- [ ] Never log birth data
- [ ] Comply with GDPR/CCPA
- [ ] Set age restrictions
- [ ] Obtain proper licenses for all assets

## Contact Information

Provide contact information for:
- Privacy inquiries
- Data deletion requests
- Legal questions
- Support issues

Example:

```
Privacy Contact: privacy@yourdomain.com
Support: support@yourdomain.com
Legal: legal@yourdomain.com
```

## Regular Reviews

- Review compliance quarterly
- Update privacy policy as needed
- Monitor regulatory changes
- Audit data handling practices
