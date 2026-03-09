# Astroplam-Desstiny

## Current State
The site has: Hero, Courses, Special Unique Service, Services, Blog, ComparisonTable sections. No numerology feature exists.

## Requested Changes (Diff)

### Add
- `VedicNumerologySection` component: a homepage promo section placed **before** the Courses section with a button to open the Vedic Numerology calculator app.
- `VedicNumerologyApp` component: a full-screen overlay/page with a Vedic Natal Chart calculator. Features:
  - DOB input (day, month, year)
  - **Natal Chart** (3x3 grid, fixed cell positions: top=3,1,9 / mid=6,7,5 / bottom=2,8,4)
  - Calculation rules:
    - Basic number = date reduced to single digit (non-zero; e.g., 05→5, 17→1+7=8)
    - Month digit placed directly (e.g., Feb=2)
    - Year: only last 2 digits, zeros ignored (e.g., 1998→9,8; 2001→1; 2000→nothing)
    - Destiny = sum all digits of full DOB (DD+MM+YYYY), reduce to single digit 1-9
    - If a number appears multiple times, show it repeated (e.g., 777)
    - Each number goes in its fixed cell position
  - **Dasa (45-year cycle)**:
    - Starting dasa = basic number
    - Duration in years = dasa number itself (5→5 years, 6→6 years, etc.)
    - Sequence: basic_num → basic_num+1 → ... → 9 → 1 → 2 → ... cycling until 45 years covered
    - If dasa number is in natal chart, show it doubled (e.g., 77) in white
    - If NOT in natal chart, show single number in white
    - Dasa numbers overlaid on same natal grid in white color
    - Year range displayed per dasa period
  - **Year Number** (shown in green on chart):
    - Formula: DD + MM + last 2 digits of year + day-of-week number for that birthday
    - Day numbers: Sun=1, Mon=2, Tue=9, Wed=5, Thu=3, Fri=6, Sat=8
    - Reduce to single digit 1-9
    - User can input a range of years (max 100 years)
    - Each year's chart shown separately below natal chart
    - Year number shown in green in the chart cells
  - Save chart functionality (name + DOB stored locally)
  - "New" and "Saved" tabs
- "Numerology" nav link in Header pointing to the numerology section

### Modify
- `App.tsx`: add `VedicNumerologySection` before `CoursesSection`
- `Header.tsx`: add "Numerology" nav link

### Remove
- Nothing removed

## Implementation Plan
1. Create `VedicNumerologySection.tsx` - promo banner with open button
2. Create `VedicNumerologyApp.tsx` - full calculator with natal chart, dasa overlay, year number charts, save/load
3. Update `App.tsx` to include numerology section and manage open state
4. Update `Header.tsx` to add Numerology nav link
