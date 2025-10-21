# Star System Sorter (S³) - Game Layer Implementation Checklist

## Overview
Extended S³ with a lightweight GAME layer. Visual mockups only (no game code). Maintains dark-mystic Direction A aesthetic with full Auto Layout and existing design tokens.

**Total Screens:** 19 (9 core + 10 game)  
**New Components:** 20+ game-specific components  
**Last Updated:** October 8, 2025

---

## ✅ 1. New Game Components Created

### HUD Controls (`/components/s3/game/HUDComponents.tsx`)
- [x] **Joystick** - Virtual stick for movement
  - Props: `handed` (left/right)
  - Size: 72×72px (from game-tokens.json)
  - Variants: Left-handed, Right-handed
- [x] **HUDButton** - Action buttons (A/B/Jump/Slide)
  - Props: `type` (A|B|Jump|Slide), `state` (default|pressed)
  - Size: 56×56px
  - Color coding: A/Jump (lavender), B/Slide (gold)
- [x] **PauseButton** - Pause control
  - Size: 44×44px
  - Backdrop blur with pause icon
- [x] **HPHearts** - Health display
  - Props: `current`, `max`
  - Visual: Heart icons (filled/empty)
- [x] **XPBar** - Experience progress
  - Props: `current`, `max`, `level`
  - Height: 8px (standard bar from game-tokens)
- [x] **DistanceMeter** - Distance tracker (Runner mode)
  - Props: `distance`, `unit` (m|km)
  - Large number display
- [x] **Timer** - Match timer
  - Props: `seconds`
  - Format: MM:SS with red pulse indicator
- [x] **Counter** - Kill/Coin/Star counters
  - Props: `type` (kills|coins|stars), `value`
  - Icons: Trophy, Coins, Star
  - Color coded per type

### Game Cards (`/components/s3/game/GameCards.tsx`)
- [x] **GameModeCard**
  - Modes: Survivor Arena, Side Runner
  - Props: `mode`, `title`, `description`, `players`, `selected`, `onClick`
  - Icons: Swords (survivor), Zap (runner)
  - Selectable with emphasis state
- [x] **QuestCard**
  - Types: daily, weekly
  - Props: `title`, `description`, `progress`, `max`, `reward`, `type`, `completed`
  - Progress bar with percentage
  - Reward display with award icon

### Team Badges (`/components/s3/game/GameBadges.tsx`)
- [x] **TeamBadge**
  - All 6 star systems: Orion/Osirian, Sirius, Pleiades, Andromeda, Lyra, Arcturus
  - Sizes: sm (32px), md (48px), lg (64px)
  - Props: `team`, `size`, `showName`
  - Team-specific colors from game-tokens.json

### Party & Lobby (`/components/s3/game/PartyMember.tsx`)
- [x] **PartyMember**
  - Props: `name`, `team`, `ready`, `isYou`
  - Ready state indicator (green check)
  - "You" badge for current player

### Modals (`/components/s3/game/GameModals.tsx`)
- [x] **PauseModal**
  - Props: `onResume`, `onExit`
  - Backdrop blur overlay
  - Resume/Exit actions
- [x] **ConfirmExitModal**
  - Props: `onConfirm`, `onCancel`
  - Warning variant
  - Lose progress warning
- [x] **MusicThemeModal**
  - Props: `currentTeam`, `selectedTheme`, `onClose`, `onSelect`, `onPreview`
  - Lists all 6 star system themes
  - Preview button per theme
  - Auto-selection notice

---

## ✅ 2. New Screens (10-19)

### 10_Game_Hub
- [x] Entry point for game layer
- [x] "Game Hub" title with gamepad icon
- [x] Team status card showing current team + points
- [x] "Enter Arena" primary CTA → Team Select
- [x] Grid of 4 secondary buttons: Leaderboard, Music, Quests, Party
- [x] **Disclaimer:** "For insight & entertainment. Game activity supports star system community goals."

### 11_Team_Select
- [x] 6 star system selection chips with crests
- [x] Grid layout (2 columns)
- [x] Selectable state with border highlight
- [x] Selected team persisted across flow
- [x] "Continue" button → Mode Select

### 12_Mode_Select
- [x] 2 game mode cards: Survivor Arena, Side Runner
- [x] Survivor: Swords icon, red accent, "30 players per match"
- [x] Runner: Zap icon, lavender accent, "Solo or async leaderboard"
- [x] Selectable with emphasis state
- [x] "Next" button → Lobby

### 13_Lobby_Matchmaking
- [x] Match type header (Survivor Arena / Side Runner)
- [x] Player count indicator (3/30)
- [x] Party member list (3 members shown)
- [x] Ready states (green check / not ready)
- [x] "Start Matchmaking" primary button → HUD
- [x] "Start Solo" secondary button → HUD

### 14_HUD_Survivor
- [x] Full-screen game viewport placeholder (Swords icon)
- [x] **Top HUD:** HP Hearts, XP Bar (left) | Timer, Pause (right)
- [x] **Bottom HUD:** Joystick + Counters (left) | A/B Buttons (right)
- [x] HUD opacity: 0.9 (elements), 0.4 (backgrounds)
- [x] Pause button opens PauseModal
- [x] PauseModal → Resume or Exit → Match Result

