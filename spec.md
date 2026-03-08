# AstroPulse - Destiny (Matrimonial Section)

## Current State
The site has: Header, HeroSection, CoursesSection, SpecialUniqueServiceSection, ServicesSection, BlogSection, ComparisonTable, Footer, AdminDashboard.
The backend supports: Posts, Inquiries, Services, UserProfile, UserRole.
There is NO matrimonial section, no MatrimonialPage component, no matrimonial data types in the backend.

## Requested Changes (Diff)

### Add
- `MatrimonialProfile` data type in the backend with fields: name, age, email, dob, timeOfBirth, placeOfBirth (state/country/city), occupation, aboutSelf, photos (multiple ExternalBlob), isPaid (boolean, default false), createdAt
- Backend functions: `submitMatrimonialProfile`, `getAllMatrimonialProfiles`, `deleteMatrimonialProfile`, `setMatrimonialProfilePaid`, `sendInterest`, `acceptInterest`, `getMyInterests`
- `MatrimonialPage` component (dedicated full page view)
- `MatrimonialBanner` component shown on the homepage between HeroSection and CoursesSection
- "Marriage" nav link in Header (desktop + mobile) that navigates to the matrimonial page
- Marriage page features:
  - "Create My Profile" button opens a form modal with: name, age, email, DOB, time of birth, place of birth (state/country/city), occupation, about self, multiple photo uploads (up to 6)
  - Browse profiles (cards) showing: for basic/unpaid profiles — name, age, occupation, about self only; for paid profiles — all details + photos
  - "Send Interest" button on each profile card
  - If interest is mutually accepted, both parties see each other's email to connect
- Admin Dashboard: new "Matrimonial" tab showing all profiles, toggle paid/unpaid status, delete profile option

### Modify
- `App.tsx`: add state for showing MatrimonialPage, add `MatrimonialBanner` in homepage, conditionally render MatrimonialPage
- `Header.tsx`: add "Marriage" nav link that calls `onMarriageClick`
- `AdminDashboard.tsx`: add "Matrimonial" tab

### Remove
- Nothing removed

## Implementation Plan
1. Add MatrimonialProfile, Interest types and related backend functions to Motoko
2. Create MatrimonialPage.tsx with profile browse, create profile modal, send/accept interest
3. Create MatrimonialBanner.tsx for the homepage
4. Update Header.tsx to add Marriage nav link
5. Update App.tsx to wire MatrimonialPage and MatrimonialBanner
6. Update AdminDashboard.tsx to add Matrimonial tab with paid toggle and delete
