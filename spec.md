# AstroPulse - Destiny

## Current State
Full-stack astrology website with Courses, Special Unique Service, Services, Blog, and Admin Dashboard. The Admin Dashboard has an Inquiries tab that lists all visitor inquiry submissions with full details (name, email, DOB/TOB, place of birth, question/notes, images). Currently there is no way for the admin to delete individual inquiries.

## Requested Changes (Diff)

### Add
- `deleteInquiry(id: Nat)` backend function — admin-only, permanently removes an inquiry by ID from the `inquiries` map
- Delete button on each inquiry row in the Admin Dashboard (both desktop table and mobile cards)
- Confirmation dialog before deletion — "Are you sure you want to delete this inquiry?" with Confirm and Cancel buttons
- Optimistic UI update: remove the inquiry from the local list immediately on confirmation, with a loading state on the button

### Modify
- `InquiriesTab.tsx` — add delete button + confirmation dialog UI, wire to `deleteInquiry` backend call, refresh inquiry list after deletion
- `useQueries` hooks — add `useDeleteInquiry` mutation hook

### Remove
- Nothing removed

## Implementation Plan
1. Add `deleteInquiry(id: Nat)` to `main.mo` — admin-only, calls `inquiries.remove(id)`
2. Add `useDeleteInquiry` mutation hook in the frontend hooks file
3. In `InquiriesTab.tsx`:
   - Add a Trash/Delete icon button at the end of each desktop table row and each mobile card
   - On click, show an inline or modal confirmation dialog with "Are you sure?" + Confirm/Cancel buttons
   - On Confirm: call `deleteInquiry`, remove inquiry from local state, show success toast
   - On Cancel: dismiss dialog, no action