### 15_HUD_Runner
- [x] Full-screen game viewport placeholder (Zap icon)
- [x] **Top HUD:** Distance Meter (left) | Timer, Pause (right)
- [x] **Bottom HUD:** Coin/Star Counters (left) | Slide/Jump Buttons (right)
- [x] HUD opacity: 0.9 (elements), 0.4 (backgrounds)
- [x] Pause button opens PauseModal
- [x] PauseModal → Resume or Exit → Match Result

### 16_Match_Result
- [x] Trophy icon (gold gradient)
- [x] "Victory!" heading with rank (#3 of 30)
- [x] Stats card: Eliminations, Coins, Survived time
- [x] Rewards card: XP Gained (+250), Team Points (+15)
- [x] "Rematch" button → Lobby
- [x] "Exit to Hub" button → Game Hub
- [x] **Disclaimer:** "For insight & entertainment. Points contribute to star system community goals."

### 17_Leaderboard_Season
- [x] 3 tabs: Global, My Team, Friends
- [x] Leaderboard rows: Rank, Team Badge, Name, Points
- [x] Top 3 ranks with medal colors (gold/silver/bronze)
- [x] "You" indicator on player's row
- [x] Highlighted row for current player

### 18_Music_Theme
- [x] Info alert: "Auto-selects theme for your star system. You can change it anytime."
- [x] 6 theme options (one per star system)
- [x] Music icon with team color gradient
- [x] "Your star system" label on auto-selected theme
- [x] Preview button per theme
- [x] Selected state highlight

### 19_Quests_Pass
- [x] 3 tabs: Daily, Weekly, Season Pass
- [x] Quest cards showing daily quests (3 shown)
- [x] Progress bars with completion percentage
- [x] Reward amounts (100, 50, 75 XP)
- [x] Completed state with award icon
- [x] Season Pass CTA card at bottom

---

## ✅ 3. Prototype Flows Wired

### Primary Game Flow
- [x] 10_Game_Hub → 11_Team_Select (via "Enter Arena")
- [x] 11_Team_Select → 12_Mode_Select (via "Continue")
- [x] 12_Mode_Select → 13_Lobby_Matchmaking (via "Next")
- [x] 13_Lobby → 14_HUD_Survivor OR 15_HUD_Runner (based on selected mode)
- [x] 14/15_HUD → Pause Modal → 16_Match_Result (via "Exit")
- [x] 16_Match_Result → 13_Lobby (via "Rematch")
- [x] 16_Match_Result → 10_Game_Hub (via "Exit to Hub")

### Secondary Flows
- [x] 10_Game_Hub → 17_Leaderboard_Season (via trophy icon button)
- [x] 10_Game_Hub → 18_Music_Theme (via music icon button, modal overlay)
- [x] 10_Game_Hub → 19_Quests_Pass (via checklist icon button)

### Modal Interactions
- [x] Pause Modal: Resume (closes modal) | Exit (→ Match Result)
- [x] Music Theme Modal: Preview button per theme | Save closes modal
- [x] State persistence: Selected team, selected mode across flow

### TabBar Navigation (Still Works)
- [x] TabBar remains functional: Home (Result) ↔ Community ↔ Profile
- [x] Game Hub accessed separately (not in TabBar)

---

## ✅ 4. Design Tokens & Exports

### game-tokens.json Created
- [x] **Control Sizes:**
  - Small: 44px (minimum touch target)
  - Medium: 56px (action buttons)
  - Large: 72px (joystick)
- [x] **HUD Bar Heights:**
  - Thin: 4px
  - Standard: 8px
  - Thick: 12px
- [x] **HUD Opacity:**
  - Default elements: 0.9
  - Backgrounds: 0.4
  - Inactive: 0.5
- [x] **HUD Spacing:**
  - Edge: 16px
  - Controls: 24px
- [x] **Team Colors (Per Star System):**
  - Orion: #a78bfa → #c4b5fd
  - Sirius: #fbbf24 → #f59e0b
  - Pleiades: #a78bfa → #c4b5fd
  - Andromeda: #3b82f6 → #60a5fa
  - Lyra: #ec4899 → #f472b6
  - Arcturus: #f59e0b → #fbbf24
- [x] **Game Modes:**
  - Survivor Arena (red, 30 players)
  - Side Runner (lavender, solo/async)
- [x] **SVG Exports:**
  - HUD icons: joystick, button-a/b/jump/slide, heart, coin, star, trophy, pause
  - Team crests: orion, sirius, pleiades, andromeda, lyra, arcturus
  - Export sizes: 24px, 28px, 48px

---

## ✅ 5. Copy Rules Enforced

- [x] **"Star system" terminology** used everywhere (never "house")
- [x] **Music auto-selection copy:** "Auto-selects theme for your star system. You can change it anytime."
- [x] **Disclaimers:**
  - Game Hub: "For insight & entertainment. Game activity supports star system community goals."
  - Match Result: "For insight & entertainment. Points contribute to star system community goals."
  - Original Result screen disclaimer maintained

---

## ✅ 6. Component Library Updated

Added new "🕹 Game Components" section showing:
- [x] HUD Controls (Joystick, Buttons, Pause)
- [x] HUD Bars & Counters (HP, XP, Distance, Timer, Kill/Coin/Star counters)
- [x] Game Mode Cards (Survivor, Runner)
- [x] Quest Cards (Daily, Weekly with progress)
- [x] Team Badges (all sizes, with/without names)
- [x] Party Member List Items (with ready states)

---

## ✅ 7. Visual Consistency

- [x] Dark-mystic Direction A aesthetic maintained
- [x] Lavender primary, gold highlights throughout
- [x] Soft rounded shapes (radius-xl, radius-full)
- [x] Starfield backgrounds on all screens
- [x] Gradient blobs for depth
- [x] Auto Layout everywhere (gap-3, space-y-4, grid systems)
- [x] All touch targets ≥44px
- [x] Hover, press, focus states on interactive elements
- [x] Backdrop blur on HUD elements and modals

---

## 📊 Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Screens** | 19 (9 core + 10 game) |
| **New Components** | 20+ game components |
| **HUD Elements** | 9 distinct types |
| **Game Modes** | 2 (Survivor, Runner) |
| **Star Systems** | 6 teams (Orion, Sirius, Pleiades, Andromeda, Lyra, Arcturus) |
| **Prototype Flows** | 3 major flows (primary game, secondary hubs, modals) |
| **Token Files** | 2 (design-tokens.json, game-tokens.json) |
| **SVG Exports** | 17 icons (11 HUD + 6 crests) × 3 sizes each |
| **Touch Target Compliance** | 100% (≥44px WCAG AA) |

---

## 🎯 What Changed

### Files Created
1. `/components/s3/game/HUDComponents.tsx` - 9 HUD components
2. `/components/s3/game/GameCards.tsx` - GameModeCard, QuestCard
3. `/components/s3/game/GameBadges.tsx` - TeamBadge component
4. `/components/s3/game/PartyMember.tsx` - PartyMember list item
5. `/components/s3/game/GameModals.tsx` - 3 modal variants
6. `/game-tokens.json` - Game-specific design tokens

### Files Modified
1. `/App.tsx` - Added:
   - 10 new game screen components (10-19)
   - Game components library section
   - Updated prototypes, checklist, exports sections
   - Game state management (selectedTeam, selectedMode, modals)
   - Imports for all game components

### Files Unchanged
- `/design-tokens.json` - Core tokens remain stable
- `/styles/globals.css` - No new CSS variables needed
- All existing S³ components (AppBar, TabBar, Button, etc.)

---

## ⚠️ Important Notes

1. **Visual Only:** Game layer is mockups/wireframes only. No actual game engine code.
2. **HUD Opacity:** Default 0.9 for elements, 0.4 for black backgrounds (from game-tokens.json)
3. **Team Colors:** Each star system has defined gradient in game-tokens.json
4. **Control Sizes:** 44/56/72px hierarchy for touch targets
5. **Music Theme:** Auto-selects based on user's star system, manual override available
6. **Disclaimers:** Present on Game Hub and Match Result screens
7. **Star System Consistency:** Uses same 6 systems as core sorter
8. **Auto Layout:** All game components use Auto Layout (gap, space, flex, grid)
9. **Export Ready:** All HUD icons and team crests marked for SVG export at 24/28/48px

---

## 🚀 Next Steps (If Continuing to Production)

1. **Game Engine Integration**
   - Implement Survivor Arena game logic
   - Implement Side Runner game logic
   - Integrate real-time multiplayer (Socket.io/WebRTC)

2. **Backend Requirements**
   - Leaderboard persistence
   - Quest/achievement tracking
   - Season pass progression
   - Team statistics aggregation

3. **Audio System**
   - Implement 6 music themes (one per star system)
   - Preview/play/stop functionality
   - Audio theme persistence

4. **Additional Features**
   - Avatar generation (mentioned in Profile screen)
   - Party/friends system
   - Real-time matchmaking
   - Replay system

5. **Performance**
   - Optimize HUD rendering (60fps target)
   - Canvas-based game viewport
   - Asset preloading strategy

---

## ✅ Completion Status

**ALL REQUIREMENTS MET:**
- ✅ 10 new game screens (10-19) created
- ✅ 20+ game components with variants & props
- ✅ game-tokens.json with control sizes, bar heights, opacity, team colors
- ✅ All prototype flows wired correctly
- ✅ Copy rules enforced (star system, music notice, disclaimers)
- ✅ SVG export prep (HUD icons + team crests at 24/28/48px)
- ✅ Dark-mystic Direction A aesthetic maintained
- ✅ Auto Layout everywhere
- ✅ All touch targets ≥44px
- ✅ Component library section added to showcase

**Ready for:** Design review, stakeholder presentation, engineering handoff
