# Specification

## Summary
**Goal:** Add a "Seed Number" field (range 1–249) to the One Question service booking form, store it in the backend, and display it in the Admin Dashboard inquiries view.

**Planned changes:**
- Add a labelled "Seed Number" numeric input (valid range: 1–249) to the One Question service booking form in `BookingForm.tsx`; no other service forms are affected
- Update the backend `Inquiry` data type in `main.mo` to include an optional `seedNumber` field and update `submitInquiry` to accept and persist it, with full backward compatibility
- Update `InquiriesTab.tsx` in the Admin Dashboard to display the Seed Number for One Question inquiries that include it

**User-visible outcome:** Users booking the One Question service can enter a seed number (1–249) which is submitted with their inquiry, and admins can see the seed number alongside other inquiry details in the Admin Dashboard.
