# Figma Screens Reference

## All 19 Screens Available

All screen implementations are in `/Figma/App.tsx` and screenshots are in `/Figma/Screnshots/`

### Core Flows (Screens 1-9) - MVP + Phase 2

#### MVP Screens (Tasks 8-11)
1. **onboarding** - 01_Onboarding
   - Welcome screen with S³ logo
   - 3-step explainer (Input → Sort → Narrative)
   - "Begin Sorting" CTA
   - Starfield background
   - Screenshot: `screen-1-2-3.png`

2. **input** - 02_Input_BirthData
   - Tabs: Birth Data | Upload Chart PDF
   - Fields: Date (Calendar icon), Time (Clock icon), Location (MapPin icon)
   - "Compute Chart" CTA
   - Back navigation
   - Screenshot: `screen-1-2-3.png`

3. **result** - 03_Sort_Result (Home)
   - "Your Primary Star System" header
   - Large star system crest
   - Radial percentage chart (62%)
   - Ally chips (Sirius 18%, Lyra 12%, Andromeda 8%)
   - "View Why" button
   - "Generate Narrative" button (→ Paywall)
   - Disclaimer: "For insight & entertainment..."
   - TabBar navigation
   - Screenshot: `screen-1-2-3.png`

4. **why** - 04_Why_This_Result
   - Header: "Why Pleiades"
   - Contributors list with weights:
     - Sacral Authority +22%
     - Channel 13-33 +18%
     - Profile 1/3 +12%
     - Defined Throat +10%
   - Icons and gradient backgrounds
   - Back navigation
   - Screenshot: `screen-4-5-6.png`

#### Phase 2 Screens
5. **community** - 05_Community_StarSystem
   - Star system crest header
   - Tabs: Feed / Quests / Members
   - Community posts with Like/Reply
   - Quest cards
   - TabBar navigation
   - Screenshot: `screen-4-5-6.png`

6. **profile** - 06_Profile_And_Avatar
   - Avatar placeholder
   - User type display (Manifesting Generator • 1/3)
   - Star system profile cards (Primary + Allies)
   - "Generate Avatar" CTA
   - Settings icon → Settings screen
   - TabBar navigation
   - Screenshot: `screen-4-5-6.png`

7. **paywall** - 07_Subscription_Paywall
   - "Join the Community" header
   - Feature list (Narrative, Community, Avatar, Early Access)
   - Pricing card ($9.99/month)
   - "Start Subscription" CTA
   - "Maybe Later" secondary action
   - Close → returns to Result
   - Screenshot: `screen-7-8-9.png`

8. **settings** - 08_Settings_Privacy
   - Privacy notice (inline alert)
   - Data & Privacy settings
   - Notification preferences
   - Display preferences
   - Account actions (Sign Out, Delete Account)
   - Legal links (Terms, Privacy Policy)
   - Back navigation
   - Screenshot: `screen-7-8-9.png`

9. **emptyStates** - 09_EmptyStates_And_Errors
   - Empty state examples (No Chart, No Posts)
   - Error states (Network, Invalid Data)
   - Inline alerts (all 4 types)
   - Disclaimer example
   - Back navigation
   - Screenshot: `screen-7-8-9.png`

### Game Layer (Screens 10-19) - Phase 2

10. **gameHub** - 10_Game_Hub
    - Game mode cards (Survivor, Runner)
    - "Play Now" CTAs
    - Leaderboard preview
    - Quest pass preview
    - Screenshot: `screen-10-11-12.png`

11. **teamSelect** - 11_Team_Select
    - 6 star system team badges
    - Team selection interface
    - "Confirm Team" CTA
    - Screenshot: `screen-10-11-12.png`

12. **modeSelect** - 12_Mode_Select
    - Survivor mode card
    - Runner mode card
    - Mode descriptions
    - "Select Mode" CTA
    - Screenshot: `screen-10-11-12.png`

13. **lobby** - 13_Lobby_Matchmaking
    - Party members display
    - Team composition
    - "Ready" status indicators
    - Matchmaking timer
    - Screenshot: `screen-13-14-15.png`

14. **hudSurvivor** - 14_HUD_Survivor
    - HP hearts display
    - XP bar
    - Distance meter
    - Timer
    - Joystick control
    - Pause button
    - Screenshot: `screen-13-14-15.png`

15. **hudRunner** - 15_HUD_Runner
    - Similar to Survivor HUD
    - Runner-specific metrics
    - Different color scheme
    - Screenshot: `screen-13-14-15.png`

16. **matchResult** - 16_Match_Result
    - Victory/Defeat display
    - XP gained
    - Rewards earned
    - Player stats
    - "Play Again" CTA
    - Screenshot: `screen-16-17-18.png`

17. **leaderboard** - 17_Leaderboard_Season
    - Season rankings
    - Player positions
    - Team badges
    - XP/Score display
    - Screenshot: `screen-16-17-18.png`

18. **musicTheme** - 18_Music_Theme
    - Music theme selection
    - Theme previews
    - "Apply Theme" CTA
    - Screenshot: `screen-16-17-18.png`

19. **questsPass** - 19_Quests_Pass
    - Quest list
    - Progress bars
    - Rewards display
    - "Claim Reward" CTAs
    - Screenshot: `screen-19-20-21.png`

## Implementation Priority

### MVP (Current Sprint)
- ✅ Task 8: OnboardingScreen (screen 1)
- ✅ Task 9: InputScreen (screen 2)
- ✅ Task 10: ResultScreen (screen 3)
- ✅ Task 11: WhyScreen (screen 4)

### Phase 2 (Future)
- Screens 5-9: Community, Profile, Paywall, Settings, EmptyStates
- Screens 10-19: Game Layer (all game-related screens)

## How to Use

1. **Reference Implementation**: Open `/Figma/App.tsx` and search for the screen name (e.g., `currentScreen === 'onboarding'`)
2. **Visual Reference**: Open corresponding screenshot from `/Figma/Screnshots/`
3. **Copy Layout**: Use the JSX structure as a 1:1 reference
4. **Import Components**: Use components from `@/components/figma`
5. **Wire Up Data**: Connect to stores, hooks, and navigation

## Screen Type Definitions

```typescript
type Screen = 
  | 'onboarding'      // 01
  | 'input'           // 02
  | 'result'          // 03
  | 'why'             // 04
  | 'community'       // 05
  | 'profile'         // 06
  | 'paywall'         // 07
  | 'settings'        // 08
  | 'emptyStates'     // 09
  | 'gameHub'         // 10
  | 'teamSelect'      // 11
  | 'modeSelect'      // 12
  | 'lobby'           // 13
  | 'hudSurvivor'     // 14
  | 'hudRunner'       // 15
  | 'matchResult'     // 16
  | 'leaderboard'     // 17
  | 'musicTheme'      // 18
  | 'questsPass';     // 19
```

## Notes

- All screens use the same design system (CSS variables from `src/index.css`)
- All screens use components from `src/components/figma/`
- Starfield background is a common pattern across screens
- TabBar appears on screens 3, 5, 6 (Home, Community, Profile)
- Game screens (10-19) are Phase 2 and not needed for MVP
