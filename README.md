# RomCon

RomCon is a romantic-comedy novella planner and draft studio. It builds a structured story package first, then lets the user draft chapters from that package inside the app.

The product is designed around one principle: planning and drafting should stay connected, but they should not be the same step.

## Current Product Shape

RomCon now ships with five connected workspaces:

1. `Story Planner`
   Build the story in stages: `Concept`, `Leads`, `Pairing`, `Cast`, `Premise`, `Chapters`, `Save`.
2. `Cast Library`
   Store reusable supporting characters and inject them back into active plans.
3. `Draft Studio`
   Draft or regenerate individual chapters from the current plan, cast, chapter details, and writer profile, then compile a manuscript view.
4. `Writer Profile`
   Edit the effective writing voice used during generation.
5. `Story Summary`
   Review and export the assembled plan package.

## Planner Flow

The main workflow is:

1. Build the concept frame.
2. Generate the two leads.
3. Generate the pairing logic.
4. Add supporting cast pressure.
5. Build the premise.
6. Generate chapter details.
7. Save and review the story package.

The planner is intentionally stage-driven. Each stage has a focused workspace, one dominant action, and sticky workflow controls.

## Draft Flow

Drafting is separate from planning, but it is not disconnected from it.

Draft Studio works like this:

1. Generate chapter details in the planner.
2. Open `Draft Studio`.
3. Select a chapter.
4. Generate or regenerate that chapter from the current plan state.
5. Revise the chapter or save manual edits.
6. Compile drafted chapters into a manuscript view.

Any regenerated chapter uses the latest version of the plan, including cast, premise, chapter details, and writer profile.

## Writer Voice

The built-in writer voice is no longer sourced from a loose root-level markdown file.

It now lives in:

`backend/src/Prompts/writer_profile.json`

The backend loads it through the shared prompt-definition loader, the same way other generator prompt definitions are loaded. Users can still override that default per account through the Writer Profile workspace.

## Prompt System

Generator prompt definitions are stored in:

`backend/src/Prompts/`

The backend loads them through:

`backend/src/Services/PromptDefinitionLoader.php`

This keeps prompt text out of the action classes and makes production prompt loading more reliable.

## Backend Overview

The backend is a Slim-based API responsible for:

- authentication and guest sessions
- plan persistence
- cast library persistence
- writer profile persistence
- trope and flavor seed management
- generation endpoints for concept, leads, pairing, cast, premise, chapter details, and chapter drafts
- export packaging

Important backend paths:

- `backend/src/Actions/`
- `backend/src/Controllers/`
- `backend/src/Models/`
- `backend/src/Prompts/`
- `backend/src/Services/`
- `backend/database/schema.sql`
- `backend/public/index.php`

## Frontend Overview

The frontend is a React + TypeScript + Vite app.

Important frontend paths:

- `frontend/src/components/`
- `frontend/src/hooks/`
- `frontend/src/stores/`
- `frontend/src/api/`
- `frontend/src/types/`

The main planner shell lives in:

- `frontend/src/components/PlannerWorkspace.tsx`
- `frontend/src/components/planner/StoryPlannerView.tsx`

## Data Shape

Plans now include more than early MVP story setup. A saved plan can include:

- concept and setup fields
- two leads
- pairing result
- active cast
- premise result
- chapter details
- drafted chapters
- notes
- effective writer profile in export payloads

## Local Development

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Backend

```powershell
cd backend
composer install
php -S localhost:8000 -t public
```

Environment files already exist for local and deployment-specific setups under `backend/` and `frontend/`.

## Deployment Notes

`publish.ps1` is kept as repo tooling for deployment. It is operational tooling, not application code.

Generated build output such as `frontend/dist/` should not be treated as source of truth.

## Repository Cleanup

This repo has been cleaned to remove non-product artifacts such as:

- sample chapter output
- exported sample JSON files
- old root-level writer profile source
- stale design notes
- Bruno API collection files
- generated frontend build output and TypeScript build info files

## Summary

RomCon is no longer just a lead-and-premise generator. It is now a structured romcom planning system with a connected chapter drafting layer.

The core contract is:

- build a stronger story package
- keep supporting cast active in the story engine
- draft from the package inside the app
- preserve a clear separation between planning and prose generation
