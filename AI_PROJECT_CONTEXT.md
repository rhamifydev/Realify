# Project Specification — Nigerian Property Rental & Sale Platform

## 1. Project Overview

A trust-first real estate marketplace for the Nigerian market. Property Owners and Agents list houses, apartments, and land (with photo and video walkthroughs) for rent or sale. Tenants and Buyers browse, book inspections, and complete transactions entirely on-platform. The platform holds all payments in escrow and only releases funds once agreed milestones are met — the platform itself acts as the transactional agent, not just a listings board.

**Core problem being solved:** Nigerian real estate is plagued by fake listings, inspection-fee scams, duplicate/ghost listings, and no recourse when deals go wrong. This platform fixes that by verifying every party (Owner, Agent, Tenant/Buyer) before they can transact, and by never releasing money until the relevant stage of the deal is independently confirmed.

**Phasing:** Build rentals first (apartments), fully validate the trust/escrow model, then extend to property sales by reusing the same architecture (see Section 9).

**Tech stack:** Laravel (backend/API) + React (frontend), built with Antigravity + Gemini 3.1 Pro.

---

## 2. User Roles

| Role | Description |
|---|---|
| **Property Owner** | Owns a property, can list directly or assign an Agent to manage listing/leasing |
| **Agent** | Lists and manages properties on behalf of Owners under an approved mandate; builds a public reputation profile |
| **Tenant** (later: Buyer) | Browses listings, books inspections, pays into escrow, signs tenancy agreements |
| **Admin** | Verifies identities and documents, approves listings, resolves disputes, can manually override unit availability |

