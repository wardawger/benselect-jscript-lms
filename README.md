# JScript in Selerix BenSelect — LMS

A fully self-contained learning management system for JScript scripting inside Selerix BenSelect benefits enrollment software.

## What's inside

- **14 modules** across 3 tracks: Language Foundation, BenSelect Architecture, Applied JScript
- **Coding challenges** on every lesson with hint system, keyword scoring, and model solutions
- **Quiz coding exercises** on every module quiz (+2 bonus points toward passing)
- **IntelliSense** autocomplete for BenSelect-specific APIs in all code editors
- **Glossary & Index** with 90+ searchable BenSelect and JScript.NET definitions
- **User login** with progress persistence via localStorage
- **Admin panel** for the first account to manage users and view progress
- **Final certification exam** — Parts A (MC), B (code reading), C (code writing)

## Live demo

Hosted at: `https://<your-username>.github.io/<repo-name>/`

## Deploy

This is a single `index.html` file — no build step, no server, no dependencies beyond Google Fonts.

1. Push `index.html` to a GitHub repository
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save — live in ~60 seconds

## Notes

- All data (user accounts, progress) is stored in the browser's `localStorage` — it does not leave the device
- The first account created automatically becomes Admin
- Progress does not sync between devices or browsers
- Works fully offline after initial load (fonts require internet on first visit)
