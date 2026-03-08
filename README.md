# RomCon

RomCon is a romantic comedy novella planning app for building the setup layer of a book before drafting begins. It is designed for short, high-chemistry romance projects where the core value comes from strong leads, built-in tension, and a premise that can carry a clean 30,000-word arc without collapsing into subplot sprawl.

The app is intentionally focused on planning rather than manuscript writing. It helps the user generate and refine the romantic engine of a story: who the leads are, why they clash, why they secretly fit, what trope frame suits them best, and what premise can keep them in orbit long enough to make the relationship feel earned.

## What The App Builds

RomCon currently supports four main planning outputs:

* **Detailed lead character packs**
  Each lead is generated with internal story machinery rather than a flat descriptor list. The pack covers desire, fear, competence, emotional weakness, romantic blind spot, pressure points, social role, and dialogue texture.

* **Pairing analysis**
  Once both leads exist, the app evaluates the match as a romcom pairing rather than a compatibility chart. It focuses on friction, fit, emotional lessons, scene engines, and trope suitability.

* **Premise generation**
  After the pairing is defined, the app produces a novella-scale setup with a logline, forced-proximity device, central obstacle, midpoint turn, finale payoff, and chapter-beat direction.

* **Trope table support**
  The app includes a built-in trope reference layer so the user can bias generation toward specific romantic comedy structures such as fake dating, enemies to lovers, forced proximity, second chance, or accidental partnership.

## Core Product Direction

The MVP is built around a specific planning philosophy:

* Romance works best when the leads are designed as emotional systems, not just aesthetic concepts.
* Good pairings are driven by productive friction, not abstract compatibility.
* A strong premise should naturally force repeated contact and escalating vulnerability.
* A novella needs a clean, efficient engine. One couple, one primary hook, one emotional arc per lead, and one obstacle that can break them if handled badly.

That means RomCon is not trying to be a general writing suite. It is much narrower than that. It exists to generate the pressure cooker and make sure the central couple can actually carry the story.

## Writer Profile Implementation

The original project notes included a writer profile that was tuned much more heavily toward survival fiction, bodily transformation, and darker speculative storytelling. That did not match the romantic comedy goal, so the current implementation replaces that direction with a dedicated romcom-specific profile in [writer_profile.md](H:\WebHatchery\apps\romcon\writer_profile.md).

The rewritten profile does several important things:

* defines the target voice as emotionally close, warm, clever, and contemporary
* prioritizes chemistry through contrast rather than generic "perfect match" alignment
* frames world-building in social and logistical terms such as weddings, work, community, housing, family, and reputation
* gives explicit guardrails for pacing, emotional exposure, dialogue rhythm, and tonal balance
* keeps the generation aligned to novella scale instead of drifting into a larger, messier book shape

This profile is part of the implementation, not just a note. The generator uses it as the creative operating manual for Gemini output.

## Current User Flow

The app is built around a simple planning loop:

1. Enter or refine a concept brief.
2. Generate two lead character packs.
3. Select or bias toward a trope.
4. Evaluate the pairing.
5. Generate a premise and chapter-shape planning beats.
6. Save the plan for later revision.

This flow is deliberate. The app does not start from trope alone, and it does not jump straight to a premise before the couple is doing real work. Character leads first, pairing second, premise third.

## Authentication And Project Ownership

RomCon supports both full accounts and guest sessions.

Guest access exists so a user can begin exploring ideas immediately without being blocked by sign-up. A guest can generate character packs, pairing analysis, premises, and save plans under a guest identity. If that user later creates or logs into a real account, the guest project data can be linked forward so the planning work is not lost.

This matters for the intended product feel. RomCon is meant to be fast to enter and forgiving to experiment with. The auth flow supports that by letting casual use happen first and account commitment happen later.

## Project Saving

Saved projects are novella planning boards, not full manuscripts. Each project can currently store:

* title
* heat level
* target word count
* summary
* lead one
* lead two
* pairing analysis
* premise output
* trope notes
* freeform notes

This structure keeps the app centered on pre-draft planning. The user is not storing scenes, chapters, or prose drafts as primary entities in the current MVP.

## Frontend Implementation

The frontend is built as a focused planner rather than a multi-tool dashboard.

The main experience is a single workspace with:

* an auth entry panel for login, registration, or guest access
* a project sidebar for saved plans
* a trope table for selection and reference
* a planning form for concept, heat level, setting, and target words
* dedicated display areas for lead packs, pairing logic, premise output, and notes

The visual direction is intentionally more romantic and editorial than generic app UI. The interface uses a softer palette, large serif headlines, glass-style panels, and a layout that treats the plan as a curated creative board instead of a spreadsheet.

The frontend does not attempt to do too much at once. It is designed so the user can move through the planning sequence in a clear order without getting buried under controls.

## Backend Implementation

The backend supports the planning loop with a compact set of responsibilities:

* user registration and login
* guest session creation
* guest-to-account linking
* plan create/read/update/delete
* trope catalog delivery
* Gemini-backed generation endpoints for:
  * character packs
  * pairing analysis
  * premise generation

The backend stores plans as structured planning records rather than trying to normalize every possible writing concept into a huge schema. That is a deliberate implementation choice for MVP speed and simplicity.

The generation layer is prompt-shaped around the romcom writer profile, so the app is not just calling a model with thin raw prompts. It is trying to keep the output aesthetically and structurally aligned to the product's purpose.

## Database Shape

The current database footprint is intentionally small.

There are two main persisted concepts:

* **users**
  For registered account ownership

* **plans**
  For stored novella planning records, including serialized generation outputs

Database initialization is SQL-only. The schema lives in [schema.sql](H:\WebHatchery\apps\romcon\backend\database\schema.sql). Future database changes for this app should follow the same approach and stay in `.sql` files rather than being hidden inside a PHP init script.

## Gemini Usage

Gemini is used as the generation engine in the same general spirit as the `rambler` project, but the shape of the prompts is very different here.

RomCon generation is structured around:

* romantic comedy tone control
* novella-size pacing
* opposition-driven chemistry
* clean forced-proximity hooks
* useful JSON outputs that can be stored and edited

The implementation goal is not "write a whole book." It is "generate planning assets that are strong enough to help a human writer make good decisions quickly."

## What MVP Includes

The current MVP includes:

* romcom-specific creative profile
* account and guest access
* saved planning projects
* two-lead character generation
* pairing analysis
* premise generation
* trope browsing and selection
* note-taking inside a saved plan

## What MVP Does Not Include

The current implementation does not yet try to solve:

* full drafting or manuscript editing
* scene card systems
* dialogue generation workbenches
* chapter management as first-class records
* collaboration features
* publishing pipelines
* advanced analytics
* broad multi-genre support

Those are intentionally excluded so the first version stays coherent. The core question for MVP is whether the app can consistently help users produce stronger romcom setups faster.

## Folder Overview

* `frontend/`
  The user-facing planning workspace.

* `backend/`
  The API, plan persistence layer, auth flow, and Gemini-backed generation logic.

* `writer_profile.md`
  The romcom creative operating manual used by the generation system.

* `design.md`
  Early product thinking and generation goals that informed the MVP implementation.

## Summary

RomCon is currently implemented as a romantic comedy setup engine. It is not trying to replace the writer. It is trying to make the most failure-prone early decisions easier: choosing better leads, building more productive romantic tension, matching the right trope frame, and landing on a premise that can actually sustain a breezy novella.

That narrowness is the point. The app is meant to help the user get to a sharper, more marketable romantic comedy plan with less wandering and less generic output.