A single user account can potentially hold more than one role (e.g. an Owner who is also occasionally an Agent for a friend's property) — design the `users`/`roles` relationship as many-to-many rather than a single fixed field, to avoid painting into a corner later.

---

## 3. Registration & KYC Requirements

### All roles (baseline identity verification)
- Full legal name
- Phone number (OTP verified)
- Email (verified)
- NIN (National Identification Number)
- Government-issued ID (National ID, driver's license, voter's card, or passport) + selfie liveness match
- BVN (recommended, strengthens trust; required if direct bank payout is used)

### Property Owner (additional, per-property)
- Proof of ownership: Certificate of Occupancy (C of O), Deed of Assignment/Conveyance, Governor's Consent, Registered Survey Plan + purchase receipt, or Letter of Administration (inherited/family land)
- Utility bill or Land Use Charge receipt matching owner's name and property address (secondary verification)
- Property photos/video walkthrough
- Bank account details for payout (account name must match verified identity — mismatch triggers manual review)

### Agent (additional)
- CAC registration (RC number) if operating as a registered business
- If unregistered individual agent: verifiable track record or guarantor reference
- ESVARBON license if claimed (Estate Surveyors and Valuers Registration Board)
- State-level practitioner registration where applicable (e.g. LASRERA for Lagos)
- Per-property Owner mandate (see Section 5) — required before any listing under that Agent goes live
- Bank account details for payout

### Tenant (lighter KYC)
- Full name, phone, email (verified)
- NIN or government ID (fraud/no-show protection, not property trust)

### Admin verification workflow
- Registration-level review: cross-reference name-on-ID vs. name-on-bank-account vs. name-on-ownership-document
- Listing-level review: confirm ownership document matches the specific property; confirm photos/video are genuine, current, and not reused/stock images
- Mandate review: confirm Owner-Agent link before an Agent-managed listing goes live
- Ongoing fraud monitoring: flag repeat IDs across accounts, mismatched payout names, high dispute rates

---

## 4. Listings

### Listing types
- `sale`
- `rent`
- `sale_or_rent` (both — form collects both a sale price and a rent price; once a transaction progresses past inspection on one track, the other track is paused)

### Structure types
- `single_unit` — a standalone house/apartment
- `multi_unit` — one property containing multiple rentable units (e.g. a building with 20 rooms/flats)

### Multi-unit handling
- A `properties` record represents the building/parcel; `property_units` records represent each individually rentable unit.
- Even single-unit listings get exactly one auto-created `property_units` row internally, so escrow/transaction logic always references a `unit`, never a bare property — one code path for both cases.
- Availability is computed as `available units / total units` (e.g. "3 of 20 available").
- **Admin can manually change a unit's status** (available ↔ occupied) to reflect off-platform occupancy, with `updated_by` and `status_updated_at` logged for audit purposes — this must be clearly distinguishable from a status change caused by a real on-platform transaction.

### Staged listing creation (draft-first)
Listing creation is broken into stages, not a single form:
1. Basic info (title, address, description, listing type)
2. Media (photos, video)
3. Type-specific details (rent: price, deposit, agency fee / sale: price, title type, land size)
4. Ownership/legal documents
5. Review & submit

- Every stage auto-saves progress to the same `properties` row (`status = draft`), so an Owner/Agent who doesn't have all documents ready yet doesn't lose their work.
- A **"My Drafts"** view lists all draft listings with options to **Continue** (resume at `current_stage`) or **Delete**.
- **Draft lifecycle:** reminder notification at 3 days of inactivity, second reminder at 7 days, expiry warning at 13 days, soft-expire (status → `expired`, never hard-deleted) at 14 days of inactivity. Expired drafts can be reactivated at any time, resetting the lifecycle. See Section 8 for implementation detail already built.

---

## 5. Owner-Agent Mandates & Fee Splits

- A mandate is a relationship between **one Owner, one Agent, and one specific Property** — not a blanket relationship between an Owner and Agent. An Owner can work with multiple different Agents; an Agent can manage multiple properties, including several for the same Owner.
- **Fee split flow:** Owner proposes a percentage split for that specific property mandate → Agent must explicitly Approve or Reject it → if approved, the split is **locked for the duration of that mandate** (immutable without a fresh approval cycle) → listing can go live under that Agent.
- If the Agent doesn't approve (rejects or doesn't respond), the property listing stays inactive under that Agent (or reverts to Owner-managed) — no transaction can occur without an approved split.
- If a dispute arises after a transaction has occurred (e.g. Agent claims they didn't actually approve, or Owner claims the Agent didn't fulfill their role), the disputed funds are **frozen (not released to either party)** until Admin resolves it. Resolution should have a defined SLA (e.g. X business days) and a documented process.
- Platform's own facilitation fee is deducted before the Owner/Agent split and is non-negotiable between the two parties.
- These rules must be reflected in the platform's Terms & Conditions.

---

## 6. Agent Reputation System

Modeled after Fiverr/Upwork-style freelancer profiles, to incentivize Agents to complete deals on-platform rather than take them offline.

**Public Agent profile includes:**
- Verified badge (from KYC), CAC/ESVARBON/LASRERA badges where applicable
- Number of properties managed, number of completed tenancies
- Completion rate (mandates closed successfully vs. fell through/disputed)
- Response time (to mandate proposals and inspection requests)
- Ratings/reviews from Owners (and later Tenants) after a mandate closes
- Dispute rate (kept internal to Admin, can affect ranking without being publicly shown)

**Owner profiles** get a lighter equivalent: verified badge, number of properties successfully rented, response rate.

---

## 7. Escrow & Transaction Flow

### Core principle
No funds reach an Owner or Agent until the relevant milestone is independently confirmed by both parties (or Admin, in a dispute).

### Rent flow (MVP)
1. Tenant pays inspection fee → held in escrow
2. Inspection occurs → both Tenant and Owner/Agent confirm in-app → inspection fee released
3. Tenant proceeds → pays rent + caution deposit + agency fee into escrow
4. Tenancy agreement signed (ideally digitally, in-app) → funds released per the locked mandate split (rent to Owner, agency fee to Agent) → platform's facilitation fee deducted

