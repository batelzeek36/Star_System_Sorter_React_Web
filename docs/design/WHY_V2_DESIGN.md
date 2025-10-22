# Why Page V2 - Redesign Notes

## What Changed?

The new design focuses on **progressive disclosure** and **visual hierarchy** to make the information less overwhelming.

## Key Improvements

### 1. Hero Summary Card
- Big, bold percentage display at the top
- Quick stats grid showing counts (Gates, Channels, Centers)
- Gives users the "TL;DR" immediately

### 2. Top Contributors Section
- Shows only the top 3 most impactful contributors
- Ranked with #1, #2, #3 badges
- Users see what matters most without scrolling

### 3. Core Attributes
- Simplified display of Type, Profile, Authority
- Clean key-value pairs instead of cards
- Less visual noise

### 4. Collapsible Sections
- Gates, Channels, and Centers are collapsed by default
- Users can expand only what they're curious about
- Prevents information overload
- Each section shows the count badge

### 5. Better Visual Hierarchy
- Larger headings and clearer sections
- More whitespace between elements
- Consistent card styling
- Better use of color to guide attention

## Design Philosophy

**Before**: Show everything at once → overwhelming
**After**: Show the essentials, hide the details → scannable

Users can:
1. **Glance**: See their percentage and top contributors (5 seconds)
2. **Scan**: Review their core attributes (15 seconds)
3. **Explore**: Expand sections to dive deeper (as long as they want)

## How to Preview

1. Start the dev server: `npm run dev`
2. Complete the birth data form
3. On the result screen, click "View Why (New Design)"
4. Compare with "View Original" button

## Routes

- `/why` - Original design (current production)
- `/why-v2` - New design (experimental)

## Next Steps

If you like this direction:
- Add animations for expand/collapse
- Add search/filter within expanded sections
- Add tooltips for Human Design terms
- Consider adding a "Compare Systems" view
- Mobile optimization tweaks
