# AstroPulse - Destiny

## Current State
Brand name "Astroplam-Desstiny" displayed in Header, HeroSection, and Footer without any author attribution.

## Requested Changes (Diff)

### Add
- "by Viku Kharb" subtitle displayed beneath the brand name "Astroplam-Desstiny" in the Header, HeroSection, and Footer.

### Modify
- Header: Brand name block now includes a second line "by Viku Kharb" in italic, smaller font below the main brand name.
- HeroSection: Brand name heading now has "by Viku Kharb" displayed as a subtitle just below the h1 tag, centered.
- Footer: Brand column now shows "by Viku Kharb" in small italic text below "-Desstiny".

### Remove
- Nothing removed.

## Implementation Plan
1. Update Header.tsx — wrap brand name in a div, add a second line for "by Viku Kharb".
2. Update HeroSection.tsx — wrap h1 in a div, add a paragraph below for "by Viku Kharb".
3. Update Footer.tsx — add "by Viku Kharb" line below "-Desstiny" in the brand column.