### Sale flow (future phase — same architecture, more milestones)
Inspection → Offer accepted → Title verification → Deposit paid → Balance paid → Transfer confirmed → Full release. Each stage reuses the same escrow state machine as rent, just with more steps (`escrow_milestones` table, driven by `listing_type`).

### States
- `held` → `pending_release` → `released`
- `disputed` — a separate state only Admin can resolve, moving funds to either `released` (with a defined split/outcome) or `refunded`
- Full audit trail required on every state transition (this is highest-risk logic in the system — treat with the same rigor as PIN/wallet code: idempotency keys, pessimistic locking where relevant, complete logs)

---

## 8. Media & Storage

- **Provider:** S3-compatible storage (decision made to self-host media rather than route video through YouTube, prioritizing reliability — no dependency on a third party's moderation policies or account-ban risk).
- **Buckets:** separate by purpose — `property-photos`, `property-videos`, `kyc-documents`, `ownership-documents`.
- **KYC and ownership documents are always private** — signed URLs only, short expiry, accessible only to the uploader and Admin.
- **Draft/pending-review listing media** — private/signed URLs (not publicly guessable).
- **Live, approved listing media** — public or CDN-served.
- **Upload flow:** presigned direct-to-storage upload from the browser (do not proxy large files through the Laravel backend) → background job transcodes video (cap duration ~2–3 min, moderate bitrate, generate thumbnail) → `property_media` record created with `status: uploading/processing/ready/failed`.
- **Cost control:** CDN in front of storage to cache repeated views; lazy-load video (never autoplay/preload on browse pages); move media for `expired`/`rented`/`sold` listings to cold storage or delete per cleanup policy.
- **Cleanup:** deleting a draft or hard-cleaning an expired listing must also delete its associated storage files, not just the DB row (queued job on model deletion).

### Draft listing lifecycle (already specified, include as-is)
- Reminder 1: 3 days inactive
- Reminder 2: 7 days inactive
- Expiry warning: 13 days inactive
- Soft expiry (status → `expired`, not deleted): 14 days inactive
- Optional hard cleanup/archive: 60 days as `expired`
- Reactivation resets the lifecycle from scratch

---

## 9. Extending to Sales (Future Phase)

Treat `sale` as a second `listing_type` value that reuses the **entire existing schema** — roles, mandates, escrow, reviews — rather than forking the codebase. Additions only:
- Extra property fields (title type, land size, title verification status)
- Extra KYC tier for Buyers (heavier than Tenant KYC, given higher transaction value)
- Extra escrow milestones (see Section 7)
- Title verification as a first-class Admin/legal review step before a sale listing goes live (this is where most Nigerian property sale fraud occurs — fake titles, land under government acquisition, multiple sales of the same plot)

Large sum-of-money custody/regulatory handling for sale transactions is being worked out separately and is out of scope for the initial build documentation.

---

## 10. Explicitly Out of Scope for MVP (Do Not Build Yet)
- Property sales transactions (architecture should allow for it later, per Section 9, but initial build is rental-only)
- In-app messaging/chat between parties
- Native mobile app (web-first)
- Automated title verification via government registry APIs (manual Admin review for now)

---

## 11. Guiding Principles for Implementation
- **Trust and verification come before convenience** — every shortcut that skips KYC, mandate approval, or escrow confirmation reintroduces the exact fraud patterns this platform exists to eliminate.
- **One code path per concern, not per role/type** — e.g. single-unit and multi-unit properties both use `property_units`; rent and sale both use the same escrow/mandate/review tables. Avoid forking logic by listing type or role where a shared abstraction will do.
- **Every fund movement must be auditable** — who triggered it, when, and under what confirmed condition.
- **Design for the Nigerian context specifically** — mobile-first, data-conscious media handling, and document types/verification bodies relevant to Nigerian property law (C of O, Governor's Consent, LASRERA, CAC, NIN/BVN).